import {
  FormControl,
  Input,
  Box,
  Text,
  IconButton,
  Spinner,
  useToast,
  useDisclosure,
  InputGroup,
  InputRightElement
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useContext, useEffect, useState, useRef } from "react";
import ProfileModal from "./miscellaneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import { getSender, getSenderFull } from "./ChatLogic";
import animationData from "../animations/typing.json";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { AuthContext } from "@/pages/auth/Auth-context";
import { ChatState } from "./miscellaneous/ChatProvider";
import { io } from "socket.io-client";
import FileUploadModal from "./miscellaneous/FileUploadModal";
import { FaPaperclip, FaSmile } from 'react-icons/fa';
import { Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';

var socket, selectedChatCompare;
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const toast = useToast();
  const [socketConnected, setSocketConnected] = useState(false);
  const [loggedUser, setLoggedUser] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const auth = useContext(AuthContext);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const { selectedChat, setSelectedChat, user, notification, setNotification } = ChatState();

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

      const response = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/message/get/all/messages/byid/${selectedChat._id}`, {
        headers: {
          Authorization: "Bearer " + auth.token,
        },
      });
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

  useEffect(() => {
    socket = io(import.meta.env.REACT_APP_BACKEND_URL);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    socket.on("message received", (newMessageReceived) => {
      
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
        if (!notification.includes(newMessageReceived)) {
          setNotification((prevNotification) => [newMessageReceived, ...prevNotification]);
          setFetchAgain((prev) => !prev);
        }
      } else {
        setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
      }
    });

    return () => {
      socket.off("message received");
      socket.off("connected");
      socket.off("typing");
      socket.off("stop typing");
    };
  }, [notification, selectedChatCompare, setFetchAgain, user]);

  useEffect(() => {
    fetchUserDetails();
    if (selectedChat) {
      setLoading(true);
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
        
        const response = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/message/send/message`, {
          method: "POST",
          headers: {
            Authorization: "Bearer " + auth.token,
          },
          body: formData,
        });
        
        const data = await response.json();
        socket.emit("new message", data.message);
        setMessages((prevMessages) => [...prevMessages, data.message]);
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
    // Update the input field with the file name
    setNewMessage(e.target.files[0].name);
  };

  const handleEmojiSelect = (emoji) => {
    setNewMessage(newMessage + emoji.native);
    setShowEmojiPicker(false);
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
              onClick={() => setSelectedChat("")}
            />
            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  {getSender(loggedUser, selectedChat.users)}
                  <ProfileModal user={getSenderFull(loggedUser, selectedChat.users)} />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                    fetchMessages={fetchMessages}
                  />
                </>
              ))}
          </Text>
          <Box
            display="flex"
            flexDirection="column"
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
              <ScrollableChat messages={messages} />
            )}
            <FormControl isRequired mt={3}>
              {istyping && (
                <div>
                  <Lottie
                    options={defaultOptions}
                    height={50}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              )}
              <InputGroup size="md">
                <Input
                  variant="filled"
                  bg="#E0E0E0"
                  placeholder="Enter a message.."
                  value={newMessage}
                  onChange={typingHandler}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <InputRightElement width="4.5rem">
                  <IconButton
                    h="1.75rem"
                    size="sm"
                    icon={<FaPaperclip />}
                    onClick={() => fileInputRef.current.click()} // Trigger file input click
                  />
                  <IconButton
                    h="1.75rem"
                    size="sm"
                    icon={<FaSmile />}
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  />
                </InputRightElement>
              </InputGroup>
              {showEmojiPicker && (
                <Picker set="apple" onSelect={handleEmojiSelect} />
              )}
              <input
                type="file"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              {uploadingFile && (
                <Box mt={3} display="flex" justifyContent="center">
                  <Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" />
                </Box>
              )}
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
