import React, { useState } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalFooter, ModalBody, ModalCloseButton, Button, Input, Box, Text, Image
} from "@chakra-ui/react";

const FileUploadModal = ({ isOpen, onClose, onFileUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    if (file) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview({ type: "image", content: reader.result });
        };
        reader.readAsDataURL(file);
      } else if (file.type.startsWith("video/")) {
        const url = URL.createObjectURL(file);
        setPreview({ type: "video", content: url });
      } else {
        setPreview({ type: "file", content: file.name });
      }
    } else {
      setPreview(null);
    }
  };

  const handleFileUpload = () => {
    if (selectedFile) {
      onFileUpload(selectedFile, preview);
      setSelectedFile(null);
      setPreview(null);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Upload File</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input type="file" onChange={handleFileChange} />
          {selectedFile && (
            <Box mt={3}>
              <Text>Selected file: {selectedFile.name}</Text>
              {preview && preview.type === "image" && (
                <Image src={preview.content} alt="Preview" mt={2} />
              )}
              {preview && preview.type === "video" && (
                <Box mt={2}>
                  <video width="100%" controls>
                    <source src={preview.content} type={selectedFile.type} />
                    Your browser does not support the video tag.
                  </video>
                </Box>
              )}
              {preview && preview.type === "file" && (
                <Text mt={2}>File preview is not available</Text>
              )}
            </Box>
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleFileUpload}>
            Upload
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FileUploadModal;
