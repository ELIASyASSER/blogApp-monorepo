import React,{ useContext, createContext,useState } from 'react' 
import Link from 'react-router-dom'
export const UserContext = createContext()

export const AppProvider =({children})=>{
    const [userInfo,setUserInfo] = useState(null)
    
    return(
        <UserContext.Provider value={{userInfo,setUserInfo}}>
                {children}
        </UserContext.Provider>
    ) 
}