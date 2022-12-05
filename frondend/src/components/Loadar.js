import React from 'react'
import { Spinner } from 'react-bootstrap'

function Loadar() {
  return (
    <Spinner 
    animation = 'border'
    role = 'status'
    style = {{
        height :'60px',
        width : '60px',
        margin :'auto',
        display :'block'
    }}
    >
        <span className='sr-only'>Loading ...</span>

    </Spinner>
  )
}

export default Loadar