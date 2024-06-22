import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, ListGroup } from 'react-bootstrap';
import { apiInstance } from '../util/api';
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
    const [editCategoryParentId, setEditCategoryParentId] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await apiInstance.get('/categories');
            console.log('Fetched categories:', response.data); 
            setCategories(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("카테고리 불러오기 실패:", error);
            setCategories([]);
        }
    };

    const handleAddMainCategory = async () => {
        try {
            await apiInstance.post('/categories', { name: newCategoryName });
            setShowMainAddModal(false);
            setNewCategoryName('');
            fetchCategories();
            window.location.reload(); 
        } catch (error) {
            console.error("부모 카테고리 추가 실패:", error);
        }
    };

    const handleAddSubCategory = async () => {
        try {
            await apiInstance.post('/categories', { name: newCategoryName, parentId: selectedMainCategory });
            setShowSubAddModal(false);
            setNewCategoryName('');
            fetchCategories();
            window.location.reload(); 
        } catch (error) {
            console.error("자식 카테고리 추가 실패:", error);
        }
    };

    const handleEditCategory = async () => {
        try {
            await apiInstance.put(`/categories/${editCategoryId}`, { name: editCategoryName, parentId: editCategoryParentId });
            setEditCategoryId(null);
            setEditCategoryName('');
            setEditCategoryParentId(null);
            fetchCategories();
            window.location.reload(); 
        } catch (error) {
            console.error("카테고리 수정 실패:", error);
        }
    };

    const handleDeleteCategory = async (id) => {
        if (window.confirm("정말 삭제하시겠어요?")) {
            try {
                await apiInstance.delete(`/categories/${id}`);
                fetchCategories();
                window.location.reload(); 
            } catch (error) {
                console.error("카테고리 삭제 실패:", error);
            }
        }
    };

    const handleEditButtonClick = (category) => {
        setEditCategoryId(category.id);
        setEditCategoryName(category.name);
        setEditCategoryParentId(category.parentId || null);
    };

    const renderCategories = (parentId = null) => {
        return categories
            .filter(category => category.parentId === parentId)
            .map(category => (
                <div key={category.id} className="Category_category-item">
                    <div>
                        {parentId && <span className="Category_indent">└</span>}
                        {category.name}
                        <Button size="sm" variant="secondary" onClick={() => handleEditButtonClick(category)}>수정</Button>
                        <Button size="sm" variant="danger" onClick={() => handleDeleteCategory(category.id)}>삭제</Button>
                    </div>
                    {renderCategories(category.id)}
                </div>
            ));
    };

    return (
        <div className="Category_category-container">
            <h2>카테고리</h2>
            <Button variant="primary" onClick={() => setShowAddModal(true)}>+</Button>
            <div className="Category_category-list">
                {renderCategories()}
            </div>

            <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>카테고리 추가</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Button variant="secondary" onClick={() => setShowMainAddModal(true)}>메인 카테고리 추가하기</Button>
                    <Button variant="secondary" onClick={() => setShowSubAddModal(true)}>서브 카테고리 추가하기</Button>
                </Modal.Body>
            </Modal>

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

            <Modal show={!!editCategoryId} onHide={() => setEditCategoryId(null)}>
                <Modal.Header closeButton>
                    <Modal.Title>카테고리 수정</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>카테고리 이름</Form.Label>
                        <Form.Control type="text" value={editCategoryName} onChange={(e) => setEditCategoryName(e.target.value)} />
                    </Form.Group>
                    {editCategoryParentId && (
                        <Form.Group>
                            <Form.Label>메인 카테고리 선택</Form.Label>
                            <Form.Control as="select" value={editCategoryParentId} onChange={(e) => setEditCategoryParentId(e.target.value)}>
                                <option value={null}>선택</option>
                                {categories.filter(cat => cat.parentId === null).map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleEditCategory}>수정하기</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Category;
