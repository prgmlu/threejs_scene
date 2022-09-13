import React, { Component } from 'react';
import './CartModal.css';

export default class CartModal extends Component {
    constructor(props) {
        super(props);
        this.cartItems = props?.cartItems;
        this.setCartItems = props?.setCartItems;
        this.storeItems = props?.storeItems;
    }
    state = {
        cartItems : [],
    }

    onRemove = (e) => {
        let currentItems = [];
        for(let i=0; i<this.state.cartItems.length; i++){
            if(this.state.cartItems[i].itemNum != e.target.id){
                currentItems.push(this.state.cartItems[i]);
            }
        }
        this.setCartItems(currentItems);
		this.setState({cartItems: currentItems});
    }

    componentDidMount(){
        this.setState({cartItems : this.cartItems})
    }

    render() {
        return (
            <div id='cartModal'>
                <img src='https://cdn.obsess-vr.com/Cart-modal.png' style={{height: '100%'}}/>
                <p style={{position: 'absolute', top:'30px', left: '20px', fontWeight: 'bold', fontSize: 'x-large'}}>Your Bag ({this.props.cartItems.length})</p>
                <div id='cartContainer'>
                    {this.state.cartItems.map((item) => {return(
                        <>
                        <div className='cartItem' key={item.itemNum} id={item.itemNum}>
                            <img style={{width:'200px', height:'200px'}}
                                    id={item.itemNum}
                                    src={this.storeItems.filter(storeItem => {return storeItem.id === item.itemID})[0].img}
                            />
                            <div className='productDetails' id={item.itemNum}>
                                <p id={item.itemNum} style={{fontWeight: 'bold', fontSize: 'x-large', margin: '20px auto 0 auto'}}>{this.storeItems.filter(storeItem => {return storeItem.id === item.itemID})[0].name}</p>
                                <p id={item.itemNum} style={{fontSize: 'large', marginTop: '0'}}>{this.storeItems.filter(storeItem => {return storeItem.id === item.itemID})[0].price}</p>
                            </div>
                            <img id={item.itemNum} className='cartRemoveButton' onClick={this.onRemove} src='https://cdn.obsess-vr.com/Trash.png'></img>
                        </div>
                        <hr style={{width:'90%', border: '1px solid #000000', alignSelf: 'center  '}}></hr>
                        </>
                    )})}
                </div>
                <div className='fadeMask'></div>
                <div className='checkoutButton'>
                    <p style={{fontWeight: 'bold', fontSize: 'x-large', margin: '0'}}>Check out</p>
                    <img style={{position:'relative', left:'10px'}} src='https://cdn.obsess-vr.com/Checkout.png'></img>
                </div>
            </div>
        );
    }
}