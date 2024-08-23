import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text, Button, Avatar, Flex } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/toast";
import { useContext, useEffect, useState } from "react";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { AuthContext } from "@/pages/auth/Auth-context";
import { ChatState } from "./miscellaneous/ChatProvider";
import { FaUsers, FaUser } from "react-icons/fa"; // Importing group and user icons
import { getSender, getSenderFull } from "./ChatLogic";
import { io } from "socket.io-client";

var socket, selectedChatCompare;

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState([]);
  const auth = useContext(AuthContext);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
   const [socketConnected, setSocketConnected] = useState(false);

  const { selectedChat, setSelectedChat, user, chats = [], setChats } = ChatState(); // Initialize chats to an empty array
  const toast = useToast();

 useEffect(() => {
    socket = io(import.meta.env.REACT_APP_BACKEND_URL);
    socket.emit("setup", user);

    socket.on("connected", () => setSocketConnected(true));
    
    socket.on("typing", () => {
        console.log("User is typing...");
        setIsTyping(true);
    });

    socket.on("stop typing", () => {
        console.log("User stopped typing");
        setIsTyping(false);
    });

    socket.on("online users", (users) => setOnlineUsers(users));

    return () => {
        socket.off("typing");
        socket.off("stop typing");
    };
}, [user]);


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
        pic:
          `${import.meta.env.REACT_APP_BACKEND_URL}/${data.user.image}` ||
          "https://cdn.britannica.com/72/232772-050-4E3D86CC/mind-blown-emoji-head-exploding-emoticon.jpg",
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

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    const timerLength = 3000;

    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const fetchChats = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/chat/get/chat/${auth.userId}`,
        {
          headers: {
            Authorization: "Bearer " + auth.token,
          },
        }
      );
      const data = await response.json();
      setChats(data.chats);
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
    fetchUserDetails();
  }, [fetchAgain]);

  const groupChats = chats.filter((chat) => chat.isGroupChat);
  const singleChats = chats.filter((chat) => !chat.isGroupChat);

  const GroupAvatar = ({ groupName }) => {
    const initials = groupName
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase();

    return (
      <Avatar name={initials} size="xs" mr={2} />
    );
  };

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      h={{ base: "75vh", md: "80vh" }}
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text
          fontSize={{ base: "20px", md: "20px" }}
          fontFamily="sans-serif"
          fontWeight="bold"
          ml={2}
        >
          MY CHATS
        </Text>
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            <Text
              fontSize={{ base: "17px", md: "10px", lg: "17px" }}
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              New Group
            </Text>
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats.length ? (
          <Stack overflowY="scroll">
            <h1 className="font-bold">
              <div className="flex items-center">
                <FaUsers className="mr-2" /> {/* Adding the icon with margin-right */}
                <Text
                  fontSize="sm"
                  color="blue-gray"
                  fontWeight="bold"
                  className="opacity-60 transition-all hover:text-blue-500 hover:opacity-100"
                  fontFamily="sans-serif"
                >
                  Groups
                </Text>
              </div>
            </h1>
            {groupChats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "rgb(56, 59, 56)" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Flex align="center">
                  <GroupAvatar groupName={chat.chatName} />
                  <Text fontFamily="sans-serif">{chat.chatName}</Text>
                </Flex>
                {chat.latestMessage && (
                  <Text fontSize="xs" fontFamily="sans-serif">
                    <b>
                      {chat.latestMessage.sender._id === loggedUser._id
                        ? "You"
                        : chat.latestMessage.sender.firstName +
                          " " +
                          chat.latestMessage.sender.lastName}
                      :{" "}
                    </b>
                    {selectedChat === chat && istyping
                      ? "typing..."
                      : chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
            <h1 className="font-bold">
              <div className="font-bold flex items-center">
                <FaUser className="mr-2" /> {/* Profile icon with margin-right */}
                <Text
                  fontSize="sm"
                  color="blue-gray"
                  fontFamily="sans-serif"
                  fontWeight="bold"
                  className="opacity-60 transition-all hover:text-blue-500 hover:opacity-100"
                >
                  Direct Message
                </Text>
              </div>
            </h1>
            {singleChats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "rgb(56, 59, 56)" : "rgb(232, 232, 232)"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Flex align="center">
                  <Avatar
                    size="xs"
                    name={getSender(loggedUser, chat.users)} // Use getSender to get the name for the Avatar
                    src={getSenderFull(loggedUser, chat.users)?.pic} // Use getSenderFull to get the pic for the Avatar
                    mr={2}
                  />
                  <Text fontFamily="sans-serif">{getSender(loggedUser, chat.users)}</Text>
                </Flex>
                {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>
                      {chat.latestMessage.sender._id === loggedUser._id
                        ? "You"
                        : chat.latestMessage.sender.firstName +
                          " " +
                          chat.latestMessage.sender.lastName}
                      :{" "}
                    </b>
                    {selectedChat === chat && istyping
                      ? "typing..."
                      : chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
