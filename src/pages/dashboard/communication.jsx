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

const CommunicationComponent = () => {
  const [communicationStatus, setCommunicationStatus] = useState(false);

  const handleCommunicationClick = () => {
    // Toggle communication status
    setCommunicationStatus(!communicationStatus);
  };

  return (
    <Card className="border border-blue-gray-100 shadow-sm">
      <CardHeader
        floated={false}
        shadow={false}
        color="transparent"
        className="m-0 flex items-center justify-between p-6"
      >
        <div>
          <Typography variant="h6" color="blue-gray" className="mb-1">
            Communication
          </Typography>
          <Typography
            variant="small"
            className="flex items-center gap-1 font-normal text-blue-gray-600"
          >
            <CheckCircleIcon strokeWidth={3} className="h-4 w-4 text-blue-gray-200" />
            <strong>{communicationStatus ? "Active" : "Inactive"}</strong>
          </Typography>
        </div>
        <Menu placement="left-start">
          <MenuHandler>
            <IconButton size="sm" variant="text" color="blue-gray">
              <EllipsisVerticalIcon
                strokeWidth={3}
                fill="currentColor"
                className="h-6 w-6"
              />
            </IconButton>
          </MenuHandler>
          <MenuList>
            <MenuItem onClick={handleCommunicationClick}>
              {communicationStatus ? "Deactivate" : "Activate"} Communication
            </MenuItem>
          </MenuList>
        </Menu>
      </CardHeader>
      <CardBody className="p-0">
        <div className="p-4">
          <Typography variant="body" color="blue-gray">
            This is the communication component. When you click the button below, the communication status will toggle.
          </Typography>
        </div>
      </CardBody>
    </Card>
  );
};

export default CommunicationComponent;
