import axios from 'axios'

import { 
    ORDER_CREATE_REQUEST,
    ORDER_CREATE_SUCCESS,
    ORDER_CREATE_FAIL,

 } from '../constants/orderConstants'

 import { CART_CLEAR_ITEMS } from '../constants/cartConstants'


 export const createOrder=(order) => async (dispatch, getState)=>{

    try {
        dispatch({
            type :ORDER_CREATE_REQUEST
        })

        const{
            userLogin : { userInfo },
        } = getState()


        const { data } = await axios
        .create({
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
            'Content-Type': 'application/json',
          },
        })
        .post(`/api/orders/add/`,order)

        
        dispatch({
            type: ORDER_CREATE_SUCCESS,
            payload :data
        })

        dispatch({
            type: CART_CLEAR_ITEMS,
            payload :data
        })

        localStorage.removeItem('cartItems')

        
    }catch(error){
        dispatch({
            type: ORDER_CREATE_FAIL,
            payload :error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
        })

    }
}
