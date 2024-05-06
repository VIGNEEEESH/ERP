import React, { useContext, useState } from 'react';
import { Card, CardHeader, CardBody, Typography,Input,Textarea,Button } from "@material-tailwind/react";
import { message } from 'antd';
import { AuthContext } from '../auth/Auth-context';

const LeaveForm = () => {
  const auth=useContext(AuthContext)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: auth.email,
    reason: '',
    startDate: '',
    endDate: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
      const response=await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/leave/create/leave`,
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          Authorization: "Bearer " + auth.token,
        },
        body:JSON.stringify(formData)
      })
      if(!response.ok){
        throw new Error("Network response was not ok")
      }
      message.success("Your request is received, please be patient while the we revert back to you ")
      setTimeout(()=>{
        window.location.reload()
      },[500])
    }catch(err){
message.error("Error sending request, please try again")
    }
    
  };

  return (
    <div className="mt-12 mb-8">
      <Card>
        <CardHeader variant="gradient" color="gray" className=" p-6 flex items-center justify-between">
          <Typography variant="h6" color="white">
            Leave Request
          </Typography>
        </CardHeader>
        <CardBody className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  label='First Name'
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <Input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  label='last Name'
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
             
              <div>
                <Textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                  label='reason for Leave'
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <Input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  label='Start Date'
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <Input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  label='End Date'
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <Button
              type="submit" className='mt-4'>
              
              Submit
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default LeaveForm;