import React, {useState, } from 'react'
import {useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button, Col } from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { savePaymentMethod } from '../actions/cartActions'


function PaymentScreen({history}) {
    const cart = useSelector(state => state.cart)
    const { shippingAddress } = cart
    const dispatch = useDispatch()
    const [paymentMethod, setPaymentMethod] = useState('PayPal')
    let navigate = useNavigate()
    if (! shippingAddress.address) {
        history.push('/shipping')
    }

    const submitHandler = (e) =>{
        e.preventDefault()
        dispatch(savePaymentMethod(paymentMethod))
        navigate('/placeorder')
    }
  return (
    <FormContainer>
        <CheckoutSteps  step1 step2 step3/>

        <Form onSubmit= {submitHandler}>
            <Form.Group>
                <Form.Label as = 'legend'> Select Methods</Form.Label>
                <Col>
                <Form.Check type = 'radio' label= 'PayPal or Credit Card' id ='paypal' name = 'paymentMethod' checked onChange = {(e) => setPaymentMethod(e.target.value)}>

                </Form.Check>
                </Col>
            </Form.Group>
<div className="btn-wrap" style={{display:"flex"}}>

          <Button type = "submit" style={{margin:"auto" ,marginTop:"20px"}} className='btn-block' variant= 'primary'>Continue</Button>
</div>

        </Form>
    </FormContainer>

  )
}

export default PaymentScreen