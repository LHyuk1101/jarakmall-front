import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {Nav,Card,Button} from 'react-bootstrap/';

function Detail(props){

  useEffect(() => {
    setTimeout(()=>{ setAlert(false) },2000)
  },[])

  const[alert,setAlert] = useState(true)

  const [count, setCount] = useState(0)

  const {itemId} =  useParams();
  // const numericItemId = parseInt(itemId, 10);
  // const realId = numericItemId - 1;

  const findId = props.items.find(function(x){
    return x.id == itemId
  });

  const [modal, setModal] = useState('detail');
  

    return(
      <div className="container">
        {
          alert == true ? <div className="alert">
          2초 이내 구매하면 할인 각이 보이긴 함
        </div> : null
        }
  <div className="row">
    <div className="col-md-6">
      <img src={'https://codingapple1.github.io/shop/shoes'+findId.id+'.jpg'} width="100%" />
    </div>
    <div className="col-md-6">
      <h4 className="pt-5">{findId.title}</h4>
      <p>{findId.content}</p>
      <p>{findId.price}</p>
      <button className="btn btn-danger">주문하기</button> 
    </div>

    <Nav justify variant="tabs" defaultActiveKey="detail">
          <Nav.Item>
            <Nav.Link eventKey="detail" onClick={() => setModal('detail')}>
              뭐 상품 상세 이미지 있음 될거같아요
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="review" onClick={() => setModal('review')}>
              여기는 뭐 리뷰라던지..
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="qna" onClick={() => setModal('qna')}>
              여긴 문의사항? 그런게 될거같아요
            </Nav.Link>
          </Nav.Item>
        </Nav>
        {
          modal === 'detail' && <DetailModal />
        }
        {
          modal === 'review' && <ReviewModal />
        }
        {
          modal === 'qna' && <QnaModal />
        }

  </div>
</div> 
    )
    function DetailModal(){
      return(
        <div className="DetailModal">
          <div>상세페이지 모달</div>
          <p>{findId.title}</p>
        </div>
      );
    }

    function ReviewModal(){
      return(
        <div className="ReviewModal">
          <div>리뷰페이지 모달</div>
        </div>
      );
    }

    function QnaModal(){
      return(
        <div className="QnaModal">
          <div>QnA 모달</div>
        </div>
      );
    }
}


export default Detail;