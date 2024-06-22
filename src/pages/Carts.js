import React, { useState, useEffect } from 'react';
import './Carts.css';
import useUserStore from '../stores/useUserStore.js';
import { useNavigate } from 'react-router-dom';

function Carts() {
    const [cartItems, setCartItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [allSelected, setAllSelected] = useState(false);
    const user = useUserStore(state => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            const cartKey = `cart_${user.id}`;
            const storedCartItems = JSON.parse(localStorage.getItem(cartKey)) || [];
            console.log('Stored Cart Items:', storedCartItems); // Debug: Check stored items
            setCartItems(storedCartItems);
        }
    }, [user]);

    useEffect(() => {
        if (cartItems.length === selectedItems.length && cartItems.length > 0) {
            setAllSelected(true);
        } else {
            setAllSelected(false);
        }
    }, [selectedItems, cartItems]);

    const handleQuantityChange = (itemIndex, optionIndex, delta) => {
        const updatedCartItems = cartItems.map((item, i) => {
            if (i === itemIndex) {
                const updatedOptions = item.options.map((option, j) => 
                    j === optionIndex 
                        ? { ...option, quantity: Math.max(1, option.quantity + delta) } 
                        : option
                );
                return { ...item, options: updatedOptions };
            }
            return item;
        });
        setCartItems(updatedCartItems);
        localStorage.setItem(`cart_${user.id}`, JSON.stringify(updatedCartItems));
    };

    const handleRemoveItem = (itemIndex, optionIndex) => {
        const updatedCartItems = cartItems.map((item, i) => {
            if (i === itemIndex) {
                const updatedOptions = item.options.filter((_, j) => j !== optionIndex);
                return { ...item, options: updatedOptions };
            }
            return item;
        }).filter(item => item.options.length > 0);
        setCartItems(updatedCartItems);
        localStorage.setItem(`cart_${user.id}`, JSON.stringify(updatedCartItems));
    };

    const handleSelectAll = (e) => {
        const isChecked = e.target.checked;
        setAllSelected(isChecked);
        if (isChecked) {
            const allItems = cartItems.flatMap((item, itemIndex) =>
                item.options.map((option, optionIndex) => ({ itemIndex, optionIndex }))
            );
            setSelectedItems(allItems);
        } else {
            setSelectedItems([]);
        }
    };

    const handleSelectItem = (itemIndex, optionIndex) => {
        const isSelected = selectedItems.some(
            selected => selected.itemIndex === itemIndex && selected.optionIndex === optionIndex
        );
        if (isSelected) {
            setSelectedItems(selectedItems.filter(
                selected => !(selected.itemIndex === itemIndex && selected.optionIndex === optionIndex)
            ));
        } else {
            setSelectedItems([...selectedItems, { itemIndex, optionIndex }]);
        }
    };

    const calculateItemTotal = (item, options) => {
        return options.reduce((total, option) => total + (item.price * option.quantity), 0);
    };

    const selectedItemsTotal = selectedItems.reduce((total, selected) => {
        const item = cartItems[selected.itemIndex];
        const option = item.options[selected.optionIndex];
        return total + (item.price * option.quantity);
    }, 0);

    const SHIPPING = 2500;
    const total = selectedItemsTotal + SHIPPING;

    const handleOrder = () => {
        const selectedCartItems = cartItems.map((item, itemIndex) => ({
            ...item,
            options: item.options.filter((_, optionIndex) =>
                selectedItems.some(
                    selected => selected.itemIndex === itemIndex && selected.optionIndex === optionIndex
                )
            )
        })).filter(item => item.options.length > 0);
        
        navigate('/orders', { state: { cartItems: selectedCartItems, productTotal: selectedItemsTotal, shipping: SHIPPING, total } });
    };

    return (
        <div className="Carts_cart-page">
            <h1 className="Carts_cart-title">CART</h1>
            <div className="Carts_cart-container">
                <div className="Carts_select-all">
                    <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={handleSelectAll}
                    />
                    <span>전체선택</span>
                </div>
                {cartItems.map((item, itemIndex) => (
                    item.options.map((option, optionIndex) => (
                        <div key={`${itemIndex}-${optionIndex}`} className="Carts_cart-item">
                            <input
                                type="checkbox"
                                checked={selectedItems.some(
                                    selected => selected.itemIndex === itemIndex && selected.optionIndex === optionIndex
                                )}
                                onChange={() => handleSelectItem(itemIndex, optionIndex)}
                            />
                            <img src={item.mainImage} alt={item.itemName} className="Carts_item-image" />
                            <div className="Carts_item-details">
                                <div className="Carts_item-info">
                                    <div className="Carts_item-name">
                                        {item.itemName} / {option.size} / {option.color}
                                    </div>
                                </div>
                                <div className="Carts_item-quantity">
                                    <button onClick={() => handleQuantityChange(itemIndex, optionIndex, -1)}>&lt;</button>
                                    <span>{option.quantity}</span>
                                    <button onClick={() => handleQuantityChange(itemIndex, optionIndex, 1)}>&gt;</button>
                                </div>
                                <div className="Carts_item-price">{(item.price * option.quantity).toLocaleString()} 원</div>
                                <button className="Carts_item-remove" onClick={() => handleRemoveItem(itemIndex, optionIndex)}>x</button>
                            </div>
                        </div>
                    ))
                ))}
            </div>
            <div className="Carts_order-sheet">
                <div className="Carts_order-details">
                    <div className="Carts_order-total">
                        <span>총 주문금액</span>
                        <span>{selectedItemsTotal.toLocaleString()} 원</span>
                    </div>
                    <div className="Carts_shipping">
                        <span>배송비</span>
                        <span>{SHIPPING.toLocaleString()} 원</span>
                    </div>
                    <div className="Carts_total">
                        <span>합계</span>
                        <span>{total.toLocaleString()} 원</span>
                    </div>
                </div>
                <button className="Carts_order-button" onClick={handleOrder} disabled={selectedItems.length === 0}>주문하기</button>
            </div>
        </div>
    );
}

export default Carts;
