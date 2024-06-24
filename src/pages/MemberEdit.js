import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Spinner } from 'react-bootstrap';
import { apiInstance } from '../util/api';
import useUserStore from '../stores/useUserStore';
import LINKS from '../links/links';
import './MemberEdit.css';
import { useNavigate } from 'react-router-dom';

/** 
 * 마이페이지에서 회원정보 수정하는 페이지
 */

function MemberEdit() {
  const user = useUserStore(state => state.user);
  const logout = useUserStore(state => state.logout);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    displayName: '',
    password: '',
    modifyPassword: '',
    phone: '',
    gender: ''
  });

  useEffect(() => {
    if (!user) {
      navigate(LINKS.HOME.path);
    } else {
      setFormData({
        displayName: user.displayName,
        password: '',
        modifyPassword: '',
        phone: user.phone,
        gender: user.gender
      });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiInstance.post('/members', formData);
      alert('회원정보가 수정되었습니다.');
    } catch (error) {
      console.error('회원정보 수정 실패:', error);
      alert('회원정보 수정에 실패했습니다.');
    }
  };

  const handleUnregister = async () => {
    if (window.confirm('정말 저희 자락몰을 더 이상 이용하지 않으실건가요?')) {
      try {
        await apiInstance.delete('/unregister', { withCredentials: true });
        const cartKey = `cart_${user.id}`;
        localStorage.removeItem(cartKey); // 로컬스토리지에서 장바구니 정보 삭제
        logout();
        alert('회원 탈퇴가 완료되었습니다.');
        navigate(LINKS.HOME.path);
      } catch (error) {
        console.error('회원 탈퇴 실패:', error);
        alert('회원 탈퇴에 실패했습니다.');
      }
    }
  };

  if (!user) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="MemberEdit_MemberEdit">
      <h2>회원 정보 수정</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formDisplayName" className="MemberEdit_form-group">
          <Form.Label className="MemberEdit_form-label">이름</Form.Label>
          <Form.Control type="text" name="displayName" value={formData.displayName} onChange={handleChange} className="MemberEdit_form-control" />
        </Form.Group>
        <Form.Group controlId="formPassword" className="MemberEdit_form-group">
          <Form.Label className="MemberEdit_form-label">현재 비밀번호</Form.Label>
          <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} className="MemberEdit_form-control" />
        </Form.Group>
        <Form.Group controlId="formModifyPassword" className="MemberEdit_form-group">
          <Form.Label className="MemberEdit_form-label">변경할 비밀번호</Form.Label>
          <Form.Control type="password" name="modifyPassword" value={formData.modifyPassword} onChange={handleChange} className="MemberEdit_form-control" />
        </Form.Group>
        <Form.Group controlId="formPhone" className="MemberEdit_form-group">
          <Form.Label className="MemberEdit_form-label">휴대폰번호</Form.Label>
          <Form.Control type="text" name="phone" value={formData.phone} onChange={handleChange} className="MemberEdit_form-control" />
        </Form.Group>
        <Form.Group controlId="formGender" className="MemberEdit_form-group" style={{ display: 'none' }}>
          <Form.Label className="MemberEdit_form-label">성별값</Form.Label>
          <Form.Control type="text" name="gender" value={formData.gender} onChange={handleChange} className="MemberEdit_form-control" />
        </Form.Group>
        <div className="MemberEdit_btn-container">
          <Button variant="primary" type="submit" className="MemberEdit_btn-primary">
            수정하기
          </Button>
          <Button variant="danger" className="MemberEdit_unregister-button" onClick={handleUnregister}>
            회원탈퇴
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default MemberEdit;
