import React, {useState, useEffect} from 'react'
import { Link,  useNavigate,useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { Form, Button, } from 'react-bootstrap'
import Loader from '../components/Loadar'
import Message from '../components/Messages'
import FormContainer from '../components/FormContainer'
import { listProductDetails , updateProduct } from '../actions/productActions'
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants'


function ProductEditScreen() {
    const match = useParams();
    const productId = match.id
    const [name,setName] = useState('')
    const [price,setPrice] = useState(0)
    const [image,setImage] = useState('')
    const [brand,setBrand] = useState('')
    const [category,setCategory] = useState('')
    const [countInStock,setCountInStock] = useState(0)
    const [description,setDescription] = useState('')
    const [uploading, setUploading] = useState(false)
    const dispatch = useDispatch()
    let navigate = useNavigate()

    


    const productDetails = useSelector(state => state.productDetails)
    const { error, user , product} = productDetails

    const productUdpate = useSelector(state => state.productUdpate)
    const { error:errorUpdate, loading: loadingUpdate, success: successUpdate } = productUdpate


    useEffect(()=>{
        if(successUpdate){
            dispatch({type: PRODUCT_UPDATE_RESET})
            navigate('/admin/productlist')
        }else{

            if(! product.name || product?._id !== Number(productId)){  
                dispatch(listProductDetails(productId))
               }else{
                 setName(product.name)
                 setPrice(product.price)
                 setImage(product.Image)
                 setBrand(product.brand)
                 setCategory(product.category)
                 setCountInStock(product.countInStock)
                 setDescription(product.description)
               }

      

        }

    },[dispatch,productId, product ,successUpdate ])


    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(updateProduct({
            _id: productId, 
            name, 
            price, 
            image, 
            brand,
            category,
            countInStock,
            description
        }))
    }

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0]
        const formData = new FormData()

        formData.append('image', file)
        formData.append('product_id', productId)

        setUploading(true)

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }

            const { data } = await axios.post('/api/products/upload/', formData, config)


            setImage(data)
            setUploading(false)

        } catch (error) {
            setUploading(false)
        }
    }



  return (
    <div>
        <Link to ='/admin/productlist'>
        Go Back
        </Link>
        <FormContainer>
            <h1>Edit Product</h1>
            {loadingUpdate && <Loader/>}
            {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
                  <Form onSubmit = {submitHandler}>
                  <Form.Group controlId = 'name'>
                              <Form.Label>Name</Form.Label>
                              <Form.Control name='name'  type='text' placeholder = 'Enter Name' value={name} onChange={(e) => setName(e.target.value)}></Form.Control>
                  </Form.Group>

                  <Form.Group controlId = 'price'>
                              <Form.Label>Price</Form.Label>
                              <Form.Control name='price'  type='number' placeholder = 'Enter Price' value={price} onChange={(e) => setPrice(e.target.value)}></Form.Control>
                  </Form.Group>

                  <Form.Group controlId='image'>
                                <Form.Label>Image</Form.Label>
                                <Form.Control
                                id="image-file"
                                label="Choose file"
                                type="file"
                                custom
                                onChange={uploadFileHandler} >
                                
                                </Form.Control>
                                {uploading && <Loader />}

                            </Form.Group>                  <Form.Group controlId = 'brand'>
                              <Form.Label>Brand</Form.Label>
                              <Form.Control name='brand'  type='text' placeholder = 'Enter brand' value={brand} onChange={(e) => setBrand(e.target.value)}></Form.Control>
                  </Form.Group>

                  <Form.Group controlId = 'countinstock'>
                              <Form.Label>Stock</Form.Label>
                              <Form.Control name='stock'  type='number' placeholder = 'Enter stock' value={countInStock} onChange={(e) => setCountInStock(e.target.value)}></Form.Control>
                  </Form.Group>

                  <Form.Group controlId = 'category'>
                              <Form.Label>Category</Form.Label>
                              <Form.Control name='category'  type='text' placeholder = 'Enter category' value={category} onChange={(e) => setCategory(e.target.value)}></Form.Control>
                  </Form.Group>

                  <Form.Group controlId = 'description'>
                              <Form.Label>Description</Form.Label>
                              <Form.Control name='description'  type='text' placeholder = 'Enter Description' value={description} onChange={(e) => setDescription(e.target.value)}></Form.Control>
                  </Form.Group>
                  <Form.Group className='my-3 text-center'>
                  <Button  type='submit' variant = 'primary'>Update</Button>
                 </Form.Group>
                  </Form>
        
        </FormContainer>
    </div>
  )
}

export default ProductEditScreen
