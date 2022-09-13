import React, { Component } from 'react';
import './BottomBarRight.css';

const obsessLogoStyle = {
    maxWidth: '100%',
    width: '3.5em',
    paddingLeft: '0.15em',
    cursor:'pointer',
};

const isMobileDevice = function(){
    //for now
    return false;
}

const defaultObsessUrl = 'http://www.obsessAR.com/';
const isMobile = isMobileDevice();

class PoweredByObsess extends Component {
    constructor(props) {
        super(props);
        this.goToObsessUrl = this.goToObsessUrl.bind(this);
        this.logoOnClick = null;
        this.logoOnTouchEnd = null;
        this.tipOnClick = null;
        this.tipOnTouchEnd = null;
        if (isMobile) {
            this.logoOnTouchEnd = this.goToObsessUrl;
            this.tipOnTouchEnd = this.toggleTipPanel;
        } else {
            this.logoOnClick = this.goToObsessUrl;
            this.tipOnClick = this.toggleTipPanel;
        }

        this.state = {
            obsessLogoSrc: 'https://cdn.obsess-vr.com/obsess-logo.png',
            obsessUrl: defaultObsessUrl,
        };
    }

    componentDidMount() {}

    goToObsessUrl() {
        this.setState({
            isTipShowing: false,
            isDisclaimerShowing: false
        });
        window.open(this.state.obsessUrl, '_blank');
    }

    render() {
        return (<div style={{float: 'left', marginLeft: '0.5em', height: '16px'}}>
            <div
                style={{height: '100%'}}
                className='hoverable'
                onClick={this.logoOnClick}
                onTouchEnd={this.logoOnTouchEnd}
            >
                <div style={{height: '100%'}}>
                    <p style={{color:'white', cursor:'pointer', lineHeight: '16px'}}>Powered by</p>
                </div>
                <div id='bottomBarObsessLogoWrapper' style={{height: '100%'}}>
                    <img
                        src={this.state.obsessLogoSrc}
                        style={obsessLogoStyle}
                    />
                </div>
            </div>
        </div>
        );
    }

}

export default PoweredByObsess;
