import React, { useState } from 'react';
import { Box, Text, IconButton } from "@chakra-ui/react";
import { Input } from "@chakra-ui/input";
import Picker from 'emoji-picker-react';
import { FaSmile } from 'react-icons/fa';


import "./styles.css";
import SingleChat from "./SingleChat";
import { ChatState } from './miscellaneous/ChatProvider';


const Chatbox = ({ fetchAgain, setFetchAgain }) => {
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
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default Chatbox;