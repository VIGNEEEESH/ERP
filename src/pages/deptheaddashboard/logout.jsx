import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
 
export function Logout() {
  const auth = useContext(AuthContext);
 const  handleLogout=()=>{
    auth.logout()
  }
  return (
    <Card className="mt-6 w-full">
      <CardBody className="flex justify-between items-center">
        <Typography variant="p" color="blue-gray" className="mb-2">
          Do you want to Exit ?
        </Typography>
        <Button onClick={handleLogout} className="bg-red-400">Logout</Button>
      </CardBody>
      {/* <CardFooter className="pt-0">
        <Button>Read More</Button>
      </CardFooter> */}
    </Card>
  );
}
export default Logout;

import React, { useContext } from 'react'
import { AuthContext } from "../auth/Auth-context";
