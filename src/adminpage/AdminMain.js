import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button, Row, Col, Image } from 'react-bootstrap';
import useUserStore from '../stores/useUserStore';
import useBannerStore from '../stores/useBannerStore';
import './AdminMain.css';

function AdminMain() {
  const user = useUserStore(state => state.user);
  const { mainBanner, setMainBanner } = useBannerStore();
  const [memberCount, setMemberCount] = useState(0);

  useEffect(() => {
    const fetchMemberCount = async () => {
      try {
        const response = await axios.get('/admin/members');
        setMemberCount(response.data.length);
      } catch (error) {
        console.error('멤버수를 가져오는데 실패했습니다.:', error);
      }
    };

    fetchMemberCount();
  }, []);

  const handleMainBannerChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setMainBanner(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="admin-main">
      <Row>
        <Col md={3}>
          <Card className="admin-info">
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
          <Card className="stat-card">
            <Card.Body>
              <Card.Title>회원 수</Card.Title>
              <Card.Text>{memberCount}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body>
              <Card.Title>상품 수</Card.Title>
              <Card.Text>0</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body>
              <Card.Title>주문 수</Card.Title>
              <Card.Text>0</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body>
              <Card.Title>리뷰 수</Card.Title>
              <Card.Text>0</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card className="banner-card">
            <Card.Body>
              <Card.Title>현재 메인 페이지 배너</Card.Title>
              <Image src={mainBanner} fluid />
              <Button variant="secondary" className="mt-2">
                <label htmlFor="mainBannerUpload" className="custom-file-upload">
                  수정
                </label>
              </Button>
              <input
                id="mainBannerUpload"
                type="file"
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleMainBannerChange}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default AdminMain;
