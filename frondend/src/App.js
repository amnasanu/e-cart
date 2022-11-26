import Footer from './components/Footer'
import Header from './components/Header'
import { Container } from 'react-bootstrap'
import { HashRouter as Router, Route, Routes } from 'react-router-dom'
import HomeScreen from './screens/HomeScreen'
import ProductScreen from './screens/ProductScreen'
import CartScreen from './screens/CartScreen'
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'
import ProfileScreen from './screens/ProfileScreen'
import ShippingScreen from './screens/ShippingScreen'
import PaymentScreen from './screens/PaymentScreen'
import PlaceOrderScreen from './screens/PlaceOrderScreen'
import OrderScreen from './screens/OrderScreen'
import UserListScreen from './screens/UserListScreen'
import UserEditScreen from './screens/UserEditScreen'
import ProductListScreen from './screens/ProductListScreen'
import ProductEditScreen from './screens/ProductEditScreen'
import OrderListScreen from './screens/OrderListScreen'

function App() {
  return (
    <Router>
      <Header />
      <main className="py-3">
        <Container>
          <Routes>
            <Route index path='/' element={<HomeScreen />} />
            <Route index exact path='/shipping' element={<ShippingScreen />} />
            <Route index path='/login' element={<LoginScreen />} />
            <Route index path='/register' element={<RegisterScreen />} />
            <Route index path='/placeorder' element={<PlaceOrderScreen />} />
            <Route index path='/order/:id' element={<OrderScreen />} />
            <Route index path='/profile' element={<ProfileScreen />} />
            <Route index path='/payment' element={<PaymentScreen />} />
            <Route index path='/admin/userlist' element={<UserListScreen />} />
            <Route index path='/admin/productlist' element={<ProductListScreen />} />
            <Route path='/admin/product/:id/edit' element={<ProductEditScreen />} />
            <Route path='/product/:id' element={<ProductScreen />} />
            <Route path='/admin/user/:id/edit' element={<UserEditScreen />} />
            <Route path='/cart/:id' element={<CartScreen en />} />
            <Route path='/admin/orderlist' element = {<OrderListScreen/>} />
            <Route path='/cart' element={<CartScreen en />} />
          </Routes>
        </Container>
      </main>
      <Footer />
    </Router>
  );
}

export default App;     
