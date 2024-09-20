import React, { useContext } from 'react'
import {Link} from 'react-router-dom'
import { UserContext } from '../context'
function Header() {
  const {userInfo,setUserInfo} =  useContext(UserContext)
  const logout =()=>{
    fetch("http://localhost:4000/logout",{
      credentials:"include",
      method:"POST"
    })
    setUserInfo(null)
  }
  React.useEffect(() => {
    fetch("http://localhost:4000/profile",{
      credentials:"include"
    }).then(res=>{
      res.json().then(info=>setUserInfo(info))
    })
  }, [])
  const username = userInfo?.username
  return (
    <header>
          <Link className='logo' to='/'>My BLog</Link>
        <nav>
          {username&&(
            <>
              <Link to='/createPost'>Create Post</Link>
              <a onClick={logout} style={{cursor:"pointer"}}>LogOut</a>
            </>
          )
          }
          
          {
            !username&&
            (<>
              <Link to='/register'>Register</Link>
              <Link to='/login'>Login</Link>
            </>
            )
          }
        </nav>
    </header>
  )
}

export default Header
