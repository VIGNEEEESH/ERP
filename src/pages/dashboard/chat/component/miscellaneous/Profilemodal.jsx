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
  IconButton,
  Text,
  Image,
} from "@chakra-ui/react";
import { Card,CardHeader,Typography } from '@material-tailwind/react';

const Profilemodal = ({ user = {}, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Debugging statement to check user object
  console.log("User object:", user);

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      )}
      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent h="auto" maxW="400px">
          <ModalHeader fontSize="2xl" textAlign="center">
            {user.name || <Typography variant="large" color="blue-gray" className="font-bold">
           User Name
            </Typography>}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody textAlign="center">
            <Image
              borderRadius="full"
              boxSize="150px"
              src={user.pic || "https://via.placeholder.com/150"}
              alt={user.name || "User"}
              mb={4}
              ml={20}
              alignSelf="center" // Align the image horizontally
              justifySelf="center" // Align the image vertically
            />
            <Text fontSize="lg" fontFamily="Work Sans" mb={4}>
             <Typography variant="large" color="blue-gray" className="font-bold">
            Email
            </Typography>{user.email || <Typography variant="small" color="gray" className="font-bold">
             User@gmail.com
            </Typography>}
            </Text>
          </ModalBody>
          <ModalFooter justifyContent="center">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Profilemodal;
