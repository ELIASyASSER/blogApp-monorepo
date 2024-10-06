import React,{ useContext, createContext,useState } from 'react' 

import Link from 'react-router-dom'

export const UserContext = createContext({

    isLoading:true,
    user:null,
    refetchUser:()=>null,
    logoutUser:()=>null
})

export const AppProvider =({children})=>{
    const [value,setValue] = useState({isLoading:false,user:null})
    const [modalOpen,setModalOpen] = useState(false)
    const refetchUser = React.useCallback(()=>{
        //call /profile endpoint to get user data
        setValue({isLoading:true,user:null})
        fetch("http://localhost:4000/profile", {
            credentials: "include",
          }).then(res=>{
            if(res.ok){
                return res.json()
            }
            throw new Error("Response network is not ok")
          })
          .then((info)=>setValue({isLoading:false,user:info}))
          .catch(err=>{
            console.log("something went wrong while fetching the user",err)
            setValue({isLoading:false,user:null})
            
          })

        
    },[])
    

    const logoutUser = React.useCallback(()=>{
        // call the /logout endpoint 
            fetch("http://localhost:4000/logout", {
                credentials: "include",
                method: "POST",
            }).then(
                setValue({isLoading:false,user:null})
            );
            
    },[])

    const contextValue = React.useMemo(()=>{
        return{
            ...value,
            refetchUser,
            logoutUser,
            modalOpen,
            setModalOpen
        }

    },[value,refetchUser,logoutUser,modalOpen,setModalOpen])


    return(
        <UserContext.Provider value={contextValue} >
                {children}
        </UserContext.Provider>
    ) 
}
export const useUser = ()=>{
    return useContext(UserContext)
}