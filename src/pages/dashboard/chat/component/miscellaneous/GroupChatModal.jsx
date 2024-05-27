import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    FormControl,
    Input,
    useToast,
    Box,
  } from "@chakra-ui/react";
  import { useState } from "react";
  import UserBadgeItem from "../userAvatar/UserBadgeItem";
  import UserListItem from "../userAvatar/UserListItem";
  import { Card,CardHeader,Typography } from '@material-tailwind/react';
  
  const GroupChatModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
  
    const user = {
      _id: "1",
      name: "Rishabh",
      token: "sampleToken",
    };
  
    const [chats, setChats] = useState([]);
    const allUsers = [
      { _id: "2", name: "Priyanka Manwani", email: "priyanka@example.com" },
      { _id: "3", name: "Sajal Sir", email: "sajal@example.com" },
      { _id: "4", name: "Rishabh", email: "piyush@example.com" },
      { _id: "5", name: "correct stpes", email: "CSC@example.com" },
    ];
  
    const handleGroup = (userToAdd) => {
      if (selectedUsers.includes(userToAdd)) {
        toast({
          title: "User already added",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        return;
      }
  
      setSelectedUsers([...selectedUsers, userToAdd]);
    };
  
    const handleSearch = (query) => {
      setSearch(query);
      if (!query) {
        setSearchResult([]);
        return;
      }
  
      setLoading(true);
      setTimeout(() => {
        const results = allUsers.filter((u) =>
          u.name.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResult(results);
        setLoading(false);
      }, 500);
    };
  
    const handleDelete = (delUser) => {
      setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
    };
  
    const handleSubmit = () => {
      if (!groupChatName || !selectedUsers.length) {
        toast({
          title: "Please fill all the fields",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        return;
      }
  
      const newGroupChat = {
        _id: `${chats.length + 1}`,
        chatName: groupChatName,
        isGroupChat: true,
        users: selectedUsers,
        latestMessage: {
          sender: user,
          content: "New group chat created!",
        },
      };
  
      setChats([newGroupChat, ...chats]);
      onClose();
      toast({
        title: "New Group Chat Created!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    };
  
    return (
      <>
        <span onClick={onOpen}>{children}</span>
  
        <Modal onClose={onClose} isOpen={isOpen} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader
              fontSize="35px"
              fontFamily="Work sans"
              display="flex"
              justifyContent="center"
            >
               <Typography variant="large" color="blue-gray" className="font-bold">
             Create Group Chat
            </Typography>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody display="flex" flexDirection="column" alignItems="center">
              <FormControl>
                <Input
                  placeholder="Chat Name"
                  mb={3}
                  onChange={(e) => setGroupChatName(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <Input
                  placeholder="Add Users eg: John, Piyush, Jane"
                  mb={1}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </FormControl>
              <Box width="100%" display="flex" flexWrap="wrap">
                {selectedUsers.map((u) => (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleDelete(u)}
                  />
                ))}
              </Box>
              {loading ? (
                <div>Loading...</div>
              ) : (
                searchResult
                  .slice(0, 4)
                  .map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => handleGroup(user)}
                    />
                  ))
              )}
            </ModalBody>
            <ModalFooter>
              <Button onClick={handleSubmit} colorScheme="blue">
                Create Chat
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  };
  
  export default GroupChatModal;
  