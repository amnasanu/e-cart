import React, {useState, useEffect} from 'react'
import { Link,  useNavigate,useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button, } from 'react-bootstrap'
import Loader from '../components/Loadar'
import Message from '../components/Messages'
import FormContainer from '../components/FormContainer'
import { getUserDetails , updateUser } from '../actions/userAction'
import { USER_UPDATE_RESET } from '../constants/userConstants'

function UserEditScreen() {
    const match = useParams();
    const userId = match.id
    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [isAdmin,setAdmin] = useState(false)
    const dispatch = useDispatch()
    let navigate = useNavigate()

    


    const userDetails = useSelector(state => state.userDetails)
    const { error, user , loading} = userDetails

    const userUpdate = useSelector(state => state.userUpdate)
    const { error:errorUpdate, loading :loadingUpdate, success :successUpdate } = userUpdate

    console.log(user)

    useEffect(()=>{
      if(successUpdate) {
        dispatch({type: USER_UPDATE_RESET})
        navigate('/admin/userlist')

      }else{
        // ? optional chaining
        if(! user || user?._id !== Number(userId)){  
          dispatch(getUserDetails(userId))
         }else{
           setName(user.name)
           setEmail(user.email)
           setAdmin(user.isAdmin)
         }

      }
     
    },[dispatch, userId,user, successUpdate, navigate ])


    const submitHandler = (e) => {
        e.preventDefault()
        console.log(user._id, name, email, isAdmin)
        dispatch(updateUser({_id:user._id, name, email, isAdmin}))
    }

  return (
    <div>
        <Link to ='/admin/userlist'>
        Go Back
        </Link>
        <FormContainer>
            <h1>Edit user</h1>
            {loadingUpdate && <Loader/>}
            {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
            {loading ? <Loader /> :error ? <Message variant = 'danger'>{error}</Message> :(
                  <Form onSubmit = {submitHandler}>
                  <Form.Group controlId = 'name'>
                              <Form.Label>Name</Form.Label>
                              <Form.Control name='name'  type='name' placeholder = 'Enter Name' value={name} onChange={(e) => setName(e.target.value)}></Form.Control>
                  </Form.Group>
                  <Form.Group controlId = 'email'>
                              <Form.Label>Email Address</Form.Label>
                              <Form.Control   name='email' type='email' placeholder = 'Enter Email' value={email} onChange={(e) => setEmail(e.target.value)}></Form.Control>
                  </Form.Group>
      
                  <Form.Group controlId = 'isAdmin'>
                              <Form.Check name='is Admin'  type='checkbox' label='Is Admin' checked={isAdmin} onChange={(e) => setAdmin(e.target.checked)}></Form.Check>
                  </Form.Group>
      
                  <Button type='submit' variant = 'primary'>Update</Button>
                  </Form>
            )}
        </FormContainer>
    </div>
  )
}

export default UserEditScreen