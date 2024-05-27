import { Box } from "@chakra-ui/layout";
import Chatbox from './component/Chatbox';
import Mychat from './component/Mychats';
import Sidebar from './component/miscellaneous/Sidedrawer';

const Chatpage = () => {
    return (
        <div style={{ width: '100%' }}>
            <Sidebar />
            <Box 
                display="flex" 
                justifyContent="space-between" 
                width="100%" 
                height="91.5vh" 
                padding="10px"  
            >
                <Mychat />
                <Chatbox />
            </Box>
        </div>
    );
};

export default Chatpage;