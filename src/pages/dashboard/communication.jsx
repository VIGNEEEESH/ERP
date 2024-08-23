import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  //Avatar,
  //Tooltip,
  Typography,
} from "@material-tailwind/react";
import {EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import Chatpage from "./chat/Chatpage.jsx";

const CommunicationComponent = () => {
  return (
    <div>
      <Chatpage />
    </div>
  );
};
export default CommunicationComponent;
