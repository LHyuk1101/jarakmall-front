import React, { useState, useEffect } from 'react';
import './Carts.css';
import useUserStore from '../stores/useUserStore.js'; // import useUserStore
import { useNavigate } from 'react-router-dom';

function Carts() {
    const [cartItems, setCartItems] = useState([]);
    const user = useUserStore(state => state.user); // get user state
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            const cartKey = `cart_${user.id}`;
            const storedCartItems = JSON.parse(localStorage.getItem(cartKey)) || [];
            setCartItems(storedCartItems);
        }
    }, [user]);

    const handleQuantityChange = (index, delta) => {
        const updatedCartItems = cartItems.map((item, i) => 
            i === index 
                ? { ...item, quantity: Math.max(1, item.quantity + delta) } 
                : item
        );
        setCartItems(updatedCartItems);
        localStorage.setItem(`cart_${user.id}`, JSON.stringify(updatedCartItems));
    };

    const handleRemoveItem = index => {
        const updatedCartItems = cartItems.filter((_, i) => i !== index);
        setCartItems(updatedCartItems);
        localStorage.setItem(`cart_${user.id}`, JSON.stringify(updatedCartItems));
    };

    let productTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const SHIPPING = 2500;
    let total = productTotal + SHIPPING;

    const handleOrder = () => {
        navigate('/order', { state: { cartItems, productTotal, shipping: SHIPPING, total } });
    };

    return (
        <div className="cart-page">
            <h1 className="cart-title">CART</h1>
            <div className="cart-container">
                {cartItems.map((item, index) => (
                    <div key={index} className="cart-item">
                        <div className="item-image">상품 이미지</div>
                        <div className="item-details">
                            <div className="item-name">{item.title}</div>
                            <div className="item-options">{item.size} / {item.color}</div>
                            <div className="item-quantity">
                                <button onClick={() => handleQuantityChange(index, -1)}>&lt;</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => handleQuantityChange(index, 1)}>&gt;</button>
                            </div>
                            <div className="item-price">{item.price.toLocaleString()} 원</div>
                            <button className="item-remove" onClick={() => handleRemoveItem(index)}>x</button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="order-sheet">
                <div className="order-details">
                    <div className="order-total">
                        <span>총 주문금액</span>
                        <span>{productTotal.toLocaleString()} 원</span>
                    </div>
                    <div className="shipping">
                        <span>배송비</span>
                        <span>{SHIPPING.toLocaleString()} 원</span>
                    </div>
                    <div className="total">
                        <span>합계</span>
                        <span>{total.toLocaleString()} 원</span>
                    </div>
                </div>
                <button className="order-button" onClick={handleOrder}>주문하기</button>
            </div>
        </div>
    );
}

export default Carts;
