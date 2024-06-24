/* global daum */
import React, { useState, useEffect } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { apiInstance } from './util/api.js';
import Cookies from 'js-cookie';
import './OrderEdit.css';

function OrderEdit({ show, handleClose, orderId, initialData, onSave }) { // onSave 콜백 추가
    const [formData, setFormData] = useState({
        recipientName: '',
        addrName: '',
        recipientTel: '',
        zipcode: '',
        addr: '',
        addrDetail: '',
        deliveryReq: '',
        shippingCost: 0, // 초기값 설정
    });
    const [customDeliveryReq, setCustomDeliveryReq] = useState(false);
    const jwtToken = Cookies.get('jwtToken');

    useEffect(() => {
        if (initialData) {
            setFormData({
                recipientName: initialData.recipientName || '',
                addrName: initialData.addrName || '',
                recipientTel: initialData.recipientTel || '',
                zipcode: initialData.zipcode || '',
                addr: initialData.addr || '',
                addrDetail: initialData.addrDetail || '',
                deliveryReq: initialData.deliveryReq || '',
                shippingCost: initialData.shippingCost || 0, // 초기값 설정
            });
            if (initialData.deliveryReq === 'custom') {
                setCustomDeliveryReq(true);
            }
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleDeliveryReqChange = (e) => {
        const value = e.target.value;
        if (value === 'custom') {
            setCustomDeliveryReq(true);
            setFormData({
                ...formData,
                deliveryReq: ''
            });
        } else {
            setCustomDeliveryReq(false);
            setFormData({
                ...formData,
                deliveryReq: value
            });
        }
    };

    const handlePostcode = () => {
        new daum.Postcode({
            oncomplete: function (data) {
                setFormData({
                    ...formData,
                    zipcode: data.zonecode,
                    addr: data.address
                });
            }
        }).open();
    };

    const handleSubmit = async () => {
        try {
            await apiInstance.put(`/orders/${orderId}`, formData, {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json'
                }
            });
            toast.success('배송 정보가 성공적으로 수정되었습니다!');
            handleClose();
            onSave(); // 데이터 업데이트 후 onSave 호출
        } catch (error) {
            console.error('Failed to update address:', error);
            toast.error('배송 정보 수정에 실패했습니다.');
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton className="orderEdit-modal-header">
                <Modal.Title className="orderEdit-modal-title">배송 정보 수정</Modal.Title>
            </Modal.Header>
            <Modal.Body className="orderEdit-modal-body">
                <Form>
                    <Form.Group controlId="formRecipientName">
                        <Form.Label>수령자</Form.Label>
                        <Form.Control
                            type="text"
                            name="recipientName"
                            value={formData.recipientName}
                            onChange={handleChange}
                            className="orderEdit-form-control"
                        />
                    </Form.Group>
                    <Form.Group controlId="formAddrName">
                        <Form.Label>배송지명</Form.Label>
                        <Form.Control
                            type="text"
                            name="addrName"
                            value={formData.addrName}
                            onChange={handleChange}
                            className="orderEdit-form-control"
                        />
                    </Form.Group>
                    <Form.Group controlId="formRecipientTel">
                        <Form.Label>휴대전화 번호</Form.Label>
                        <Form.Control
                            type="text"
                            name="recipientTel"
                            value={formData.recipientTel}
                            onChange={handleChange}
                            className="orderEdit-form-control"
                        />
                    </Form.Group>
                    <Form.Group controlId="formZipcode">
                        <Form.Label>우편번호</Form.Label>
                        <div className="orderEdit-d-flex">
                            <Form.Control
                                type="text"
                                name="zipcode"
                                value={formData.zipcode}
                                onChange={handleChange}
                                readOnly
                                className="orderEdit-form-control"
                            />
                            <Button variant="secondary" onClick={handlePostcode} className="orderEdit-button-secondary">주소찾기</Button>
                        </div>
                    </Form.Group>
                    <Form.Group controlId="formAddr">
                        <Form.Label>주소</Form.Label>
                        <Form.Control
                            type="text"
                            name="addr"
                            value={formData.addr}
                            onChange={handleChange}
                            readOnly
                            className="orderEdit-form-control"
                        />
                    </Form.Group>
                    <Form.Group controlId="formAddrDetail">
                        <Form.Label>상세주소</Form.Label>
                        <Form.Control
                            type="text"
                            name="addrDetail"
                            value={formData.addrDetail}
                            onChange={handleChange}
                            className="orderEdit-form-control"
                        />
                    </Form.Group>
                    <Form.Group controlId="formDeliveryReq">
                        <Form.Label>배송 요청사항</Form.Label>
                        <Form.Control
                            as="select"
                            name="deliveryReq"
                            value={formData.deliveryReq || ''}
                            onChange={handleDeliveryReqChange}
                            className="orderEdit-form-control"
                        >
                            <option value="" disabled>배송 요청 사항을 선택하세요</option>
                            <option value="문 앞에 두고 가주세요">문 앞에 두고 가주세요</option>
                            <option value="경비실에 맡겨주세요">경비실에 맡겨주세요</option>
                            <option value="택배함에 넣어주세요">택배함에 넣어주세요</option>
                            <option value="custom">직접 입력</option>
                        </Form.Control>
                        {customDeliveryReq && (
                            <Form.Control
                                type="text"
                                name="deliveryReq"
                                placeholder="배송 요청 사항을 입력하세요"
                                value={formData.deliveryReq}
                                onChange={handleChange}
                                className="orderEdit-form-control"
                            />
                        )}
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer className="orderEdit-modal-footer">
                <Button variant="secondary" onClick={handleClose} className="orderEdit-button-secondary">취소</Button>
                <Button variant="primary" onClick={handleSubmit} className="orderEdit-button-primary">수정하기</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default OrderEdit;
