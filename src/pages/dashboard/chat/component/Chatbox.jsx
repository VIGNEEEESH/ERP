import React, { useState } from 'react';
import { Box, Text, IconButton } from "@chakra-ui/react";
import { Input } from "@chakra-ui/input";
import Picker from 'emoji-picker-react';
import { FaSmile } from 'react-icons/fa';
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
      { sender: { name: "John Doe" }, content: "Hi Rishabh!" },
    ],
  },
});

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const [inputValue, setInputValue] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiClick = (emojiObject) => {
    setInputValue(prevInput => prevInput + emojiObject.emoji);
  };

  const { selectedChat } = ChatState();

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDirection="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="px"
      ml={0}
    >
      <Box w="90%" p={3} bg="gray.100" borderRadius="md" mb={3} >
        <Text><strong>Rishabh:</strong> Hello, how are you?</Text>
      </Box>
      <Box w="50%" p={3} bg="blue.100" borderRadius="md" mb={3} ml="auto">
        <Text><strong>Priyanka:</strong> I'm good, thank you! How about you?</Text>
      </Box>
      <Box w="90%" p={3} bg="gray.100" borderRadius="md" mb={3} >
        <Text><strong>Rishabh:</strong> I'm doing well, just working on a project.</Text>
      </Box>
      <Box w="50%" p={3} bg="blue.100" borderRadius="md" mb={3} ml="auto">
        <Text><strong>Priyanka:</strong> That sounds interesting! What kind of project?</Text>
      </Box>

      <Box position="fixed" bottom="0" w={{ base: "50%", md: "50%" }} p={3} bg="white" borderTop="1px solid #E0E0E0" ml="0" display="flex" alignItems="center">
        <Input
          variant="filled"
          bg="#E0E0E0"
          placeholder="Enter a message.."
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
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
      {/* Add more sample chat messages as needed */}
    </Box>
  );
}

export default Chatbox;
