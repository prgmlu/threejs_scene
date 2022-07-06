import React from 'react';
import './SocialButton.css';

const SocialButton = ({ onClick, iconUrl, iconText, isMobile, active, children }) => {
    if (children) {
        return (
            <div className={active ? 'social-button-container social-button-active' : 'social-button-container'}
                onClick={() => { if (isMobile) return; onClick() }}
                onTouchEnd={onClick}
            >
                {children}
            </div>
        )
    } else {
        return (
            <div className={active ? 'social-button-container social-button-active' : 'social-button-container'}
                onClick={() => { if (isMobile) return; onClick() }}
                onTouchEnd={onClick}
            >
                <div className="social-button-icon-container">
                    <img className={active ? 'social-button-icon social-button-invert-color' : 'social-button-icon'} src={iconUrl} />
                </div>
                <span className={active ? 'social-button-text social-button-active' : 'social-button-text'}>
                    {iconText && iconText}
                </span>
            </div>
        )
    }
}

export default SocialButton;