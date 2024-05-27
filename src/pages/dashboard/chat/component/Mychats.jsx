import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text, Button, Heading } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/toast";
import { useEffect, useState } from "react";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { Card,CardHeader,Typography } from '@material-tailwind/react';

const Mychat = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState({
    _id: "3",  // Assuming logged user's ID
    name: "Rishabh",
    email: "rishabh@example.com",
    pic: "https://cdn.britannica.com/72/232772-050-4E3D86CC/mind-blown-emoji-head-exploding-emoticon.jpg",
  });
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);

  const toast = useToast();

  const getSender = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
  };

  const fetchChats = () => {
    try {
      // Sample data to simulate chat data
      const data = [
        {
          _id: "1",
          chatName: "Chat 1",
          isGroupChat: false,
          users: [
            { _id: "2", name: "Priyanka", email: "john@example.com" },
            { _id: "3", name: "Rishabh", email: "rishabh@example.com" },
          ],
          latestMessage: {
            sender: { name: "Rishabh Sharma" },
            content: "Hello, how are you?",
          },
        },
        {
          _id: "2",
          chatName: "Tech Team",
          isGroupChat: true,
          users: [
            { _id: "2", name: "John Doe", email: "john@example.com" },
            { _id: "3", name: "Rishabh", email: "rishabh@example.com" },
          ],
          latestMessage: {
            sender: { name: "Priyanka" },
            content: "Let's keep a meet at 5.",
          },
        },
        {
          _id: "3",
          chatName: "CSC DEVELOPERS",
          isGroupChat: true,
          users: [
            { _id: "2", name: "John Doe", email: "john@example.com" },
            { _id: "3", name: "Rishabh", email: "rishabh@example.com" },
          ],
          latestMessage: {
            sender: { name: "Sajal Sir" },
            content: "Hello everyone.",
          },
        },
      ];
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    fetchChats();
  }, [fetchAgain]);

  // Divide chats into direct and group chats
  const directChats = chats.filter(chat => !chat.isGroupChat);
  const groupChats = chats.filter(chat => chat.isGroupChat);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDirection="column"
      alignItems="center"
      p={3}
      bg="white"
      width={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        width="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="large" color="blue-gray" className="font-semibold">
              My Chats
            </Typography>
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
             <Typography variant="large" color="blue-gray" className="font-semibold">
              New Group Chats
            </Typography>
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        p={3}
        bg="#F8F8F8"
        width="100%"
        height="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats.length > 0 ? (
          <Stack overflowY="scroll">
            {directChats.length > 0 && (
              <>
                 <Typography variant="large" color="blue-gray" className="font-bold">
             #DIRECT CHATS
            </Typography>
                {directChats.map((chat) => (
                  <Box
                    key={chat._id}
                    onClick={() => setSelectedChat(chat)}
                    cursor="pointer"
                    bg={selectedChat === chat ? "#000000" : "#E8E8E8"}
                    color={selectedChat === chat ? "white" : "black"}
                    px={3}
                    py={2}
                    borderRadius="lg"
                  >
                    <Text>
                      {getSender(loggedUser, chat.users)}
                    </Text>
                    {chat.latestMessage && (
                      <Text fontSize="xs">
                        <b>{chat.latestMessage.sender.name} : </b>
                        {chat.latestMessage.content.length > 50
                          ? chat.latestMessage.content.substring(0, 51) + "..."
                          : chat.latestMessage.content}
                      </Text>
                    )}
                  </Box>
                ))}
              </>
            )}
            {groupChats.length > 0 && (
              <>
                 <Typography variant="large" color="blue-gray" className="font-bold">
              #GROUP CHATS
            </Typography>
                {groupChats.map((chat) => (
                  <Box
                    key={chat._id}
                    onClick={() => setSelectedChat(chat)}
                    cursor="pointer"
                    bg={selectedChat === chat ? "#000000" : "#E8E8E8"}
                    color={selectedChat === chat ? "white" : "black"}
                    px={3}
                    py={2}
                    borderRadius="lg"
                  >
                    <Text>
                      {chat.chatName}
                    </Text>
                    {chat.latestMessage && (
                      <Text fontSize="xs">
                        <b>{chat.latestMessage.sender.name} : </b>
                        {chat.latestMessage.content.length > 50
                          ? chat.latestMessage.content.substring(0, 51) + "..."
                          : chat.latestMessage.content}
                      </Text>
                    )}
                  </Box>
                ))}
              </>
            )}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default Mychat;
