import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Row, Col, ListGroup, Button, Image, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Message from '../components/Messages'
import Loader from '../components/Loadar'
import { getOrderDetails, payOrder, deliverOrder } from '../actions/orderActions'
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from '../constants/orderConstants'
function OrderScreen() {
    const dispatch = useDispatch()
    const params = useParams()
    const orderId = params.id
    const orderDetails = useSelector(state => state.orderDetails)
    const { order, error, loading } = orderDetails
    const [sdkReady, setSdkReady] = useState(false)
    let navigate = useNavigate()

    const orderPay = useSelector(state => state.orderPay)
    const { loading: loadingPay, success: successPay } = orderPay

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const orderDeliver = useSelector(state => state.orderDeliver)
    const { loading: loadingDeliver, success: successDeliver } = orderDeliver

    if (!loading && !error) {
        order.itemsPrice = order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)
    }

    const addPayPalScript = () => {
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = 'https://www.paypal.com/sdk/js?client-id=AZMBw2wZtkbESE_tcoP9w8wKrTsFZcNLAJN9kkD4K2CH-aiJ2mtzFUhG0Ss19V8B-f939OHqy68QqJ-v&currency=USD'
        script.async = true
        script.onload = () => {
            setSdkReady(true)
        }
        document.body.appendChild(script)
    }

    const initialOptions = {
        "client-id": "AZMBw2wZtkbESE_tcoP9w8wKrTsFZcNLAJN9kkD4K2CH-aiJ2mtzFUhG0Ss19V8B-f939OHqy68QqJ-v",
        currency: "USD",
        intent: "capture",
    };

    useEffect(() => {

        if (!userInfo) {
           navigate('/login')
        }

        if (!order || successPay || order._id !== Number(orderId) || successDeliver) {
            dispatch({ type: ORDER_PAY_RESET })
            dispatch({ type: ORDER_DELIVER_RESET })
            dispatch(getOrderDetails(orderId))
        } else if (!order.is_paid) {
            if (!window.paypal) {
                addPayPalScript()
            } else {
                setSdkReady(true)
            }
        }
    }, [dispatch, order, orderId, successPay, successDeliver])



    const successPaymentHandler = (PaymentResult) => {
        dispatch(payOrder(orderId, PaymentResult))
        console.log(PaymentResult, orderId)
    }

    const deliverHandler = () => {
        dispatch(deliverOrder(order))
    }


    return loading ? (<Loader />) : error ? (<Message variant='danger'>{error}</Message>) : (
        <div>
            <h1>Order :{order._id}</h1>
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p><strong>Name:</strong>{order.user.name} </p>
                            <p><strong>Email:</strong><a href={`mailto:${order.user.email}`}>{order.user.email}</a></p>

                            {order.isDelivered ? (<Message vaiant='success'>Delivered on {order.deliveredAt}</Message>)
                                : (<Message variant='warning'>Not Delivered</Message>)}

                            <p>
                                <strong>Shipping :</strong>

                                {order.shippingAddress.address}, {order.shippingAddress.city}
                                {' '}
                                {order.shippingAddress.postalCode}
                                {' '}
                                {order.shippingAddress.country}
                            </p>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <p>
                                <strong>Method :</strong>
                                {order.paymentMethod}
                            </p>
                            {order.is_paid ? (<Message vaiant='success'>Paid on {order.paidAt}</Message>)
                                : (<Message variant='warning'>Not Paid</Message>)}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {order.orderItems.length === 0 ? < Message variant='info'> Order is empy</Message> : (
                                <ListGroup variant='flush'>
                                    {order.orderItems.map((item, index) => (
                                        <ListGroup.Item key={index}>
                                            <Row>
                                                <Col md={1}>
                                                    <Image src={item.image} alt={item.name} fluid rounded />
                                                </Col>
                                                <Col>
                                                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                                                </Col>
                                                <Col md={4}>
                                                    {item.qty} X {item.price} =  {(Number(item.qty) * Number(item.price)).toFixed(2)}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}

                        </ListGroup.Item>
                    </ListGroup>

                </Col>


                <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>Orders Summary</h2>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Items: </Col>
                                    <Col>${order.itemsPrice}
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping: </Col>
                                    <Col>${order.shippingPrice}
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax: </Col>
                                    <Col>${order.taxPrice}
                                    </Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Total: </Col>
                                    <Col>${order.totalPrice}
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                            {!order.is_paid && (
                                <ListGroup.Item>
                                    {loadingPay && <Loader />}
                                    {!sdkReady ? (
                                        <Loader />
                                    ) : (

                                        <PayPalScriptProvider options={initialOptions}>
                                            <PayPalButtons
                                                createOrder={(data, actions) => {
                                                    return actions.order.create({
                                                        purchase_units: [
                                                            {
                                                                amount: {
                                                                    value: order.totalPrice
                                                                },
                                                            },
                                                        ],
                                                    });
                                                }}
                                                onApprove={(data, actions) => {
                                                    return actions.order.capture().then((details) => {
                                                        const name = details.payer.name.given_name;
                                                        alert(`Transaction completed by ${name}`);
                                                        setSdkReady(true)
                                                        successPaymentHandler(data)

                                                    });
                                                }}
                                                onSuccess={successPaymentHandler} />
                                        </PayPalScriptProvider>
                                    )}
                                </ListGroup.Item>
                            )}
                        </ListGroup>
                        
                        {loadingDeliver && <Loader />}
                        {userInfo && userInfo.isAdmin && order.is_paid && !order.isDelivereds && (
                            <ListGroup.Item>
                                <Button
                                    type='button'
                                    className='btn btn-block'
                                    onClick={deliverHandler}
                                   
                                >
                                    Mark As Delivered
                                </Button>
                            
                            </ListGroup.Item>
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default OrderScreen