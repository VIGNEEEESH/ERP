import React, { useState } from "react";
import { Box, Text, Button, Avatar, Tooltip, useToast } from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/react";
import ProfileModal from "./ProfileModal"; // Ensure this component is defined and imported correctly
import ChatLoading from "../ChatLoading";
import UserListItem from "../userAvatar/UserListItem";
import { Card,CardHeader,Typography } from '@material-tailwind/react';

const Input = ({ placeholder, value, onChange, mr }) => (
  <input
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    style={{ marginRight: mr }}
  />
);

const Sidebar = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  const user = { name: "Rishabh", token: "sampleToken" }; // Sample user data
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleSearch = () => {
    try {
      setLoading(true);

      // Sample data to simulate API response
      const data = [
        {
          id: 1,
          name: "Rishabh",
          email: "rishabh@example.com",
          pic: "https://i.redd.it/5v5ofi4qa3991.jpg"
        },
        {
          id: 2,
          name: "John Doe",
          email: "john@example.com",
          pic: "https://imgix.bustle.com/uploads/image/2018/1/27/9cc74bec-c54e-412d-8a35-2a20b7dda25e-bitmoji-deluxe-starts-with-a-selfie.jpg?w=374&h=377&fit=crop&crop=faces&q=50&dpr=2"
        },
        {
          id: 3,
          name: "Jane Smith",
          email: "jane@example.com",
          pic: "https://i.pinimg.com/474x/74/e8/20/74e820145614c8565628d08d22822478.jpg"
        }
      ];

      setTimeout(() => {
        setLoading(false);
        setSearchResult(data.filter(user => user.name.toLowerCase().includes(search.toLowerCase())));
      }, 1000);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = (userId) => {
    console.log(userId);

    try {
      setLoadingChat(true);

      // Sample data to simulate API response
      const data = {
        _id: userId,
        users: [
          { id: 1, name: "Rishabh" },
          { id: 2, name: "John Doe" },
          { id: 3, name: "Jane Smith" }
        ]
      };

      setTimeout(() => {
        setLoadingChat(false);
        if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
        setSelectedChat(data);
        onClose();
      }, 1000);
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="#beige"
        width="100%"
        padding="5px 10px"
        borderWidth="5px"
        
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end" >
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Typography variant="small" color="blue-gray" className="font-semibold">
              Search User
            </Typography>
          </Button>
        </Tooltip>
        <Typography variant="small" color="blue-gray" className="font-semibold">
              Correct Step Consultancy
            </Typography>
        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
          </Menu>
          <Menu>
            <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src="https://cdn.britannica.com/72/232772-050-4E3D86CC/mind-blown-emoji-head-exploding-emoticon.jpg"
              />
            </MenuButton>
            <MenuList>
              <ProfileModal>
                <MenuItem> <Typography variant="small" color="blue-gray" className="font-semibold">
            My Profile
            </Typography></MenuItem>
              </ProfileModal>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px"> <Typography variant="small" color="blue-gray" className="font-semibold">
              Search Users
            </Typography></DrawerHeader>
          <DrawerBody>
            <Box d="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}> <Typography variant="small" color="blue-gray" className="font-semibold">
             Go
            </Typography></Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult.map((user, index) => (
                <UserListItem
                  key={index}
                  user={user}
                  handleFunction={() => accessChat(user.id)}
                />
              ))
            )}
            {loadingChat && <div>Loading chat...</div>}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Sidebar;
