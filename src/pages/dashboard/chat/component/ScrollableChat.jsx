import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from '../../../../configs/ChatLogics';
import { useState } from "react";
import { ChatState } from "./miscellaneous/ChatProvider";
const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  
  return (
    <ScrollableFeed>
      {messages &&  
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={`${m.sender.firstName} ${m.sender.lastName}`} placement="bottom-start" hasArrow>
                {/* <h1>{m.sender.firstName} </h1> */}
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={`${m.sender.firstName} ${m.sender.lastName}`}
                  src={`${import.meta.env.REACT_APP_BACKEND_URL}/${m.sender.image}`}
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
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;