import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import { listProducts } from '../actions/productActions'
import Loding from '../components/Loadar'
import  ProductCarousel  from '../components/ProductCarousel'
import { useSearchParams} from 'react-router-dom'
import Message from '../components/Messages'


function HomeScreen() {
  const dispatch = useDispatch()

  const productList = useSelector(state => state.productList)
  const { error, loading, products } = productList
  
  const [searchParams] = useSearchParams()
  const keyword = searchParams.get('keyword')

  
  useEffect(() => {
    dispatch(listProducts(keyword))
  }, [dispatch,keyword])

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
              <Col className="Colum" key={product._id} sm={12} md={6} lg={4} xl={3}>
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