import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, ListGroup } from 'react-bootstrap';
import { apiInstance } from '../util/api';
import './Brand.css';

function Brand() {
    const [brands, setBrands] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [newBrandName, setNewBrandName] = useState('');
    const [editBrandId, setEditBrandId] = useState(null);
    const [editBrandName, setEditBrandName] = useState('');

    useEffect(() => {
        fetchBrands();
    }, []);

    const fetchBrands = async () => {
        try {
            const response = await apiInstance.get('/brands');
            setBrands(response.data);
        } catch (error) {
            console.error("브랜드 불러오기 실패:", error);
        }
    };

    const handleAddBrand = async () => {
        try {
            await apiInstance.post('/brands', { name: newBrandName });
            setShowAddModal(false);
            setNewBrandName('');
            fetchBrands();
        } catch (error) {
            console.error("브랜드 추가 실패:", error);
        }
    };

    const handleEditBrand = async () => {
        try {
            await apiInstance.put(`/brands/${editBrandId}`, { name: editBrandName });
            setShowEditModal(false);
            setEditBrandId(null);
            setEditBrandName('');
            fetchBrands();
        } catch (error) {
            console.error("브랜드 수정 실패:", error);
        }
    };

    const handleDeleteBrand = async (id) => {
        if (window.confirm("정말 브랜드를 삭제하시겠습니까?")) {
            try {
                await apiInstance.delete(`/brands/${id}`);
                fetchBrands();
            } catch (error) {
                console.error("브랜드 삭제 실패:", error);
            }
        }
    };

    return (
        <div className="brand_container">
            <h2>브랜드 목록 <Button variant="primary" onClick={() => setShowAddModal(true)}>+</Button></h2>
            <ListGroup className="brand_list">
                {brands.map((brand) => (
                    <ListGroup.Item key={brand.id} className="brand_item">
                        {brand.name}
                        <div className="brand_buttons">
                            <Button size="sm" variant="secondary" onClick={() => {
                                setEditBrandId(brand.id);
                                setEditBrandName(brand.name);
                                setShowEditModal(true);
                            }}>수정</Button>
                            <Button size="sm" variant="danger" onClick={() => handleDeleteBrand(brand.id)}>삭제</Button>
                        </div>
                    </ListGroup.Item>
                ))}
            </ListGroup>

            <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>브랜드 추가하기</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>브랜드 이름</Form.Label>
                        <Form.Control type="text" value={newBrandName} onChange={(e) => setNewBrandName(e.target.value)} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleAddBrand}>추가하기</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>브랜드 수정하기</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>브랜드 이름</Form.Label>
                        <Form.Control type="text" value={editBrandName} onChange={(e) => setEditBrandName(e.target.value)} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleEditBrand}>수정하기</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Brand;
