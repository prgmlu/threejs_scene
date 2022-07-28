import * as THREE from 'three';
import RemoteChar from './RemoteChar';

const USE_SOCKET_IO = true;
const SOCKET_SERVER_URL = USE_SOCKET_IO? 'http://192.168.1.122:8000/' : 'ws://192.168.1.122:8000/';

// const SOCKET_SERVER_URL = USE_SOCKET_IO? 'http://ec2-18-218-128-47.us-east-2.compute.amazonaws.com:8000/' : 'ws://192.168.1.122:8000/';

// var io = require('socket.io-client');
// var socket = io.connect('');
// socket2.emit('test');


// const SOCKET_SERVER_URL = 'ws://ec2-18-218-128-47.us-east-2.compute.amazonaws.com:8000/';

//for now, only broadcasting the positions and rotations

export default class CentralMultipleCharControls{
    constructor(mainCharControlsObj, otherChars){
        this.mainCharControlsObj = mainCharControlsObj;
        this.model = mainCharControlsObj.model;
        this.otherChars = otherChars;
        
        window.otherChars = otherChars;
        this.prev_addresses = [];
        
        //an important field that serves as an id among the other characters
        //get assigned by the server upon connection open
        // if the address is null no messages are sent
        this.address = null;
        
        
        this.clock = new THREE.Clock();


        
        this.createSocketAndConnect();
        if(USE_SOCKET_IO){
            this.socket.on('message', this.handleMessage.bind(this));
            this.socket.on('address', this.isNewAddress.bind(this));
            this.socket.on('disconnected', this.handleDisconnect.bind(this));

        }
        else{
            this.socket.onmessage = this.handleMessage.bind(this);
        }


        this.update();
    }

    createRemoteCharacter(position,rotation, address){
        return new RemoteChar('Female_Type_A', position, rotation, address);
    }

    getCharByAddress(address){
        return this.otherChars.filter((x)=>x.address == address)[0];
    }

    isNewAddress(data){
        if(USE_SOCKET_IO){
            if(!this.address){
                this.address = data;
                return true;
            }
            return false
        }
        //if websockets instead
        if(data.address){
            this.address = data.address;
            return true;
        }
        return false
    }

    checkAndHandleIfSomeoneDisconnected(data){
        let addresses = this.prev_addresses.slice();
        let data_addresses = Array.from(Object.keys(data));
        let diff = addresses.filter((x)=>!data_addresses.includes(x));
        //have to handle the rare case of 2 people disconnecting at the same server respone
        if(diff.length > 0){
            for(let address of diff){
                this.handleDisconnect(address);
            }
        }
    }

    handleDisconnect(address){;
        let char = this.getCharByAddress(address);
        if(char){
            this.otherChars.splice(this.otherChars.indexOf(char), 1);
            char.removeFromScene();
        }
    }
    
    
    handleMessage(event){;
        let data;
        if(USE_SOCKET_IO){
            data = JSON.parse(event);
        }
        else{
            data = JSON.parse(event.data);
        }

        if(!USE_SOCKET_IO){
            //data.address is sent only once when the connection is established, a number like  49673, we'll use it as an id
            if (this.isNewAddress(data)) return;
        }
        
        //check if someone disconnected

        if(!USE_SOCKET_IO){
            //no need to check if someone disconnected if we're using socket.io as there's an event that fires when someone disconnects
            this.checkAndHandleIfSomeoneDisconnected(data);
        }
        
        for(let address in data){
            //ignore your address
            if(address ==this.address)
            continue;
            
            let char = this.getCharByAddress(address);
            
            if(!char){
                //new character entered
                char = this.createRemoteCharacter(data[address].position,data[address].rotation, address);
                this.otherChars.push(char);
                
            }
            if(char.model){

                char.interpolateToPosition(data[address].position);

                // char.model.position.copy(data[address].position);
                char.model.rotation.copy(data[address].rotation);

                data[address].isWalking? char.playWalkingAnimation():char.playIdleAnimation();
            }
        }

        this.prev_addresses = Array.from(Object.keys(data));

        return false;
    }


    createSocketAndConnect(){
        if(USE_SOCKET_IO){
            var io = require('socket.io-client');
            this.socket = io.connect(SOCKET_SERVER_URL,{rejectUnauthorized: false });
        }
        else{
            this.socket = new WebSocket(SOCKET_SERVER_URL);
        }
    }

    sendData(){
        let address = this.address;
        if( !address)
            return;
            
        let data = {};
        data[address] = {};
        data[address].position = this.mainCharControlsObj.model.position;
        data[address].rotation = this.mainCharControlsObj.model.rotation;
        data[address].isWalking = this.mainCharControlsObj.isWalking;
        
        this.prevPosition = this.mainCharControlsObj.model.position.clone();
        this.prevRotation = this.mainCharControlsObj.model.rotation.clone();
        this.prevIsWalking = this.mainCharControlsObj.isWalking;
        
        if(USE_SOCKET_IO){
            if(this.socket.connected){
                this.socket.emit('data',JSON.stringify(data));
            }
        }
        else{

            if(this.socket.readyState === 1){
                this.socket.send(JSON.stringify(data));
            }
        }
    }




    update = () => {
        window.requestAnimationFrame(this.update);

        let updateDelta = this.clock.getDelta()
        this.mainCharControlsObj.update(updateDelta);
        this.otherChars.forEach(char => {
            char.mixer && char.mixer.update(updateDelta);
        });

        if(!this.prevPosition){
            this.sendData();
            return;
        }
        // if(this.mainCharControlsObj.model.position.distanceTo(this.prevPosition) > 0.01 || this.mainCharControlsObj.isWalking != this.prevIsWalking){
            this.sendData();
        // }
    }
}