import { AuthContext } from "@/pages/auth/Auth-context";
import {
  Card,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import { Button, message } from "antd";
import { useContext, useEffect, useState } from "react";

export function WorkStatus() {
  const [attendance,setAttendance]=useState([])
  const auth=useContext(AuthContext)
  const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];
    const [formData,setFormData]=useState({
      userId:"",
      date:"",
      workStatus:"Available"
    })
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({
          ...formData,
          [name]: value,
      });
  };
  useEffect(() => {
    const fetchAttendance = async () => {
        try {
            // Fetch attendance data
            
            const attendanceResponse = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/attendance/get/attendance/bydateanduserid/${formattedDate}/${auth.userId}`,{headers:{Authorization:"Bearer "+auth.token}});
            if (!attendanceResponse.ok) {
                throw new Error(`Failed to fetch attendance data: ${attendanceResponse.status}`);
            }
            const attendanceData = await attendanceResponse.json();
            setAttendance(attendanceData.attendance);
            
        } catch (error) {
            message.warning("Please clock in to get work status ", error.message);
        }
    };

    fetchAttendance();
}, []);
const handleWorkStatus=async()=>{
  try{
    formData.date=formattedDate
            formData.userId=auth.userId
            
    const response=await fetch(import.meta.env.REACT_APP_BACKEND_URL+`/api/erp/attendance/update/workstatus`,
    {
      method:"PATCH",
      headers:{"Content-Type":"application/json",Authorization: "Bearer " + auth.token,},
      body:JSON.stringify(formData)})
      if(!response.ok){
        return error(`Http error: `,response.message)
      }
      message.success("Status updated successfully")
      setTimeout(()=>{
window.location.reload()
      },[300]

      )
  }catch(err){
    message.error("Something went wrong, please try again")
  }
}
  return (
    <div className="mt-12 mb-8">
      <Card>
      <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex justify-between items-center">
  <div>
    <Typography variant="h6" color="white">
      My Work Status
    </Typography>
  </div>
  <div>
    <Typography variant="h6" color="white">
      {attendance.workStatus}
    </Typography>
  </div>
</CardHeader>

        <div className="p-6">
          <div className="relative">
            <select name="workStatus" onChange={handleInputChange} className="block w-full p-3 border rounded-md bg-white focus:outline-none focus:ring focus:border-blue-300">
              <option value="Available">Available</option>
              <option value="In a Meeting">In a Meeting</option>
              <option value="Busy in Work">Busy in Work</option>
            </select>
            <span className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              
            </span><br/>
           <center> <Button onClick={handleWorkStatus}>save</Button></center>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default WorkStatus;
