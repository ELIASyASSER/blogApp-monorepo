import { useContext, createContext,useState } from 'react' 


export const UserContext = createContext({})

export const AppProvider =({children})=>{
    
    const [user, setUser] = useState(null); 
    const [loading,setLoading] = useState(false)
    const [modalOpen,setModalOpen] = useState(false)


    const profileUser =  ()=>{
        //call /profile endpoint to get user data
        setLoading(true)

        fetch("http://localhost:4000/profile", {
            credentials: "include",
        }).then(res=>{
            if(res.ok){
                return res.json()
            }
            alert("something went wrong please try again later")
        })
        .then((info)=>{
            setLoading(false)
            setUser(info)
            localStorage.setItem("user",JSON.stringify(user))
        })
        .catch(err=>{

            console.log("something went wrong while fetching the user",err)
            alert("something went wrong please try again later ...")
            localStorage.removeItem("user")
            setUser(null)
            setLoading(false)
        })

        
    }

    const logoutUser = ()=>{
        // call the /logout endpoint 
            setLoading(true)
            fetch("http://localhost:4000/logout", {
                credentials: "include",
                method: "POST",
            }).then(()=>{
                setLoading(false)
                setUser(null)

                localStorage.removeItem("user")

            });
            
    }



    return(
        <UserContext.Provider value={{profileUser,logoutUser,modalOpen,setModalOpen,loading,setLoading}} >
                {children}
        </UserContext.Provider>
    ) 
}
export const useUser = ()=>{
    return useContext(UserContext)
}