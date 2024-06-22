import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { apiInstance } from './util/api';
import './ReviewModal.css';

function ReviewModal({ itemId, user }) {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [newImage, setNewImage] = useState(null);
  const [editReview, setEditReview] = useState(null);
  const [editReviewContent, setEditReviewContent] = useState('');
  const [editRating, setEditRating] = useState(0);
  const [editImage, setEditImage] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    apiInstance.get(`/reviews/${itemId}`)
      .then(response => {
        setReviews(response.data);
      })
      .catch(error => {
        console.error("리뷰 정보를 가져오는데 실패했습니다:", error);
      });
  }, [itemId]);

  const handleStarClick = (star, isEdit = false) => {
    if (isEdit) {
      setEditRating(star);
    } else {
      setNewRating(star);
    }
  };

  const handleReviewSubmit = () => {
    if (!user) {
      toast.error("로그인한 사용자만 가능한 기능입니다!");
      return;
    }

    const formData = new FormData();
    const reviewDTO = {
      content: newReview,
      rate: newRating
    };
    formData.append('reviewDTO', new Blob([JSON.stringify(reviewDTO)], { type: 'application/json' }));
    if (newImage) {
      formData.append('imageFile', newImage);
    }

    apiInstance.post(`/reviews/${itemId}`, formData)
      .then(response => {
        toast.success("리뷰가 성공적으로 작성되었습니다!");
        setNewReview('');
        setNewRating(0);
        setNewImage(null);
        document.querySelector('input[type="file"]').value = '';
        apiInstance.get(`/reviews/${itemId}`)
          .then(response => {
            setReviews(response.data);
          })
          .catch(error => {
            console.error("리뷰 정보를 가져오는데 실패했습니다:", error);
          });
      })
      .catch(error => {
        console.error("리뷰 작성에 실패했습니다:", error);
        toast.error("리뷰 작성에 실패했습니다.");
      });
  };

  const handleReviewEdit = (review) => {
    setEditReview(review);
    setEditReviewContent(review.content);
    setEditRating(review.rate);
    setShowEditModal(true);
  };

  const handleReviewUpdate = () => {
    if (!editReview) {
      toast.error("수정할 리뷰가 없습니다.");
      return;
    }

    const formData = new FormData();
    const reviewDTO = {
      content: editReviewContent,
      rate: editRating
    };
    formData.append('reviewDTO', new Blob([JSON.stringify(reviewDTO)], { type: 'application/json' }));
    if (editImage) {
      formData.append('imageFile', editImage);
    }

    apiInstance.put(`/reviews/${editReview.id}`, formData)
      .then(response => {
        toast.success("리뷰가 성공적으로 수정되었습니다!");
        setEditReview(null);
        setEditReviewContent('');
        setEditRating(0);
        setEditImage(null);
        setShowEditModal(false);
        apiInstance.get(`/reviews/${itemId}`)
          .then(response => {
            setReviews(response.data);
          })
          .catch(error => {
            console.error("리뷰 정보를 가져오는데 실패했습니다:", error);
          });
      })
      .catch(error => {
        console.error("리뷰 수정에 실패했습니다:", error);
        toast.error("리뷰 수정에 실패했습니다.");
      });
  };

  const handleReviewDelete = (id) => {
    if (window.confirm("정말 삭제 하시겠습니까?")) {
      apiInstance.delete(`/reviews/${id}`)
        .then(response => {
          toast.success("리뷰가 성공적으로 삭제되었습니다!");
          apiInstance.get(`/reviews/${itemId}`)
            .then(response => {
              setReviews(response.data);
            })
            .catch(error => {
              console.error("리뷰 정보를 가져오는데 실패했습니다:", error);
            });
        })
        .catch(error => {
          console.error("리뷰 삭제에 실패했습니다:", error);
          toast.error("리뷰 삭제에 실패했습니다.");
        });
    }
  };

  const handleImageChange = (e, isEdit = false) => {
    if (isEdit) {
      setEditImage(e.target.files[0]);
    } else {
      setNewImage(e.target.files[0]);
    }
  };

  const formatDate = (dateString) => {
    return dateString.split('T')[0];
  };

  return (
    <div className="Detail_ReviewModal">
      <div className="Detail_review-form">
        <div className="Detail_stars">
          {[1, 2, 3, 4, 5].map(star => (
            <span
              key={star}
              className={`Detail_star ${star <= newRating ? 'Detail_star-selected' : ''}`}
              onClick={() => handleStarClick(star)}
            >
              ★
            </span>
          ))}
        </div>
        <textarea
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          placeholder="리뷰를 작성해주세요"
        />
        <input type="file" accept="image/*" onChange={(e) => handleImageChange(e)} />
        <Button onClick={handleReviewSubmit}>작성하기</Button>
      </div>
      <div className="Detail_review-list">
        {reviews.map((review, index) => (
          <div key={index} className="Detail_review-item">
            <div className="Detail_review-content-container">
              <div className="Detail_review-left">
                <div className="Detail_review-rating">
                  {[1, 2, 3, 4, 5].map(star => (
                    <span key={star} className={`Detail_star ${star <= review.rate ? 'Detail_star-selected' : ''}`}>
                      ★
                    </span>
                  ))}
                </div>
                <div className="Detail_review-username">작성자 : {review.username}</div>
                <div className="Detail_review-date">{formatDate(review.createdAt)}</div>
              </div>
              <div className="Detail_review-center">
                <div className="Detail_review-content">내용 : {review.content}</div>
                {user && user.username === review.username && (
                  <div className="Detail_review-actions">
                    <Button size="sm" onClick={() => handleReviewEdit(review)}>수정</Button>
                    <Button size="sm" variant="danger" onClick={() => handleReviewDelete(review.id)}>삭제</Button>
                  </div>
                )}
              </div>
              <div className="Detail_review-right">
                {review.filePath && <img src={review.filePath} alt="리뷰 이미지" className="Detail_review-image" />}
              </div>
            </div>
          </div>
        ))}
      </div>
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>리뷰 수정</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="Detail_stars">
            {[1, 2, 3, 4, 5].map(star => (
              <span
                key={star}
                className={`Detail_star ${star <= editRating ? 'Detail_star-selected' : ''}`}
                onClick={() => handleStarClick(star, true)}
              >
                ★
              </span>
            ))}
          </div>
          <textarea
            value={editReviewContent}
            onChange={(e) => setEditReviewContent(e.target.value)}
            placeholder="리뷰를 수정해주세요"
          />
          <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, true)} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>취소</Button>
          <Button variant="primary" onClick={handleReviewUpdate}>수정하기</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ReviewModal;
