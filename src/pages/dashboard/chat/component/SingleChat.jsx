import {
  Box,
  Text,
  IconButton,
  Avatar,
  Spinner,
  FormControl,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  useBreakpointValue,
  useToast,
  useDisclosure,
  Textarea,
} from "@chakra-ui/react";


import { ArrowBackIcon } from "@chakra-ui/icons";
import { FaCircle, FaPaperclip, FaSmile, FaTelegramPlane } from "react-icons/fa";
import Lottie from "react-lottie";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import { useContext, useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import ProfileModal from "./miscellaneous/Profilemodal";
import ScrollableChat from "./ScrollableChat";
import { getSender, getSenderFull } from "./ChatLogic";
import animationData from "../animations/typing.json";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { AuthContext } from "@/pages/auth/Auth-context";
import { ChatState } from "./miscellaneous/ChatProvider";
import FileUploadModal from "./miscellaneous/FileUploadModal";
import backgroundImage from './hello.png';
import { useNotification } from '@/context/NotificationContext';



var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
 
  const [socketConnected, setSocketConnected] = useState(false);
  const [loggedUser, setLoggedUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const auth = useContext(AuthContext);
  const mobileBreakpoint = useBreakpointValue({ base: true, md: false });

   const toast = useToast();
  const GroupAvatar = ({ groupName }) => {
    const initials = groupName
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase();

    return (
      <Avatar name={initials} size="sm" mr={2} ml={{ base: "10px", sm: "10px" }} />
    );
  };

  const backgroundStyle = {
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  height: '100%'
};

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const {
    selectedChat,
    setSelectedChat,
    user,
    notification,
    setNotification,
  } = ChatState();

  const handleFileUpload = (file, preview) => {
    if (!file || !preview) return;

    const newMessage = {
      sender: {
        name: loggedUser.name,
        pic: loggedUser.pic,
        _id: loggedUser._id,
      },
      content: `File uploaded: ${file.name}`,
      preview,
    };

    setMessages([...messages, newMessage]);
  };

  const fetchUserDetails = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/user/get/user/byid/${auth.userId}`,
        {
          headers: {
            Authorization: "Bearer " + auth.token,
          },
        }
      );
      const data = await response.json();
      setLoggedUser({
        _id: data.user._id,
        name: `${data.user.firstName} ${data.user.lastName}`,
        email: data.user.email,
        pic: `${import.meta.env.REACT_APP_BACKEND_URL}/${data.user.image}`,
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
      const response = await fetch(
        `${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/message/get/all/messages/byid/${selectedChat._id}`,
        {
          headers: {
            Authorization: "Bearer " + auth.token,
          },
        }
      );
      const data = await response.json();
      setMessages(data.messages);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {show,setShow}=useState(false);
  const { addNotification } = useNotification();
  
  useEffect(() => {
    socket = io(import.meta.env.REACT_APP_BACKEND_URL);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
    socket.on("online users", (users) => setOnlineUsers(users));
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        // Trigger the notification
        addNotification({
          content: newMessageReceived.content,
          senderName: newMessageReceived.sender.name,
        });
        setFetchAgain((prev) => !prev);
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          newMessageReceived,
        ]);
      }
    });

    return () => {
      socket.off("message received");
      socket.off("connected");
      socket.off("typing");
      socket.off("stop typing");
      socket.off("online users");
    };
  }, [selectedChatCompare, setFetchAgain, user, addNotification]);
  
  useEffect(() => {
    fetchUserDetails();
    if (selectedChat) {
      fetchMessages();
    }
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  const sendMessage = async () => {
    if (newMessage || selectedFile) {
      socket.emit("stop typing", selectedChat._id);
      try {
        setUploadingFile(true);
        let formData = new FormData();
        formData.append("chatId", selectedChat._id);
        formData.append("sender", auth.userId);
        if (newMessage) {
          formData.append("content", newMessage);
        } else if (selectedFile) {
          formData.append("content", `File uploaded: ${selectedFile.name}`);
        }
        if (selectedFile) {
          formData.append("file", selectedFile);
        }

        setNewMessage("");
        setSelectedFile(null);

        const response = await fetch(
          `${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/message/send/message`,
          {
            method: "POST",
            headers: {
              Authorization: "Bearer " + auth.token,
            },
            body: formData,
          }
        );

        const data = await response.json();
        socket.emit("new message", data.message);
        setMessages((prevMessages) => [
          ...prevMessages,
          data.message,
        ]);
        setUploadingFile(false);
      } catch (error) {
        setUploadingFile(false);
        toast({
          title: "Error Occurred!",
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
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setNewMessage(e.target.files[0].name);
  };

  const handleEmojiSelect = (emoji) => {
    setNewMessage(newMessage + emoji.native);
    setShowEmojiPicker(false);
  };

  useEffect(() => {
    if (mobileBreakpoint) {
      const handleResize = () => {
        const activeElement = document.activeElement.tagName;
        if (activeElement === 'TEXTAREA' || activeElement === 'INPUT') {
          const inputField = document.getElementById('chatInputField');
          inputField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [mobileBreakpoint]);

  return (
    <>
      {selectedChat && loggedUser ? (
        <>
          <Box
            fontSize={{ base: "15px", md: "25px" }} // Responsive font sizes
            ml={{ base: 0, sm: "auto" }} // Responsive margin-left for the container
            w="100%" // Full width
            fontFamily="sans-serif" // Font family
            display="flex" // Flexbox for alignment
            px={2} // Space between items
           
            position="relative" 
            py={1} // Padding Y
            flexDirection="column" // Allow children to stack vertically
          >
            <Box 
              display="flex" 
              alignItems="center" 
              mb={1}
              w="100%" // Ensure it takes the full width
              px={0} // Remove any extra padding
              ml={0} // Remove any extra margin
            >
              <IconButton
                display={{ base: "flex", md: "none" }}
                icon={<ArrowBackIcon />}
                onClick={() => setSelectedChat(null)}
                ml={0} // Ensure no left margin
                p={0} // Remove any padding
              />


              <Box display="flex" alignItems="center" flex={1}>
                {messages && (
                  !selectedChat.isGroupChat ? (
                    <>
                      <Avatar
                        size="sm"
                        name={getSender(loggedUser, selectedChat.users)}
                        src={getSenderFull(loggedUser, selectedChat.users)?.pic}
                        mr={2}
                        ml={{ base: "10px", sm: "10px" }}
                      />
                      <Text style={{ marginLeft: '0' }}>
                        {getSender(loggedUser, selectedChat.users)}
                      </Text>
                    </>
                  ) : (
                    <>
                      <GroupAvatar groupName={selectedChat.chatName} mr={2} />
                      <Text style={{ marginLeft: '0' }}>
                        {selectedChat.chatName.toLowerCase()}
                      </Text>
                    </>
                  )
                )}

                {/* Display Online/Offline Status */}
                <FaCircle
                  color={onlineUsers.includes(loggedUser._id) ? "green" : "red"}
                  size={10}
                  style={{ marginLeft: "auto" }}
                />
              </Box>
            </Box>


            {/* Lottie Animation Box moved below the chat name */}
            {istyping && (
              <Box
                display="flex"
                
               
                mt={1} // Margin top to position below the chat name
              >
                <Lottie
                  options={defaultOptions}
                  width={30}
                  style={{ marginTop: '0', marginLeft: '20px' }}
                />
              </Box>
            )}

            {/* ProfileModal or UpdateGroupChatModal positioned to the right */}
            <Box
              position="absolute"
              right={0}
              top="50%"
              transform="translateY(-50%)"
              zIndex="1"
              py={1}
            >
              {!selectedChat.isGroupChat ? (
                <ProfileModal user={getSenderFull(loggedUser, selectedChat.users)} />
              ) : (
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              )}
            </Box>
          </Box>

          <Box
          style={backgroundStyle}
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
              <Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" />
            ) : (
              <ScrollableChat messages={messages} />
            )}
            <FormControl id="chatInputField" isRequired mt={3}>
              
              <InputGroup size="md">
                <InputLeftElement>
                  <IconButton
                    h="1.75rem"
                    size="sm"
                    icon={<FaSmile />}
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  />
                </InputLeftElement>
                
                <Box position="relative" width="100%">
                  <Textarea
                    bg="#E0E0E0" // Set a consistent background color
                    placeholder="Enter a message.."
                    value={newMessage}
                    onChange={typingHandler}
                    resize="none"
                    rows={1}
                    paddingLeft="2.5rem" // Add padding to the left to make space for the emoji icon
                    paddingRight="4.5rem" // Add padding to the right to make space for file and send icons
                    overflowY="auto" // Enable vertical scrolling
                    maxHeight="150px" // Set a max height for the textarea
                    whiteSpace="pre-wrap" // Ensure text wraps to the next line
                    wordBreak="break-word" // Break long words to wrap
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    _focus={{
                      bg: "#E0E0E0", // Ensure the background color remains the same on focus
                      borderColor: "transparent", // Remove the default border color change on focus
                    }}
                  />
                  
                  <InputRightElement width="4.5rem">
                    <IconButton
                      h="1.75rem"
                      size="sm"
                      icon={<FaPaperclip />}
                      onClick={onOpen}
                      marginRight="2"
                    />
                    <IconButton
                      h="1.75rem"
                      size="sm"
                      icon={<FaTelegramPlane />}
                      onClick={sendMessage}
                    />
                  </InputRightElement>
                </Box>
              </InputGroup>
              
              {showEmojiPicker && (
                <Picker set="apple" onSelect={handleEmojiSelect} />
              )}
              <FileUploadModal isOpen={isOpen} onClose={onClose} onFileUpload={handleFileUpload} />
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
