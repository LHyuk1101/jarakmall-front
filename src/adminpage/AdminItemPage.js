import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Table } from 'react-bootstrap';
import { apiInstance } from '../util/api';
import './AdminItemPage.css';

function AdminItemPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditProductModal, setShowEditProductModal] = useState(false);
    const [showStockModal, setShowStockModal] = useState(false);
    const [showStockDetailsModal, setShowStockDetailsModal] = useState(false);
    const [showEditStockModal, setShowEditStockModal] = useState(false);
    const [newProductName, setNewProductName] = useState('');
    const [newProductPrice, setNewProductPrice] = useState('');
    const [editProductName, setEditProductName] = useState('');
    const [editProductPrice, setEditProductPrice] = useState('');
    const [editSelectedMainCategory, setEditSelectedMainCategory] = useState(null);
    const [editSelectedSubCategory, setEditSelectedSubCategory] = useState(null);
    const [selectedMainCategory, setSelectedMainCategory] = useState(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [editSelectedBrand, setEditSelectedBrand] = useState(null);
    const [mainFile, setMainFile] = useState(null);
    const [subFile, setSubFile] = useState(null);
    const [editMainFile, setEditMainFile] = useState(null);
    const [editSubFile, setEditSubFile] = useState(null);
    const [currentItemId, setCurrentItemId] = useState(null);
    const [stockDetails, setStockDetails] = useState([]);
    const [newStock, setNewStock] = useState({
        size: '',
        color: '',
        quantity: ''
    });
    const [editStock, setEditStock] = useState({
        size: '',
        color: '',
        quantity: ''
    });

    useEffect(() => {
        fetchProducts();
        fetchCategories();
        fetchBrands();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await apiInstance.get('/items');
            setProducts(response.data);
        } catch (error) {
            console.error("상품 불러오기 실패:", error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await apiInstance.get('/categories');
            const categoryData = response.data;
            setCategories(categoryData.filter(category => category.parentId === null));
            setSubCategories(categoryData.filter(category => category.parentId !== null));
        } catch (error) {
            console.error("카테고리 불러오기 실패:", error);
        }
    };

    const fetchBrands = async () => {
        try {
            const response = await apiInstance.get('/brands');
            setBrands(response.data);
        } catch (error) {
            console.error("브랜드 불러오기 실패:", error);
        }
    };

    const fetchSubCategories = async (parentId) => {
        try {
            const response = await apiInstance.get(`/categories/${parentId}/subcategories`);
            setSubCategories(response.data);
        } catch (error) {
            console.error("서브 카테고리 불러오기 실패:", error);
        }
    };

    const getCategoryNameById = (id) => {
        const category = categories.find(cat => cat.id === id) || subCategories.find(cat => cat.id === id);
        return category ? category.name : '카테고리 없음';
    };

    const getBrandNameById = (id) => {
        const brand = brands.find(brand => brand.id === id);
        return brand ? brand.name : '브랜드 없음';
    };

    const handleAddProduct = async () => {
        const itemDTO = {
            itemName: newProductName,
            price: newProductPrice,
            categoryId: selectedSubCategory,
            brandId: selectedBrand
        };

        const formData = new FormData();
        formData.append('itemDTO', new Blob([JSON.stringify(itemDTO)], { type: 'application/json' }));
        formData.append('mainFile', mainFile);
        formData.append('subFile', subFile);

        try {
            await apiInstance.post('/items', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setShowAddModal(false);
            setNewProductName('');
            setNewProductPrice('');
            setSelectedMainCategory(null);
            setSelectedSubCategory(null);
            setSelectedBrand(null);
            setMainFile(null);
            setSubFile(null);
            fetchProducts();
        } catch (error) {
            console.error("상품 추가 실패:", error);
        }
    };

    const handleMainCategoryChange = (e) => {
        const mainCategoryId = e.target.value;
        setSelectedMainCategory(mainCategoryId);
        fetchSubCategories(mainCategoryId);
    };

    const handleEditMainCategoryChange = (e) => {
        const mainCategoryId = e.target.value;
        setEditSelectedMainCategory(mainCategoryId);
        fetchSubCategories(mainCategoryId);
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm("정말 상품을 삭제하시겠습니까?")) {
            try {
                await apiInstance.delete(`/items/${id}`);
                fetchProducts();
            } catch (error) {
                console.error("상품 삭제 실패:", error);
            }
        }
    };

    const handleShowStockModal = (itemId) => {
        setCurrentItemId(itemId);
        setShowStockModal(true);
    };

    const handleAddStock = async () => {
        try {
            await apiInstance.post(`/items/${currentItemId}/details`, newStock);
            setShowStockModal(false);
            setNewStock({
                size: '',
                color: '',
                quantity: ''
            });
            fetchProducts();
        } catch (error) {
            console.error("재고 추가 실패:", error);
        }
    };

    const handleShowStockDetailsModal = async (itemId) => {
        setCurrentItemId(itemId);
        try {
            const response = await apiInstance.get(`/items/${itemId}/details`);
            setStockDetails(response.data);
            setShowStockDetailsModal(true);
        } catch (error) {
            console.error("재고 현황 불러오기 실패:", error);
        }
    };

    const handleShowEditStockModal = async (itemId, detailId) => {
        try {
            const response = await apiInstance.get(`/items/${itemId}/details/${detailId}`);
            setEditStock(response.data);
            setCurrentItemId(itemId);
            setShowEditStockModal(true);
        } catch (error) {
            console.error("재고 수정 불러오기 실패:", error);
        }
    };

    const handleEditStock = async (detailId) => {
        try {
            await apiInstance.put(`/items/${currentItemId}/details/${detailId}`, editStock);
            setShowEditStockModal(false);
            fetchProducts();
        } catch (error) {
            console.error("재고 수정 실패:", error);
        }
    };

    const handleDeleteStock = async (itemId, detailId) => {
        if (window.confirm("정말 해당 재고를 삭제하시겠습니까?")) {
            try {
                await apiInstance.delete(`/items/${itemId}/details/${detailId}`);
                setStockDetails(stockDetails.filter(detail => detail.id !== detailId));
            } catch (error) {
                console.error("재고 삭제 실패:", error);
            }
        }
    };

    const handleShowEditProductModal = async (productId) => {
        setCurrentItemId(productId);
        try {
            const response = await apiInstance.get(`/items/${productId}`);
            const productData = response.data;
            setEditProductName(productData.itemName);
            setEditProductPrice(productData.price);
            setEditSelectedMainCategory(productData.mainCategoryId);
            setEditSelectedSubCategory(productData.subCategoryId);
            setEditSelectedBrand(productData.brandId);
            setShowEditProductModal(true);
        } catch (error) {
            console.error("상품 정보 불러오기 실패:", error);
        }
    };

    const handleEditProduct = async () => {
        const itemDTO = {
            itemName: editProductName,
            price: editProductPrice,
            categoryId: editSelectedSubCategory,
            brandId: editSelectedBrand
        };

        const formData = new FormData();
        formData.append('itemDTO', new Blob([JSON.stringify(itemDTO)], { type: 'application/json' }));
        formData.append('mainFile', editMainFile);
        formData.append('subFile', editSubFile);

        try {
            await apiInstance.put(`/items/${currentItemId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setShowEditProductModal(false);
            fetchProducts();
        } catch (error) {
            console.error("상품 수정 실패:", error);
        }
    };

    const getMainImageSrc = (itemImageDTOs) => {
        const mainImage = itemImageDTOs.find(image => image.isMain);
        return mainImage ? mainImage.filePath : '';
    };

    return (
        <div className="AdminItemPage_container">
            <h2>상품 관리</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>썸네일</th>
                        <th>상품명</th>
                        <th>가격</th>
                        <th>카테고리</th>
                        <th>브랜드</th>
                        <th>재고현황</th>
                        <th>작업</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td>
                                <img src={getMainImageSrc(product.itemImageDTOs)} alt="thumbnail" className="AdminItemPage_thumbnail-img" />
                            </td>
                            <td>{product.itemName}</td>
                            <td>{product.price}원</td>
                            <td>{getCategoryNameById(product.categoryId)}</td>
                            <td>{getBrandNameById(product.brandId)}</td>
                            <td>
                                <Button size="sm" variant="primary" onClick={() => handleShowStockDetailsModal(product.id)}>재고 현황 보기</Button>
                            </td>
                            <td>
                                <Button size="sm" variant="secondary" onClick={() => handleShowEditProductModal(product.id)}>수정</Button>
                                <Button size="sm" variant="danger" onClick={() => handleDeleteProduct(product.id)}>삭제</Button>
                                <Button size="sm" variant="primary" onClick={() => handleShowStockModal(product.id)}>재고등록</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Button variant="primary" className="AdminItemPage_add-product-button" onClick={() => setShowAddModal(true)}>상품 등록</Button>

            <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>상품 등록하기</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>브랜드 선택</Form.Label>
                        <Form.Control as="select" value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
                            <option value={null}>선택</option>
                            {brands.map(brand => (
                                <option key={brand.id} value={brand.id}>{brand.name}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>상품 이름</Form.Label>
                        <Form.Control type="text" value={newProductName} onChange={(e) => setNewProductName(e.target.value)} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>상품 가격</Form.Label>
                        <Form.Control type="number" value={newProductPrice} onChange={(e) => setNewProductPrice(e.target.value)} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>상위 카테고리 선택</Form.Label>
                        <Form.Control as="select" onChange={handleMainCategoryChange}>
                            <option value={null}>선택</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>하위 카테고리 선택</Form.Label>
                        <Form.Control as="select" value={selectedSubCategory} onChange={(e) => setSelectedSubCategory(e.target.value)} disabled={!selectedMainCategory}>
                            <option value={null}>선택</option>
                            {subCategories.map(subCat => (
                                <option key={subCat.id} value={subCat.id}>{subCat.name}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>대표 이미지 등록</Form.Label>
                        <Form.Control type="file" onChange={(e) => setMainFile(e.target.files[0])} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>상세 이미지 등록</Form.Label>
                        <Form.Control type="file" onChange={(e) => setSubFile(e.target.files[0])} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleAddProduct}>등록하기</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showEditProductModal} onHide={() => setShowEditProductModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>상품 수정하기</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>브랜드 선택</Form.Label>
                        <Form.Control as="select" value={editSelectedBrand} onChange={(e) => setEditSelectedBrand(e.target.value)}>
                            <option value={null}>선택</option>
                            {brands.map(brand => (
                                <option key={brand.id} value={brand.id}>{brand.name}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>수정할 이름</Form.Label>
                        <Form.Control type="text" value={editProductName} onChange={(e) => setEditProductName(e.target.value)} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>수정할 가격</Form.Label>
                        <Form.Control type="number" value={editProductPrice} onChange={(e) => setEditProductPrice(e.target.value)} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>상위 카테고리 선택</Form.Label>
                        <Form.Control as="select" value={editSelectedMainCategory} onChange={handleEditMainCategoryChange}>
                            <option value={null}>선택</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>하위 카테고리 선택</Form.Label>
                        <Form.Control as="select" value={editSelectedSubCategory} onChange={(e) => setEditSelectedSubCategory(e.target.value)} disabled={!editSelectedMainCategory}>
                            <option value={null}>선택</option>
                            {subCategories.map(subCat => (
                                <option key={subCat.id} value={subCat.id}>{subCat.name}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>수정할 대표 이미지</Form.Label>
                        <Form.Control type="file" onChange={(e) => setEditMainFile(e.target.files[0])} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>수정할 상세 이미지</Form.Label>
                        <Form.Control type="file" onChange={(e) => setEditSubFile(e.target.files[0])} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleEditProduct}>수정하기</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showStockModal} onHide={() => setShowStockModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>재고 등록하기</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>사이즈</Form.Label>
                        <Form.Control type="text" value={newStock.size} onChange={(e) => setNewStock({ ...newStock, size: e.target.value })} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>색상</Form.Label>
                        <Form.Control type="text" value={newStock.color} onChange={(e) => setNewStock({ ...newStock, color: e.target.value })} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>수량</Form.Label>
                        <Form.Control type="number" value={newStock.quantity} onChange={(e) => setNewStock({ ...newStock, quantity: e.target.value })} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleAddStock}>등록하기</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showStockDetailsModal} onHide={() => setShowStockDetailsModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>재고 현황</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>사이즈</th>
                                <th>색상</th>
                                <th>수량</th>
                                <th>작업</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stockDetails.map((detail) => (
                                <tr key={detail.id}>
                                    <td>{detail.size}</td>
                                    <td>{detail.color}</td>
                                    <td>{detail.quantity}</td>
                                    <td>
                                        <Button size="sm" variant="secondary" onClick={() => handleShowEditStockModal(currentItemId, detail.id)}>수정</Button>
                                        <Button size="sm" variant="danger" onClick={() => handleDeleteStock(currentItemId, detail.id)}>삭제</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Modal.Body>
            </Modal>

            <Modal show={showEditStockModal} onHide={() => setShowEditStockModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>재고 수정하기</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>사이즈</Form.Label>
                        <Form.Control type="text" value={editStock.size} onChange={(e) => setEditStock({ ...editStock, size: e.target.value })} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>색상</Form.Label>
                        <Form.Control type="text" value={editStock.color} onChange={(e) => setEditStock({ ...editStock, color: e.target.value })} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>수량</Form.Label>
                        <Form.Control type="number" value={editStock.quantity} onChange={(e) => setEditStock({ ...editStock, quantity: e.target.value })} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => handleEditStock(editStock.id)}>수정하기</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default AdminItemPage;
