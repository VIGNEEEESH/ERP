import React, { useState } from 'react';
import {
  Box, Text, IconButton, Input, useDisclosure, Image
} from "@chakra-ui/react";
import Picker from 'emoji-picker-react';
<<<<<<< Updated upstream
import { FaSmile } from 'react-icons/fa';


import "./styles.css";
import SingleChat from "./SingleChat";
import { ChatState } from './miscellaneous/ChatProvider';


const Chatbox = ({ fetchAgain, setFetchAgain }) => {
=======
import { FaSmile, FaPaperclip, FaFilePdf, FaFilePowerpoint, FaFileWord, FaFile } from 'react-icons/fa';
import FileUploadModal from './miscellaneous/FileUploadModal'; // Import the new component
import "./styles.css";

// Mock ChatState context for demonstration purposes
const ChatState = () => ({
  selectedChat: {
    _id: "1",
    chatName: "DESIGN TEAM",
    isGroupChat: true,
    users: [
      { _id: "123", name: "Rishabh" },
      { _id: "456", name: "John Doe" },
    ],
    messages: [
      { sender: { name: "Rishabh" }, content: "Hello everyone!" },
      { sender: { name: "Priyanka" }, content: "Hi Rishabh!" },
    ],
  },
});

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const [inputValue, setInputValue] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [messages, setMessages] = useState(ChatState().selectedChat.messages);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleEmojiClick = (emojiObject) => {
    setInputValue(prevInput => prevInput + emojiObject.emoji);
  };

  const handleFileUpload = (file, preview) => {
    setMessages([...messages, { sender: { name: "Priyanka" }, content: `File uploaded: ${file.name}`, preview }]);
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      setMessages([...messages, { sender: { name: "Priyanka" }, content: inputValue }]);
      setInputValue('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    switch (ext) {
      case 'pdf':
        return <FaFilePdf size={30} />;
      case 'ppt':
      case 'pptx':
        return <FaFilePowerpoint size={30} />;
      case 'doc':
      case 'docx':
        return <FaFileWord size={30} />;
      default:
        return <FaFile size={30} />;
    }
  };

>>>>>>> Stashed changes
  const { selectedChat } = ChatState();

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
<<<<<<< Updated upstream
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
=======
      {messages.map((message, index) => (
        <Box
          key={index}
          w={message.sender.name === "Priyanka" ? "50%" : "90%"}
          p={3}
          bg={message.sender.name === "Priyanka" ? "blue.100" : "gray.100"}
          borderRadius="md"
          mb={3}
          ml={message.sender.name === "Priyanka" ? "auto" : "0"}
        >
          <Text>
            <strong>{message.sender.name}:</strong> {message.content}
          </Text>
          {message.preview && message.preview.type === "image" && (
            <Image src={message.preview.content} alt="Uploaded preview" mt={2} />
          )}
          {message.preview && message.preview.type === "video" && (
            <Box mt={2}>
              <video width="100%" controls>
                <source src={message.preview.content} type="video/mp4" />
                Priyankar browser does not support the video tag.
              </video>
            </Box>
          )}
          {message.preview && message.preview.type === "file" && (
            <Box mt={2} display="flex" alignItems="center">
              {getFileIcon(message.preview.content)}
              <Text ml={2}>{message.preview.content}</Text>
            </Box>
          )}
        </Box>
      ))}

      <Box position="fixed" bottom="0" w={{ base: "100%", md: "50%" }} p={3} bg="white" borderTop="1px solid #E0E0E0" ml="0" display="flex" alignItems="center">
        <IconButton
          aria-label="Upload file"
          icon={<FaPaperclip />}
          onClick={onOpen}
          bg="transparent"
          mr={2}
        />
        <Input
          variant="filled"
          bg="#E0E0E0"
          placeholder="Enter a message.."
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <IconButton
          aria-label="emoji picker"
          icon={<FaSmile />}
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          bg="transparent"
          ml={2}
        />
        {showEmojiPicker && (
          <Box position="absolute" bottom="60px">
            <Picker onEmojiClick={handleEmojiClick} />
          </Box>
        )}
      </Box>

      <FileUploadModal
        isOpen={isOpen}
        onClose={onClose}
        onFileUpload={handleFileUpload}
      />
>>>>>>> Stashed changes
    </Box>
  );
};

export default Chatbox;