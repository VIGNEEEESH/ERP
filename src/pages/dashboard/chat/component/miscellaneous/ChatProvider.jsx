import { AuthContext } from "@/pages/auth/Auth-context";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState();
  const auth=useContext(AuthContext)
  const history = useNavigate();
  const [isActiveChat, setIsActiveChat] = useState(false);

  const fetchUserDetails = async () => {
    
    try {
      const response = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/user/get/user/byid/${auth.userId}`, {
        headers: {
          Authorization: "Bearer " + auth.token,
        },
      });
      const data = await response.json();
      setUser(data.user);
      
      
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to load user details",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  useEffect(()=>{
    fetchUserDetails()
  },[auth.userId]);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
         setIsActiveChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;