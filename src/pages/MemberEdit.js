import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Spinner } from 'react-bootstrap';
import axios from 'axios';
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
      await axios.post('/members', formData);
      alert('회원정보가 수정되었습니다.');
    } catch (error) {
      console.error('회원정보 수정 실패:', error);
      alert('회원정보 수정에 실패했습니다.');
    }
  };

  const handleUnregister = async () => {
    if (window.confirm('정말 저희 쑈핑모올을 더 이상 이용하지 않으실건가요?')) {
      try {
        await axios.delete('/unregister', { withCredentials: true });
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
    <Container className="MemberEdit">
      <h2>회원 정보 수정</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formDisplayName">
          <Form.Label>이름</Form.Label>
          <Form.Control type="text" name="displayName" value={formData.displayName} onChange={handleChange} />
        </Form.Group>
        <Form.Group controlId="formPassword">
          <Form.Label>현재 비밀번호</Form.Label>
          <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} />
        </Form.Group>
        <Form.Group controlId="formModifyPassword">
          <Form.Label>변경할 비밀번호</Form.Label>
          <Form.Control type="password" name="modifyPassword" value={formData.modifyPassword} onChange={handleChange} />
        </Form.Group>
        <Form.Group controlId="formPhone">
          <Form.Label>휴대폰번호</Form.Label>
          <Form.Control type="text" name="phone" value={formData.phone} onChange={handleChange} />
        </Form.Group>
        <Form.Group controlId="formGender" style={{ display: 'none' }}>
          <Form.Label>성별값</Form.Label>
          <Form.Control type="text" name="gender" value={formData.gender} onChange={handleChange} />
        </Form.Group>
        <div className="btn-container">
          <Button variant="primary" type="submit">
            수정하기
          </Button>
          <Button variant="danger" className="unregister-button" onClick={handleUnregister}>
            회원탈퇴
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default MemberEdit;
