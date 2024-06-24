import React, { useEffect, useState } from 'react';
import { apiInstance } from '../util/api';
import { Card, Button, Row, Col, Image } from 'react-bootstrap';
import useUserStore from '../stores/useUserStore';
import useBannerStore from '../stores/useBannerStore';
import './AdminMain.css';

function AdminMain() {
  const user = useUserStore(state => state.user);
  const [memberCount, setMemberCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    const fetchMemberCount = async () => {
      try {
        const response = await apiInstance.get('/admin/members');
        setMemberCount(response.data.length);
      } catch (error) {
        console.error('멤버수를 가져오는데 실패했습니다.:', error);
      }
    };

    const fetchOrderCount = async () => {
      try{
        const response = await apiInstance.get('/admin/orders/count');
        setOrderCount(response.data);
      }catch(error){
        console.error('주문수를 가져오는데 실패했습니다.:',error);
      }
    };

    const fetchProductCount = async () => {
      try{
        const response = await apiInstance.get('/items');
        setProductCount(response.data.length);
      }catch(error){
        console.error('상품수를 가져오는데 실패했습니다.:',error);
      }
    };

    fetchProductCount();
    fetchMemberCount();
    fetchOrderCount();
  }, []);


  return (
    <div className="AdminMain_admin-main">
      <Row>
        <Col md={3}>
          <Card className="AdminMain_admin-info">
            <Card.Body>
              <Card.Title>관리자 정보</Card.Title>
              <Card.Text>
                <div>{user.displayName}</div>
                <div>{user.email}</div>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="AdminMain_stat-card">
            <Card.Body>
              <Card.Title>회원 수</Card.Title>
              <Card.Text>{memberCount}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="AdminMain_stat-card">
            <Card.Body>
              <Card.Title>상품 수</Card.Title>
              <Card.Text>{productCount}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="AdminMain_stat-card">
            <Card.Body>
              <Card.Title>주문 수</Card.Title>
              <Card.Text>{orderCount}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

    </div>
  );
}

export default AdminMain;
