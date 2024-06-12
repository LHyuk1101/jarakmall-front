import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ListGroup, Button, Pagination } from 'react-bootstrap/';
import useUserStore from './stores/useUserStore';
import './Members.css';

const ITEMS_PER_PAGE = 10;

function Members() {
  const [members, setMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get('/admin/members');
        setMembers(response.data);
      } catch (error) {
        console.error("Failed to fetch members", error);
      }
    };
    fetchMembers();
  }, []);

  const handleDelete = async (username) => {
    try {
      await axios.delete('/unregister', { data: { username } });
      setMembers(members.filter(member => member.username !== username));
    } catch (error) {
      console.error("Failed to delete member", error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentMembers = members.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div>
      <ListGroup>
        <ListGroup.Item>
          <div className="row">
            <div className="col-md-3">아이디</div>
            <div className="col-md-3">이메일</div>
            <div className="col-md-3">전화번호</div>
            <div className="col-md-3">회원등급</div>
          </div>
        </ListGroup.Item>
        {currentMembers.map((member) => (
          <ListGroup.Item key={member.username}>
            <div className="row">
              <div className="col-md-3">{member.username}</div>
              <div className="col-md-3">{member.email}</div>
              <div className="col-md-3">{member.phone}</div>
              <div className="col-md-3">
                {member.membership}
                {/* <Button variant="danger" size="sm" onClick={() => handleDelete(member.username)} className="float-right">삭제</Button> */}
              </div>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <Pagination>
        {Array.from({ length: Math.ceil(members.length / ITEMS_PER_PAGE) }).map((_, index) => (
          <Pagination.Item key={index} active={index + 1 === currentPage} onClick={() => handlePageChange(index + 1)}>
            {index + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </div>
  );
}

export default Members;
