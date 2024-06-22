import React, { useState, useEffect } from 'react';
import { Container, Button, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { apiInstance } from '../util/api.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Orders.css';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [orderIdToDelete, setOrderIdToDelete] = useState(null);
    const [refundReason, setRefundReason] = useState(''); // 취소 사유 상태 추가
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();
    const orderStateMap = {
        PENDING: "주문 완료",
        CONFIRMED: "주문 확인",
        SHIPPED: "상품 발송",
        DELIVERED: "배송 완료",
        CANCELLED: "주문 취소"
    };

    useEffect(() => {
        fetchOrders();
    }, [page]);

    const fetchOrders = async () => {
        try {
            const response = await apiInstance.get('/orders', {
                params: {
                    page: page,
                    size: 10
                }
            });
            setOrders(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        }
    };

    const openModal = (id) => {
        setOrderIdToDelete(id);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setOrderIdToDelete(null);
        setRefundReason(''); // 모달 닫을 때 취소 사유 초기화
    };

    const deleteOrderData = async () => {
        const reason = refundReason || '';
        try {
            await apiInstance.patch(`/orders/${orderIdToDelete}`, { refundReason: reason });
            fetchOrders();
            closeModal();
        } catch (error) {
            console.error('Failed to delete order:', error);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
        }
    };

    const handleOrderClick = (orderId) => {
        navigate(`/my-page/orders/order/${orderId}`);
    };

    return (
        <div>
            <section className="order-section">
                <Container>
                    <div className="order-account-header">
                        <h1 className="order-subtitle">주문조회</h1>
                    </div>
                    <Container className="order-orders-container">
                        <div className="order-orders-top">
                            <div className="order-col-2">주문 날짜</div>
                            <div className="order-col-4">주문 정보</div>
                            <div className="order-col-2">주문 가격</div>
                            <div className="order-col-2">주문 상태</div>
                            <div className="order-col-2">취소 신청</div>
                        </div>
                        {orders.length === 0 ? (
                            <div className="no-orders">주문 내역이 없습니다</div>
                        ) : (
                            orders.map(order => (
                                <div
                                    className={`order-orders-item ${order.orderState === 'CANCELLED' ? 'cancelled' : ''}`}
                                    key={order.id}>
                                    <div className="order-col order-col-2">
                                        {moment(order.createdAt).isValid()
                                            ? moment(order.createdAt).format('YYYY-MM-DD')
                                            : 'Invalid Date'}
                                    </div>
                                    <div className="order-col order-col-1" onClick={() => handleOrderClick(order.id)}>
                                        <img src={order.repItemImage} className="order-item-image" alt="대표 상품"/>
                                    </div>
                                    <div className="order-col order-col-3 order-summary" onClick={() => handleOrderClick(order.id)}>
                                        {order.totalQuantity - 1 === 0 ? order.repItemName : `${order.repItemName} 외 ${order.totalQuantity - 1}건`}
                                    </div>
                                    <div
                                        className="order-col order-col-2">{order.price ? order.price.toLocaleString() + " 원" : '-'}</div>
                                    <div className="order-col order-col-2">{orderStateMap[order.orderState]}</div>
                                    <div className="order-col order-col-2 order-cancel-button-container">
                                        <button
                                            className="order-cancel-button"
                                            onClick={() => openModal(order.id)}
                                            disabled={order.orderState === 'CANCELLED'}
                                        >
                                            주문 취소
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                        <div className="order-pagination">
                            <Button onClick={() => handlePageChange(page - 1)} disabled={page === 0}>
                                이전
                            </Button>
                            <span>{page + 1} / {totalPages}</span>
                            <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages - 1}>
                                다음
                            </Button>
                        </div>
                    </Container>
                </Container>
            </section>

            <Modal show={showModal} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>주문 취소 확인</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="refundReason">
                        <Form.Label>취소 사유</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={refundReason}
                            onChange={(e) => setRefundReason(e.target.value)}
                            placeholder="취소 사유를 입력해주세요"
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>
                        아니오
                    </Button>
                    <Button variant="danger" onClick={deleteOrderData}>
                        네
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Orders;
