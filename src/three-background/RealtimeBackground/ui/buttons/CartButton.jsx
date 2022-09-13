import React, { Component } from 'react';
import './CartButton.css';

const cartIcon = "https://cdn.obsess-vr.com/Cart_Icon.png";

export default class CartButton extends Component {
	constructor(props){
		super(props)
        this.itemId = props?.itemId;
        this.addToCart = props?.addToCart;
	}

    handleAddToCart = () => {
        this.addToCart(this.itemId);
      }

	render() {
		return (
            <div className='cart-button' onClick={this.handleAddToCart}>
                <p style={{lineHeight:'50px', fontSize:'large', fontWeight:'bold'}}>Add to cart</p>
            </div>
        )
    }
}