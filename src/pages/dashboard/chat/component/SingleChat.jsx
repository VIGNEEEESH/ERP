import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import { IconButton, Spinner, useToast } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useContext, useEffect, useState } from "react";
import ProfileModal from "./miscellaneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { AuthContext } from "@/pages/auth/Auth-context";
import { ChatState } from "./miscellaneous/ChatProvider";
import "./styles.css"

const SingleChat = ({ fetchAgain,setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const toast = useToast();
  const [loggedUser, setLoggedUser] = useState([]);
const auth=useContext(AuthContext)
  

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();
    
  const fetchUserDetails = async () => {
    try {
      const response = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/user/get/user/byid/${auth.userId}`, {
        headers: {
          Authorization: "Bearer " + auth.token,
        },
      });
      const data = await response.json();
      setLoggedUser({
        _id: data.user._id,
        name: `${data.user.firstName} ${data.user.lastName}`,
        email: data.user.email,
        pic: `${import.meta.env.REACT_APP_BACKEND_URL}/${data.user.image}` || "https://cdn.britannica.com/72/232772-050-4E3D86CC/mind-blown-emoji-head-exploding-emoticon.jpg",
      });
      
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
  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
     

      setLoading(true);

      const response = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/message/get/all/messages/byid/${selectedChat._id}`, {
        headers: {
          Authorization: "Bearer " + auth.token,
        },
      });
      const data = await response.json();
      setMessages(data.messages);
      console.log(data.messages)
      setLoading(false);

      
    } catch (error) {
      console.log(error)
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  useEffect(() => {
    fetchUserDetails()
    if (selectedChat) {
      setLoading(true);
      
      fetchMessages()
      
    }
  }, [selectedChat]);

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      
      try {
        
        setNewMessage("");
        const response = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/message/send/message`, {
          method:"POST",
          headers: {
            Authorization: "Bearer " + auth.token,
            "Content-Type":"application/json"
          },
          body:JSON.stringify({content:newMessage,chatId:selectedChat._id,sender:auth.userId})
        });
        const data=await response.json()
        console.log(data.message)
        setMessages([...messages, data.message]);
      } catch (error) {
        console.log(error)
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!typing) {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
      }, 3000);
    }
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat(null)}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {selectedChat.users[0]._id === loggedUser._id
                  ? selectedChat.users[1].name
                  : selectedChat.users[0].name}
                <ProfileModal
                  user={
                    selectedChat.users[0]._id === loggedUser._id
                      ? selectedChat.users[1]
                      : selectedChat.users[0]
                  }
                />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl onKeyDown={sendMessage} id="first-name" isRequired mt={3}>
              {istyping && (
                <div>
                  <Lottie
                    options={defaultOptions}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              )}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;