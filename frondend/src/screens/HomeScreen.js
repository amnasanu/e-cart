import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import { listProducts } from '../actions/productActions'
import Loding from '../components/Loadar'
import  ProductCarousel  from '../components/ProductCarousel'
import { useNavigate , useSearchParams} from 'react-router-dom'
import Message from '../components/Messages'
import Paginate from '../components/Paginate'


function HomeScreen() {
  const dispatch = useDispatch()

  const productList = useSelector(state => state.productList)
  const { error, loading, products,page, pages } = productList
  
  const [searchParams] = useSearchParams()
  const keyword = searchParams.get('keyword')

  
  useEffect(() => {
    dispatch(listProducts(keyword))

  }, [dispatch , keyword])

  return (
    <div>
      {!keyword &&   <ProductCarousel/> }
      <h1>Latest Product</h1>
      {loading ? <Loding />
        : error ? <Message variant='danger'>{error}</Message>
          :
        <div>
          <Row>
            {products?.map(product => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          {/* <Paginate page={pages} pages={pages} keyword = {keyword}/> */}
          </div>
      }
    </div>
  )
}

export default HomeScreen