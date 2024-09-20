const { useContext, createContext,useState } = require("react");

export const UserContext = createContext()

export const AppProvider =({children})=>{
    const [userInfo,setUserInfo] = useState({})
    
    return(
        <UserContext.Provider value={{userInfo,setUserInfo}}>
                {children}
        </UserContext.Provider>
    ) 
}