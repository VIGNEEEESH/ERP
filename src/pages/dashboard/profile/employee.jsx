import React, { useContext, useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  CardFooter,
  Avatar,
  Typography,
  Tabs,
  TabsHeader,
  Tab,
  Tooltip,
  Button,
  Input,
} from "@material-tailwind/react";
import {
  HomeIcon,
  ChatBubbleLeftEllipsisIcon,
  Cog6ToothIcon,
  PencilIcon,
} from "@heroicons/react/24/solid";
import { AuthContext } from '@/pages/auth/Auth-context';
import { message } from 'antd';

export function Employee() {
  const initialProfile = {
    firstName: 'Richard',
    lastName: 'Davis',
    email: 'richard.davis@example.com',
    password: '********',
    role: 'CEO / Co-Founder',
    address: '123 Main St',
    pincode: '12345',
    state: 'California',
    country: 'USA',
    image: '/img/bruce-mars.jpeg',
    offerLetter: null,
    salary: '150,000',
    pan: 'ABCDE1234F',
    aadhar: '1234 5678 9012',
  };

  const [formData,setFormData]=useState({
    firstName:"",
    lastName:"",
    role:"",
    address:"",
    state:"",
    pincode:"",
    country:"",
    salary:"",
    pan:"",
    aadhar:""
  })
  const [isEditing, setIsEditing] = useState(false);
  const [userprofile, setProfile] = useState(initialProfile);
const auth=useContext(AuthContext)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
   handleProfileUpdate()
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setProfile(initialProfile); // Reset to initial userprofile data
  };
  
  useEffect(() => {
      const fetchUser = async () => {
        try {
          const response = await fetch(
            `${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/user/get/user/byid/${auth.userId}`,
            {
              headers:{
                Authorization: "Bearer " + auth.token, 
              }
            }
          );
  
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
  
          const data = await response.json();
          
          setFormData(data.user);
          
        } catch (err) {
          message.error("Error fetching clients:", err.message);
        }
      };
      fetchUser();
    }, []);
    // const handleProfileUpdate=async()=>{
    //   try{
        
    //     const response=await fetch(import.meta.env.REACT_APP_BACKEND_URL+`/api/erp/user/update/user/byid/${auth.userId}`,
    //     {
    //       method:"PATCH",
    //       headers:{"Content-Type":"application/json"},
    //       body:JSON.stringify(formData)})
    //       if(!response.ok){
    //         return error(`Http error: `,response.message)
    //       }
    //       message.success("Profile updated successfully")
    //       setTimeout(()=>{
    // window.location.reload()
    //       },[300]
    
    //       )
    //   }catch(err){
    //     message.error("Something went wrong, please try again")
    //   }
    // }
  

  return (
    <>
      <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url('/img/background-image.png')] bg-cover bg-center">
        <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
      </div>
      <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100">
        <CardBody className="p-4 space-y-6">
          <div className="flex items-start justify-start gap-6">
            <Avatar
              src={`${import.meta.env.REACT_APP_BACKEND_URL}/${formData.image}`}
              alt="Profile Picture"
              size="xxl"
              variant="rounded"
              className="rounded-lg shadow-lg shadow-blue-gray-500/40"
            />
            <div className="flex flex-col space-y-4 ml-8">
              <Typography variant="h5" color="blue-gray" className="mb-4 mt-2 gap-4">
                {isEditing ? (
                  <>
                    <Input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      label="First Name"
                      className="border-b border-blue-gray-500 focus:border-blue-600 mr-4"
                    />
                    <div className='mb-4'></div>
                    <Input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      label="Last Name"
                      className="border-b border-blue-gray-500 focus:border-blue-600"
                    />
                  </>
                ) : (
                  `${formData.firstName} ${formData.lastName}`
                )}
              </Typography>
              <Typography variant="small" className="font-normal text-blue-gray-600">
                {isEditing ? (
                  <Input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    label="Role"
                    className="border-b border-blue-gray-500 focus:border-blue-600"
                  />
                ) : (
                  formData.role
                )}
              </Typography>
              <Typography variant="small" className="font-normal text-blue-gray-600">
                {isEditing ? (
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    label="Email"
                    className="border-b border-blue-gray-500 focus:border-blue-600"
                  />
                ) : (
                  formData.email
                )}
              </Typography>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-4">
              <Typography variant="small" className="font-normal text-blue-gray-600">
                {isEditing ? (
                  <Input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    label="Address"
                    className="border-b border-blue-gray-500 focus:border-blue-600"
                  />
                ) : (
                  formData.address
                )}
              </Typography>
              <Typography variant="small" className="font-normal text-blue-gray-600">
                {isEditing ? (
                  <Input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    label="Pincode"
                    className="border-b border-blue-gray-500 focus:border-blue-600"
                  />
                ) : (
                  formData.pincode
                )}
              </Typography>
              <Typography variant="small" className="font-normal text-blue-gray-600">
                {isEditing ? (
                  <Input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    label="State"
                    className="border-b border-blue-gray-500 focus:border-blue-600"
                  />
                ) : (
                  formData.state
                )}
              </Typography>
              <Typography variant="small" className="font-normal text-blue-gray-600">
              {isEditing ? (
                <Input
                  type="text"
                  name="aadhar"
                  value={formData.aadhar}
                  onChange={handleInputChange}
                  label="Aadhar"
                  className="border-b border-blue-gray-500 focus:border-blue-600"
                />
              ) : (
                `Aadhar: ${formData.aadhar}`
              )}
            </Typography>
            </div>
            <div className="flex flex-col space-y-4">
              <Typography variant="small" className="font-normal text-blue-gray-600">
                {isEditing ? (
                  <Input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    label="Country"
                    className="border-b border-blue-gray-500 focus:border-blue-600"
                  />
                ) : (
                  formData.country
                )}
              </Typography>
              <Typography variant="small" className="font-normal text-blue-gray-600">
                {isEditing ? (
                  <Input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    disabled
                    onChange={handleInputChange}
                    label="Salary"
                    className="border-b border-blue-gray-500 focus:border-blue-600"
                  />
                ) : (
                  `Salary: ${formData.salary}`
                )}
              </Typography>
              <Typography variant="small" className="font-normal text-blue-gray-600">
                {isEditing ? (
                  <Input
                    type="text"
                    name="pan"
                    value={formData.pan}
                    onChange={handleInputChange}
                    label="PAN"
                    className="border-b border-blue-gray-500 focus:border-blue-600"
                  />
                ) : (
                  `PAN: ${formData.pan}`
                )}
              </Typography>
              <Typography variant="small" className="font-normal text-blue-gray-600">
              {isEditing ? (
                <Input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  label="Mobile"
                  className="border-b border-blue-gray-500 focus:border-blue-600"
                />
              ) : (
                `Mobile: ${formData.mobile}`
              )}
            </Typography>
            
            </div>
          </div>
          <div className="flex flex-col space-y-4">
            
            
          </div>
          
            
          
          {/* <CardFooter className="flex justify-end p-4">
            {isEditing ? (
              <>
                <Button  onClick={handleSaveClick}>
                  Save
                </Button>
                <Button variant="outlined" onClick={handleCancelClick} className="ml-2">
                  Cancel
                </Button>
              </>
            ) : (
              <Tooltip content="Edit Profile">
                <PencilIcon
                  className="h-4 w-4 cursor-pointer text-blue-gray-500"
                  onClick={handleEditClick}
                />
              </Tooltip>
            )}
          </CardFooter> */}
        </CardBody>
      </Card>
    </>
  );
}

export default Employee;
