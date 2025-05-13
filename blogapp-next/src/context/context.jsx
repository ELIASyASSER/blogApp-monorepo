"use client"
import { useContext, createContext,useState, useEffect } from 'react' 
import Swal from "sweetalert2"

export const UserContext = createContext({})

export const AppProvider =({children})=>{

    const [loading,setLoading] = useState(false)
    const [modalOpen,setModalOpen] = useState(false)
    const [user, setUser] = useState(null);



    const profileUser =  ()=>{
        //call /profile endpoint to get user data
        setLoading(true)

        fetch("/api/profile", {
            credentials: "include",
        }).then(res=>{
            if(res.status ==200){
                return res.json();
            }
        })
        .then((info)=>{
            setLoading(false)
            setUser(info?.data)
            localStorage.setItem("user",JSON.stringify(info?.data))
        })
        .catch(err=>{

            console.log("something went wrong while fetching the user",err)
            
            Swal.fire({
                position: "top-center",
                icon: "error",
                title: "something went wrong please try again later ..",
                showConfirmButton: false,
                timer: 2000
            });
            setUser(null)
            localStorage.removeItem("user")
            setLoading(false)
        })
        .finally(setLoading(false))

        
    }


    const logoutUser = ()=>{
        // call the /logout endpoint 
            setLoading(true)
            fetch("/api/logout", {
                credentials: "include",
                method: "POST",
            }).then(()=>{
                setLoading(false)
                setUser(null)
                localStorage.removeItem("user")
                Swal.fire({
                      position: "top-center",
                      icon: "success",
                      title: "Logged Out Successfully",
                      showConfirmButton: false,
                      timer: 3500
                });

            });
            
    }
                
      useEffect(() => {
      profileUser();
    
  }, []);

  const areYouLogged = ()=>{
    if(!user){
        return false;
    }
    return true;
}


    const value ={
        profileUser,
        logoutUser,modalOpen,
        setModalOpen,
        loading,setLoading,
        user,setUser,
        areYouLogged
        }

    return(
        <UserContext.Provider value={value} >
                {children}
        </UserContext.Provider>
    ) 
}
export const useUser = ()=>{
    return useContext(UserContext)
}