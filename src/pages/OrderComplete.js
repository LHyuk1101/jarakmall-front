import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import './OrderComplete.css';

const OrderComplete = () => {
    const navigate = useNavigate();

    const handleOrderDetailClick = () => {
        navigate('/my-page/orders');
    };

    const handleShoppingClick = () => {
        navigate('/');
    };

    return (
        <div>
            <Container className="section">
                <Row className="justify-content-center order-complete-container-unique">
                    <Col md={6}>
                        <Card className="text-center order-complete-unique">
                            <Card.Body>
                                <div className="icon-text-unique">
                                    <i className="fas fa-circle-check text-success fa-3x"></i>
                                    <div className="order-complete-text">주문이 완료되었습니다!</div>
                                </div>
                                <div className="buttons-container-unique">
                                    <Button
                                        variant="light"
                                        size="lg"
                                        block
                                        className="order-detail-button-unique"
                                        onClick={handleOrderDetailClick}
                                    >
                                        주문내역 보기
                                    </Button>
                                    <Button
                                        variant="primary"
                                        size="lg"
                                        block
                                        className="order-button-unique"
                                        onClick={handleShoppingClick}
                                    >
                                        쇼핑 계속하기
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default OrderComplete;
