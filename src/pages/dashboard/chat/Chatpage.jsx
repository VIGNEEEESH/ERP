import { Box } from "@chakra-ui/layout";



import { useState } from "react";
import SideDrawer from "./component/miscellaneous/Sidedrawer";
import MyChats from "./component/Mychats";
import Chatbox from "./component/Chatbox";
import { ChatState } from "./component/miscellaneous/ChatProvider";


const Chatpage = () => {
    const [fetchAgain, setFetchAgain] = useState(false);
    const { user } = ChatState();
    
    return (
      <div style={{ width: "100%" }}>
        {user && <SideDrawer />}
        <Box display="flex" justifyContent="space-between" w="100%" h="74vh" p="10px">
          {user && <MyChats fetchAgain={fetchAgain} />}
          {user && (
            <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          )}
        </Box>
      </div>
    );
  };


export default Chatpage;
