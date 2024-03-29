import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Row, Col, Image, ListGroup, Button, Card, Form } from 'react-bootstrap'
import Rating from '../components/Rating'
import { useDispatch, useSelector } from 'react-redux'
import { listProductDetails, createProductReview } from '../actions/productActions'
import Loader from '../components/Loadar'
import Message from '../components/Messages'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants'




function ProductScreen() {
  const [qty, setQty] = useState(1)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')


  const dispatch = useDispatch()


  const productDetails = useSelector(state => state.productDetails)
  const { loading, error, product } = productDetails


  const userLogin = useSelector(state => state.userLogin)
  const { userInfo } = userLogin

  const productReviewCreate = useSelector(state => state.productReviewCreate)
  const {
    loading: loadingProductReview,
    error: errorProductReview,
    success: successProductReview,
  } = productReviewCreate


  const match = useParams()
  let navigate = useNavigate();

  useEffect(() => {
    dispatch(listProductDetails(match.id))
  }, [dispatch, match])


  const addToCartHandler = () => {
    navigate(`/cart/${match.id}?qty=${qty}`);
  }

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(createProductReview(
        match.id, {
        rating,
        comment
    }
    ))
}

const styles = {
  btn_cover:{
    margin:"50px",
  },
  btn:{
    textDecoration:'none',
    fontWeight:"600"
  }
}



  return (
    <div>
      <div style={styles.btn_cover}>
      <Link to='/' style={styles.btn} >Go Back</Link> 
      </div>
      {
        loading ?
          <Loader />
          : error
            ? <Message variant='danger'>{error}</Message>
            : (
              <div>
                <Row>
                  <Col md={6} className="img-col">
                    <Image className='single-img' src={product.image} alt={product.name} fluid />
                  </Col>
                  <Col md={3}>
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <h3>{product.name}</h3>
                      </ListGroup.Item>

                      <ListGroup.Item>
                        <Rating value={product.rating} text={`${product.numReviews} reviews`} color={'#f8e825'} />
                      </ListGroup.Item>

                      <ListGroup.Item>
                        Price : {product.price}
                      </ListGroup.Item>

                      <ListGroup.Item>
                        Discription : {product.description}
                      </ListGroup.Item>
                    </ListGroup>
                  </Col>
                  <Col md={3}>
                    <Card>
                      <ListGroup variant='flush'>
                        <ListGroup.Item>
                          <Row>
                            <Col>Price:</Col>
                            <Col><strong>{product.price}</strong></Col>
                          </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <Row>
                            <Col>Status:</Col>
                            <Col>
                              {product.countInStock > 0 ? 'in Stock' : 'Out of Stock'}
                            </Col>
                          </Row>
                        </ListGroup.Item>
                        {product.countInStock > 0 && (
                          <ListGroup.Item>
                            <Row>
                              <Col>Qty</Col>
                              <Col xs='auto' className='my-1'>
                                <Form.Control
                                  as="select"
                                  value={qty}
                                  onChange={(e) => setQty(e.target.value)}
                                >
                                  {
                                    [...Array(product.countInStock).keys()].map((x) => (
                                      <option key={x + 1} value={x + 1}>
                                        {x + 1}
                                      </option>
                                    ))
                                  }

                                </Form.Control>
                              </Col>
                            </Row>
                          </ListGroup.Item>
                        )}

                        <ListGroup.Item>
                          <div className="button-wrap">

                          <Button onClick={addToCartHandler} className='btn-block' disabled={product.countInStock === 0} type='button'>Add to Cart</Button>
                          </div>
                        </ListGroup.Item>
                      </ListGroup>
                    </Card>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <h4>Reviews</h4>
                    {product.reviews.length === 0 && <Message variant='info'>No Reviews</Message>}

                    <ListGroup variant='flush'>
                      {product.reviews.map((review) => (
                        <ListGroup.Item key={review._id}>
                          <strong>{review.name}</strong>
                          <Rating value={review.rating} color='#f8e825' />
                          <p>{review.createdAt.substring(0, 10)}</p>
                          <p>{review.comment}</p>
                        </ListGroup.Item>
                      ))}

                      <ListGroup.Item>
                        <h4>Write a review</h4>

                        {loadingProductReview && <Loader />}
                        {successProductReview && <Message variant='success'>Review Submitted</Message>}
                        {errorProductReview && <Message variant='danger'>{errorProductReview}</Message>}

                        {userInfo ? (
                          <Form onSubmit={submitHandler}>
                            <Form.Group controlId='rating'>
                              <Form.Label>Rating</Form.Label>
                              <Form.Control
                                as='select'
                                value={rating}
                                onChange={(e) => setRating(e.target.value)}
                              >
                                <option value=''>Select...</option>
                                <option value='1'>1 - Poor</option>
                                <option value='2'>2 - Fair</option>
                                <option value='3'>3 - Good</option>
                                <option value='4'>4 - Very Good</option>
                                <option value='5'>5 - Excellent</option>
                              </Form.Control>
                            </Form.Group>

                            <Form.Group controlId='comment'>
                              <Form.Label>Review</Form.Label>
                              <Form.Control
                                as='textarea'
                                row='5'
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                              ></Form.Control>
                            </Form.Group>

                            <Button
                              disabled={loadingProductReview}
                              type='submit'
                              variant='primary'
                            >
                              Submit
                            </Button>

                          </Form>
                        ) : (
                          <Message variant='info'>Please <Link to='/login'>login</Link> to write a review</Message>
                        )}
                      </ListGroup.Item>
                    </ListGroup>
                  </Col>
                </Row>
              </div>

            )
      }


    </div>
  )
}

export default ProductScreen

// nthan add to cart button kazinjitte kore hight verunille 