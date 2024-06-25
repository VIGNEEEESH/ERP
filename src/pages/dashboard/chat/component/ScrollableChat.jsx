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

  const downloadFile = (preview) => {
    const link = document.createElement("a");
    link.href = preview.content;
    link.download = preview.name || "downloaded_file";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex", flexDirection: "column" }} key={m._id}>
            <div style={{ display: "flex" }}>
              {(isSameSender(messages, m, i, user._id) ||
                isLastMessage(messages, i, user._id)) && (
                <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                  <Avatar
                    mt="7px"
                    mr={1}
                    size="sm"
                    cursor="pointer"
                    name={m.sender.name}
                    src={m.sender.pic}
                  />
                </Tooltip>
              )}
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
                }}
              >
                {m.content}
              </span>
            </div>
            {m.preview && (
              <Box mt={2} ml={isSameSenderMargin(messages, m, i, user._id)} maxWidth="75%">
                {m.preview.type === "image" && (
                  <Image src={m.preview.content} alt="Image Preview" maxHeight="200px" maxWidth="200px" />
                )}
                {m.preview.type === "video" && (
                  <Box maxWidth="200px">
                    <video width="100%" height="200px" controls>
                      <source src={m.preview.content} type={m.preview.content.type} />
                      Your browser does not support the video tag.
                    </video>
                  </Box>
                )}
                {m.preview.type === "file" && (
                  <Box display="flex" alignItems="center">
                    {getFileIcon(m.preview.name)}
                    <Text ml={2}>{m.preview.name}</Text>
                  </Box>
                )}
                <Button mt={2} size="sm" colorScheme="blue" onClick={() => downloadFile(m.preview)}>
                  Download
                </Button>
              </Box>
            )}
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
