/* global daum */
import React, { useState } from 'react';
import { Form, Button, Modal, ListGroup } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import useUserStore from '../stores/useUserStore.js';
import './Order.css';

function Order() {
    const location = useLocation();
    const { cartItems = [], productTotal = 0, shipping = 0, total = 0 } = location.state || {};
    const user = useUserStore(state => state.user);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [showAddAddressModal, setShowAddAddressModal] = useState(false);

    const [formData, setFormData] = useState({
        orderCustomer: user ? user.displayName : '',
        phone: '',
        address: ''
    });
    const [addresses, setAddresses] = useState([]);
    const [newAddress, setNewAddress] = useState({
        receiverName: '',
        addressName: '',
        phoneNumber: '',
        postalCode: '',
        address: '',
        detailAddress: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleNewAddressChange = (e) => {
        const { name, value } = e.target;
        setNewAddress({ ...newAddress, [name]: value });
    };

    const handleAddAddress = () => {
        setAddresses([...addresses, newAddress]);
        setNewAddress({
            receiverName: '',
            addressName: '',
            phoneNumber: '',
            postalCode: '',
            address: '',
            detailAddress: ''
        });
        setShowAddAddressModal(false);
    };

    const handleSelectAddress = (address) => {
        setFormData({
            ...formData,
            address: `${address.address} ${address.detailAddress}`
        });
        setShowAddressModal(false);
    };

    const handlePostcode = () => {
        new daum.Postcode({
            oncomplete: function(data) {
                setNewAddress({
                    ...newAddress,
                    postalCode: data.zonecode,
                    address: data.address
                });
            }
        }).open();
    };

    return (
        <div className="order-container">
            <h1>ORDER</h1>
            <div className="order-form">
                <div className="shipping-info">
                    <h2>배송 정보</h2>
                    <Form>
                        <Form.Group controlId="formOrderCustomer">
                            <Form.Label>주문고객</Form.Label>
                            <Form.Control type="text" name="orderCustomer" value={formData.orderCustomer} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group controlId="formPhone">
                            <Form.Label>휴대폰 번호</Form.Label>
                            <Form.Control type="text" name="phone" value={formData.phone} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group controlId="formAddress">
                            <Form.Label>배송 주소</Form.Label>
                            <Form.Control type="text" name="address" value={formData.address} onClick={() => setShowAddressModal(true)} readOnly 
                                placeholder="눌러서 주소를 선택하세요!"/>
                        </Form.Group>
                    </Form>
                </div>
                <div className="payment-info">
                    <h2>결제 정보</h2>
                    {cartItems && cartItems.map((item, index) => (
                        <div key={index} className="product-item">
                            <p className="product-title">상품명: {item.title}</p>
                            <p className="product-price">가격: {item.price.toLocaleString()} 원</p>
                            <p className="product-quantity">수량: {item.quantity}</p>
                        </div>
                    ))}
                    <p className="total-amount">총 상품 금액: {productTotal.toLocaleString()} 원</p>
                    <p className="total-amount">배송비: {shipping.toLocaleString()} 원</p>
                    <p className="total-amount">총 결제 금액: {total.toLocaleString()} 원</p>
                    <Button variant="primary">결제하기</Button>
                </div>
            </div>

            {/* 주소선택화면 */}
            <Modal show={showAddressModal} onHide={() => setShowAddressModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>배송지 선택</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ListGroup>
                        {addresses.map((address, index) => (
                            <ListGroup.Item key={index} action onClick={() => handleSelectAddress(address)}>
                                {address.addressName}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                    <Button variant="secondary" onClick={() => setShowAddAddressModal(true)}>주소 추가</Button>
                </Modal.Body>
            </Modal>

            {/* 주소추가화면 */}
            <Modal show={showAddAddressModal} onHide={() => setShowAddAddressModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>주소 추가</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formAddressName">
                            <Form.Label>배송지명</Form.Label>
                            <Form.Control type="text" name="addressName" value={newAddress.addressName} onChange={handleNewAddressChange} />
                        </Form.Group>
                        <Form.Group controlId="formReceiverName">
                            <Form.Label>수령자</Form.Label>
                            <Form.Control type="text" name="receiverName" value={newAddress.receiverName} onChange={handleNewAddressChange} />
                        </Form.Group>
                        <Form.Group controlId="formPhoneNumber">
                            <Form.Label>휴대전화 번호</Form.Label>
                            <Form.Control type="text" name="phoneNumber" value={newAddress.phoneNumber} onChange={handleNewAddressChange} />
                        </Form.Group>
                        <Form.Group controlId="formPostalCode">
                            <Form.Label>우편번호</Form.Label>
                            <div className="d-flex">
                                <Form.Control type="text" name="postalCode" value={newAddress.postalCode} onChange={handleNewAddressChange} readOnly />
                                <Button variant="secondary" onClick={handlePostcode}>주소찾기</Button>
                            </div>
                        </Form.Group>
                        <Form.Group controlId="formAddress">
                            <Form.Label>주소</Form.Label>
                            <Form.Control type="text" name="address" value={newAddress.address} onChange={handleNewAddressChange} readOnly />
                        </Form.Group>
                        <Form.Group controlId="formDetailAddress">
                            <Form.Label>상세주소</Form.Label>
                            <Form.Control type="text" name="detailAddress" value={newAddress.detailAddress} onChange={handleNewAddressChange} />
                        </Form.Group>
                        <Form.Group controlId="formDeliveryReq">
                            <Form.Label>배송시 요청사항</Form.Label>
                            <Form.Control type="text" name="formDeliveryReq" value={newAddress.formDeliveryReq} onChange={handleNewAddressChange} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleAddAddress}>저장</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Order;
