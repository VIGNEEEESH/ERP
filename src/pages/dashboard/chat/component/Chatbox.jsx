import React from 'react';
import { Box } from "@chakra-ui/react";
import SingleChat from "./SingleChat";
import { ChatState } from './miscellaneous/ChatProvider';

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
   <Box
  display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
  flexDir="column"
  p={3}
  bg="white"
  w={{ base: "100%", md: "68%" }}
  h={{ base: "75vh", md: "80vh" }} // Adjust height for mobile
  borderRadius="lg"
  borderWidth="1px"
  overflow={{ base: "hidden", md: "auto" }} // Hide scrollbar on mobile
  fontFamily="sans-serif" // Apply sans-serif font
>
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default Chatbox;
