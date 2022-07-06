import React, { Component } from 'react';
import PoweredByObsess from '../ui/PoweredByObsess';
import './BottomBarRight.css';


class BottomBarRight extends Component {
    constructor() {
        super()
    }

    render() {
        return (
            <div id='bottomBarRight'>             
                <PoweredByObsess/>                         
            </div>
        );
    }
}

export default BottomBarRight;
