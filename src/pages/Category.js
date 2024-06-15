import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, ListGroup } from 'react-bootstrap';
import axios from 'axios';
import './Category.css';

function Category() {
    const [categories, setCategories] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showMainAddModal, setShowMainAddModal] = useState(false);
    const [showSubAddModal, setShowSubAddModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [selectedMainCategory, setSelectedMainCategory] = useState(null);
    const [editCategoryId, setEditCategoryId] = useState(null);
    const [editCategoryName, setEditCategoryName] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/categories');
            console.log('Fetched categories:', response.data); // 콘솔 로그 추가
            setCategories(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
            setCategories([]);
        }
    };

    const handleAddMainCategory = async () => {
        try {
            await axios.post('/categories', { name: newCategoryName });
            setShowMainAddModal(false);
            setNewCategoryName('');
            fetchCategories();
        } catch (error) {
            console.error("Failed to add main category:", error);
        }
    };

    const handleAddSubCategory = async () => {
        try {
            await axios.post('/categories', { name: newCategoryName, parentId: selectedMainCategory });
            setShowSubAddModal(false);
            setNewCategoryName('');
            fetchCategories();
        } catch (error) {
            console.error("Failed to add sub category:", error);
        }
    };

    const handleEditCategory = async () => {
        try {
            await axios.put(`/categories/${editCategoryId}`, { name: editCategoryName });
            setEditCategoryId(null);
            setEditCategoryName('');
            fetchCategories();
        } catch (error) {
            console.error("Failed to edit category:", error);
        }
    };

    const handleDeleteCategory = async (id) => {
        if (window.confirm("정말 삭제하시겠어요?")) {
            try {
                await axios.delete(`/categories/${id}`);
                fetchCategories();
            } catch (error) {
                console.error("Failed to delete category:", error);
            }
        }
    };

    const renderCategories = (parentId = null) => {
        return categories
            .filter(category => category.parentId === parentId)
            .map(category => (
                <div key={category.id} className="category-item">
                    <div>
                        {parentId && <span className="indent">└</span>}
                        {category.name}
                        <Button size="sm" variant="secondary" onClick={() => {
                            setEditCategoryId(category.id);
                            setEditCategoryName(category.name);
                        }}>수정</Button>
                        <Button size="sm" variant="danger" onClick={() => handleDeleteCategory(category.id)}>삭제</Button>
                    </div>
                    {renderCategories(category.id)}
                </div>
            ));
    };

    return (
        <div className="category-container">
            <h2>카테고리</h2>
            <Button variant="primary" onClick={() => setShowAddModal(true)}>+</Button>
            <div className="category-list">
                {renderCategories()}
            </div>

            {/* + 누르면 나오는 모달 */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>카테고리 추가</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Button variant="secondary" onClick={() => setShowMainAddModal(true)}>메인 카테고리 추가하기</Button>
                    <Button variant="secondary" onClick={() => setShowSubAddModal(true)}>서브 카테고리 추가하기</Button>
                </Modal.Body>
            </Modal>

            {/* 메인 카테고리 수정 모달 */}
            <Modal show={showMainAddModal} onHide={() => setShowMainAddModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>메인 카테고리 추가</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>카테고리 이름</Form.Label>
                        <Form.Control type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleAddMainCategory}>추가하기</Button>
                </Modal.Footer>
            </Modal>

            {/* 서브카테고리 수정 모달 */}
            <Modal show={showSubAddModal} onHide={() => setShowSubAddModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>서브 카테고리 추가</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>카테고리 이름</Form.Label>
                        <Form.Control type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>추가할 메인 카테고리를 선택하세요</Form.Label>
                        <Form.Control as="select" onChange={(e) => setSelectedMainCategory(e.target.value)}>
                            <option value={null}>선택</option>
                            {categories.filter(cat => cat.parentId === null).map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleAddSubCategory}>추가하기</Button>
                </Modal.Footer>
            </Modal>

            {/* 카테고리 수정 모달 */}
            <Modal show={!!editCategoryId} onHide={() => setEditCategoryId(null)}>
                <Modal.Header closeButton>
                    <Modal.Title>카테고리 수정</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>카테고리 이름</Form.Label>
                        <Form.Control type="text" value={editCategoryName} onChange={(e) => setEditCategoryName(e.target.value)} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleEditCategory}>수정하기</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Category;
