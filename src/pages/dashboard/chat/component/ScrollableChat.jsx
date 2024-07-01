import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import { Box, Image, Text, Button } from "@chakra-ui/react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from '../../../../configs/ChatLogics';
import { FaFilePdf, FaFileExcel, FaFileWord, FaFileArchive, FaFileAlt } from 'react-icons/fa';
import { ChatState } from "./miscellaneous/ChatProvider";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  const getFileIcon = (fileName) => {
    if (!fileName) {
      return <FaFileAlt size={30} />; // Default icon for undefined file names
    }

    const ext = fileName.split('.').pop().toLowerCase();
    switch (ext) {
      case 'pdf':
        return <FaFilePdf size={30} />;
      case 'xls':
      case 'xlsx':
        return <FaFileExcel size={30} />;
      case 'doc':
      case 'docx':
        return <FaFileWord size={30} />;
      case 'zip':
      case 'rar':
        return <FaFileArchive size={30} />;
      default:
        return <FaFileAlt size={30} />;
    }
  };

  const downloadFile = async (fileUrl, fileName) => {
    const link = document.createElement("a");
    link.href = `${import.meta.env.REACT_APP_BACKEND_URL}/${fileUrl}`;
    link.download = fileName || "downloaded_file";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Redirect logic after initiating download
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay for 1 second (adjust as needed)
    window.location.href = "/redirect-page"; // Replace with your desired redirect URL
  };

  return (
    <ScrollableFeed>
      {messages &&  
        messages.map((m, i) => (
          <div style={{ display: "flex", flexDirection: "column" }} key={m._id}>
            <div style={{ display: "flex" }}>
              {(isSameSender(messages, m, i, user._id) ||
                isLastMessage(messages, i, user._id)) && (
                <Tooltip label={m.sender.firstName + " " + m.sender.lastName} placement="bottom-start" hasArrow>
                  <Avatar
                    mt="7px"
                    mr={1}
                    size="sm"
                    cursor="pointer"
                    name={m.sender.firstName + " " + m.sender.lastName}
                    src={`${import.meta.env.REACT_APP_BACKEND_URL}/${m.sender.pic}`}
                  />
                </Tooltip>
              )}
              {m.content && (
                
                <span
                style={{
                  backgroundColor: `${
                    m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                  }`,
                  marginLeft: isSameSenderMargin(messages, m, i, user._id),
                  marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                  borderRadius: "20px",
                  padding: "5px 15px",
                  maxWidth: "75%",
                  display: "flex",
                  flexDirection: "column", // Ensure items stack vertically
                  alignItems: "flex-start", // Align items to the start of the container
                }}
              >
                {m.content && (
                  <span style={{ flex: 1 }}>{m.content}</span>
                )}
              
                {m.fileUrl && (
                  <div style={{ marginTop: 5 }}> {/* Adjust margin as needed */}
                    <Box display="flex" alignItems="center">
                      {getFileIcon(m.fileName)}
                      <Text ml={2}>{m.fileName}</Text>
                      <Button ml={2} size="sm" colorScheme="blue" onClick={() => downloadFile(m.fileUrl, m.fileName)}>
                        Download
                      </Button>
                    </Box>
                  </div>
                )}
              </span>
              
              
              )}
            </div>
            {/* {m.fileUrl && (
              <Box mt={2} ml={isSameSenderMargin(messages, m, i, user._id)} maxWidth="75%">
                
                {m.fileType.startsWith("image/") && (
                  
                  <Image src={`${import.meta.env.REACT_APP_BACKEND_URL}/${m.fileUrl}`} alt="Image Preview" maxHeight="200px" maxWidth="200px" />
                )}
                {m.fileType.startsWith("video/") && (
                  <Box maxWidth="200px">
                    <video width="100%" height="200px" controls>
                      <source src={`${import.meta.env.REACT_APP_BACKEND_URL}/${m.fileUrl}`} type={m.fileType} />
                      Your browser does not support the video tag.
                    </video>
                  </Box>
                )}
                {m.fileType === "application/pdf" && (
                  <Box display="flex" alignItems="center">
                    <FaFilePdf size={30} />
                    <Text ml={2}>{m.fileName}</Text>
                    <Button ml={2} size="sm" colorScheme="blue" onClick={() => downloadFile(m.fileUrl, m.fileName)}>
                      Download
                    </Button>
                  </Box>
                )}
                {m.fileType === "application/vnd.ms-excel" || m.fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" && (
                  <Box display="flex" alignItems="center">
                    <FaFileExcel size={30} />
                    <Text ml={2}>{m.fileName}</Text>
                    <Button ml={2} size="sm" colorScheme="blue" onClick={() => downloadFile(m.fileUrl, m.fileName)}>
                      Download
                    </Button>
                  </Box>
                )}
                {m.fileType === "application/msword" || m.fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" && (
                  <Box display="flex" alignItems="center">
                    <FaFileWord size={30} />
                    <Text ml={2}>{m.fileName}</Text>
                    <Button ml={2} size="sm" colorScheme="blue" onClick={() => downloadFile(m.fileUrl, m.fileName)}>
                      Download
                    </Button>
                  </Box>
                )}
                {m.fileType === "application/zip" || m.fileType === "application/x-rar-compressed" && (
                  <Box display="flex" alignItems="center">
                    <FaFileArchive size={30} />
                    <Text ml={2}>{m.fileName}</Text>
                    <Button ml={2} size="sm" colorScheme="blue" onClick={() => downloadFile(m.fileUrl, m.fileName)}>
                      Download
                    </Button>
                  </Box>
                )}
                {m.fileType.startsWith("application/") && !m.fileType.startsWith("image/") && !m.fileType.startsWith("application/pdf")  && !m.fileType.startsWith("video/") && (
                  <Box display="flex" alignItems="center">
                    <FaFileAlt size={30} />
                    <Text ml={2}>{m.fileName}</Text>
                    <Button ml={2} size="sm" colorScheme="blue" onClick={() => downloadFile(m.fileUrl, m.fileName)}>
                      Download
                    </Button>
                  </Box>
                )}
              </Box>
            )} */}
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
