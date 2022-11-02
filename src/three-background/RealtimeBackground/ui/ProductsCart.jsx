import React, { Component } from 'react'
import './ProductsCart.css';

const cartIcons = {
    'filled' : "https://cdn.obsess-vr.com/Cart-icon.png",
    'empty' : "https://cdn.obsess-vr.com/Empty-cart-icon.png",
};

export default class ProductsCart extends Component {
	constructor(props){
		super(props)
        this.showModal = props?.showModal;
	}

	render() {
		return (
            <div className='products-cart-button' onClick={this.showModal}>
                <img className='products-cart-icon' src={this.props?.cartItems?.length === 0 ? cartIcons['empty'] : cartIcons['filled']} />
                <p className='products-cart-number'>{this.props?.cartItems?.length || 0}</p>
            </div>
        )
    }
}