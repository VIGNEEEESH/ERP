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

const ScrollableChat = () => {
  const user = {
    _id: "1",
    name: "Rishabh",
    pic: "https://via.placeholder.com/150",
  };

  const sampleMessages = [
    { _id: "m1", sender: { _id: "2", name: "Priyanka Manwani", pic: "https://via.placeholder.com/150" }, content: "Hi, how are you?" },
    { _id: "m2", sender: { _id: "3", name: "Sajal Sir", pic: "https://via.placeholder.com/150" }, content: "I am fine, thank you!" },
    { _id: "m3", sender: user, content: "Hello everyone!" },
    { _id: "m4", sender: { _id: "2", name: "Priyanka Manwani", pic: "https://via.placeholder.com/150" }, content: "Nice to meet you!" },
    { _id: "m5", sender: user, content: "How's it going?" },
  ];

  return (
    <ScrollableFeed>
      {sampleMessages &&
        sampleMessages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(sampleMessages, m, i, user._id) ||
              isLastMessage(sampleMessages, i, user._id)) && (
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
                marginLeft: isSameSenderMargin(sampleMessages, m, i, user._id),
                marginTop: isSameUser(sampleMessages, m, i, user._id) ? 3 : 10,
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