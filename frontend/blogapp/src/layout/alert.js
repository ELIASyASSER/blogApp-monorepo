import React, { useEffect } from 'react'

function Alert({alert}) {
    useEffect(()=>{
        const timeout = setTimeout(() => {
            alert()

        }, 2000);

        return ()=>{
          clearTimeout(timeout)
        }
    },[])
  return (
    <p className='alert'>Registerd Successfully</p>
  )
}

export default Alert
