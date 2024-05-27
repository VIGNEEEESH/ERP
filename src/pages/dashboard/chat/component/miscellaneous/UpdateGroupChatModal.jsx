import { ViewIcon } from "@chakra-ui/icons";
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
  IconButton,
  Spinner,
} from "@chakra-ui/react";
import { useState } from "react";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";

const UpdateGroupChatModal = ({ selectedChat, setSelectedChat, fetchAgain, setFetchAgain }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState(selectedChat.chatName);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const toast = useToast();

  const user = {
    _id: "1",
    name: "Rishabh",
    token: "sampleToken",
  };

  const allUsers = [
    { _id: "2", name: "Priyanka Manwani", email: "priyanka@example.com" },
    { _id: "3", name: "Sajal Sir", email: "sajal@example.com" },
    { _id: "4", name: "Rishabh", email: "piyush@example.com" },
    { _id: "5", name: "correct stpes", email: "CSC@example.com" },
  ];

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

  const handleRename = () => {
    if (!groupChatName) return;

    setRenameLoading(true);
    setTimeout(() => {
      const updatedChat = { ...selectedChat, chatName: groupChatName };
      setSelectedChat(updatedChat);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
      toast({
        title: "Group Name Updated!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }, 1000);
  };

  const handleAddUser = (userToAdd) => {
    if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
      toast({
        title: "User Already in group!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    const updatedChat = { ...selectedChat, users: [...selectedChat.users, userToAdd] };
    setSelectedChat(updatedChat);
    setFetchAgain(!fetchAgain);
    toast({
      title: "User Added!",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
  };

  const handleRemove = (userToRemove) => {
    if (selectedChat.groupAdmin._id !== user._id && userToRemove._id !== user._id) {
      toast({
        title: "Only admins can remove someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    const updatedChat = {
      ...selectedChat,
      users: selectedChat.users.filter((u) => u._id !== userToRemove._id),
    };
    setSelectedChat(updatedChat);
    setFetchAgain(!fetchAgain);
    toast({
      title: userToRemove._id === user._id ? "You Left the Group" : "User Removed!",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
  };

  return (
    <>
      <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>

          <ModalCloseButton />
          <ModalBody d="flex" flexDir="column" alignItems="center">
            <Box w="100%" d="flex" flexWrap="wrap" pb={3}>
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  admin={selectedChat.groupAdmin}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl d="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameloading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => handleRemove(user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;