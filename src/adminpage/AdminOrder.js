import React, { useState, useEffect, useCallback } from 'react';
import { Container, Button, Modal } from 'react-bootstrap';
import { apiInstance } from '../util/api.js';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminOrder.css';
import moment from 'moment';

const AdminOrder = () => {
    const [orders, setOrders] = useState([]);
    const [summary, setSummary] = useState({
        ordersCount: 0,
        prepareCount: 0,
        deliveryCount: 0,
        completeCount: 0,
    });
    const [showModal, setShowModal] = useState(false);
    const [orderIdToDelete, setOrderIdToDelete] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const response = await apiInstance.get('/admin/orders', {
                params: {
                    page: page,
                    size: 10,
                },
            });
            const ordersData = response.data.content;
            setOrders(ordersData);
            setTotalPages(response.data.totalPages);
            updateSummary(ordersData);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const updateSummary = useCallback((orders) => {
        const summaryData = {
            ordersCount: orders.length,
            prepareCount: orders.filter(order => order.orderState === 'PENDING').length,
            deliveryCount: orders.filter(order => order.orderState === 'SHIPPED').length,
            completeCount: orders.filter(order => order.orderState === 'DELIVERED').length,
        };
        setSummary(summaryData);
    }, []);

    const handleStatusChange = async (orderId, newState) => {
        try {
            const response = await apiInstance.put(`/admin/orders/${orderId}?orderState=${encodeURIComponent(newState)}`);

            if (response.status === 200) {
                const updatedOrders = orders.map(order =>
                    order.id === orderId ? { ...order, orderState: newState } : order
                );
                setOrders(updatedOrders);
                updateSummary(updatedOrders);
                toast.success('주문 상태가 성공적으로 변경되었습니다.');
            } else {
                toast.error('주문 상태 변경에 실패했습니다.');
            }
        } catch (error) {
            console.error('Failed to change order status:', error);
            toast.error('주문 상태 변경 중 오류가 발생했습니다.');
        }
    };

    const openModal = (id) => {
        setOrderIdToDelete(id);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setOrderIdToDelete(null);
    };

    const deleteOrderData = async () => {
        try {
            await apiInstance.delete(`/admin/orders/${orderIdToDelete}`);
            setOrders(prevOrders => {
                const updatedOrders = prevOrders.filter(order => order.id !== orderIdToDelete);
                updateSummary(updatedOrders);
                return updatedOrders;
            });
            closeModal();
            toast.success('주문이 성공적으로 삭제되었습니다.');
        } catch (error) {
            console.error('Failed to delete order:', error);
            toast.error('주문 삭제 중 오류가 발생했습니다.');
        }
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    return (
        <div>
            <Container className="admin-section-unique">
                <div className="admin-block-unique admin-account-header-unique">
                    <h1 className="admin-subtitle-unique is-4">주문 관리</h1>
                </div>

                <nav className="admin-level-unique">
                    <div className="admin-level-item-unique has-text-centered">
                        <div>
                            <p className="admin-heading-unique">총 주문 수</p>
                            <p className="admin-title-unique" id="ordersCount">{summary.ordersCount}</p>
                        </div>
                    </div>
                    <div className="admin-level-item-unique has-text-centered">
                        <div>
                            <p className="admin-heading-unique">상품 준비 중</p>
                            <p className="admin-title-unique" id="prepareCount">{summary.prepareCount}</p>
                        </div>
                    </div>
                    <div className="admin-level-item-unique has-text-centered">
                        <div>
                            <p className="admin-heading-unique">상품 배송 중</p>
                            <p className="admin-title-unique" id="deliveryCount">{summary.deliveryCount}</p>
                        </div>
                    </div>
                    <div className="admin-level-item-unique has-text-centered">
                        <div>
                            <p className="admin-heading-unique">배송 완료</p>
                            <p className="admin-title-unique" id="completeCount">{summary.completeCount}</p>
                        </div>
                    </div>
                </nav>

                <Container className="admin-orders-container-unique">
                    <div className="admin-order-orders-top">
                        <div className="admin-order-col-2">주문 날짜</div>
                        <div className="admin-order-col-4">주문 정보</div>
                        <div className="admin-order-col-2">주문 총액</div>
                        <div className="admin-order-col-2">주문 상태 관리</div>
                        <div className="admin-order-col-2">주문 삭제</div>
                    </div>
                    {loading ? (
                        <div>Loading...</div>
                    ) : orders.length === 0 ? (
                        <div className="no-orders">주문 내역이 없습니다</div>
                    ) : (
                        orders.map(order => (
                            <div
                                className={`admin-order-orders-item ${order.orderState === 'CANCELLED' ? 'admin-cancelled-unique' : ''}`}
                                key={order.id}>
                                <div className="admin-order-col admin-order-col-2">
                                    {moment(order.createdAt).isValid()
                                        ? moment(order.createdAt).format('YYYY-MM-DD')
                                        : 'Invalid Date'}
                                </div>
                                <div className="admin-order-col admin-order-col-4 admin-order-summary-unique">
                                    {order.totalQuantity - 1 === 0 ? order.repItemName : `${order.repItemName} 외 ${order.totalQuantity - 1}건`}
                                </div>
                                <div
                                    className="admin-order-col admin-order-col-2">{order.price ? order.price.toLocaleString() + " 원" : '-'}</div>
                                <div className="admin-order-col admin-order-col-2">
                                    <select
                                        value={order.orderState}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        className={`admin-status-select-unique ${order.orderState.replace(" ", "-")}`}
                                    >
                                        <option value="PENDING">주문 완료</option>
                                        <option value="CONFIRMED">주문 확인</option>
                                        <option value="SHIPPED">상품 발송</option>
                                        <option value="DELIVERED">배송 완료</option>
                                        <option value="CANCELLED">주문 취소</option>
                                    </select>
                                </div>
                                <div className="admin-order-col admin-order-col-2 admin-order-cancel-button-container">
                                    <button
                                        className="admin-order-cancel-button"
                                        onClick={() => openModal(order.id)}
                                    >
                                        주문 삭제
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

            <Modal show={showModal} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>주문 삭제 확인</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>주문 삭제 시 복구할 수 없습니다. 정말로 삭제하시겠습니까?</p>
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

            <ToastContainer />
        </div>
    );
};

export default AdminOrder;
