import React, { useContext, useState } from 'react';
import {
  Card,
  CardBody,
  Typography,
  Button,
  Input,
} from "@material-tailwind/react";
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import { AuthContext } from '@/pages/auth/Auth-context';
import { message } from 'antd';

function PasswordChange() {
  const auth=useContext(AuthContext)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
const [formData,setFormData]=useState({
  password:"",
  newPassword:"",
  confirmPassword:"",
  userId:auth.userId
})
  const handleTogglePasswordVisibility = (field) => {
    switch (field) {
      case 'current':
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case 'new':
        setShowNewPassword(!showNewPassword);
        break;
      case 'confirm':
        setShowConfirmPassword(!showConfirmPassword);
        break;
      default:
        break;
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    // Update the form data
    setFormData({
      ...formData,
      [name]: value,
    });
  
    // Check if new password and confirm password match
    if (name === 'confirmPassword' && formData.newPassword !== value) {
      setPasswordsMatch(false);
    } else if (name === 'newPassword' && formData.confirmPassword !== value) {
      setPasswordsMatch(false);
    } else if (name === 'confirmPassword' && formData.newPassword === value) {
      setPasswordsMatch(true);
    } else if (name === 'newPassword' && formData.confirmPassword === value) {
      setPasswordsMatch(true);
    }
  };
  
  

  const handleProfileUpdate=async()=>{
    try{
      
      const response=await fetch(import.meta.env.REACT_APP_BACKEND_URL+`/api/erp/user/forgotpassword`,
      {
        method:"PATCH",
        headers:{"Content-Type":"application/json",Authorization: "Bearer " + auth.token,},
        body:JSON.stringify(formData)})
        if(!response.ok){
          return error(`Http error: `,response.message)
        }
        message.success("Password updated successfully")
        setTimeout(()=>{
  window.location.reload()
        },[300]
  
        )
    }catch(err){
      message.error("Something went wrong, please try again")
    }
  }

  return (
    <div className="p-4">
      <Card>
        <CardBody>
          <Typography variant="h6" color="blue-gray" className="mb-4">
            Change Password
          </Typography>

          <div className="space-y-4">
            <Input
              type={showCurrentPassword ? 'text' : 'password'}
              label="Current Password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              iconRight={
                showCurrentPassword ? (
                  <EyeSlashIcon
                    className="h-6 w-6 text-blue-gray-400 cursor-pointer"
                    onClick={() => handleTogglePasswordVisibility('current')}
                  />
                ) : (
                  <EyeIcon
                    className="h-6 w-6 text-blue-gray-400 cursor-pointer"
                    onClick={() => handleTogglePasswordVisibility('current')}
                  />
                )
              }
              inputClassName={passwordsMatch ? 'border border-blue-gray-300' : 'border border-red-500'}
            />

            <Input
              type={showNewPassword ? 'text' : 'password'}
              label="New Password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              iconRight={
                showNewPassword ? (
                  <EyeSlashIcon
                    className="h-6 w-6 text-blue-gray-400 cursor-pointer"
                    onClick={() => handleTogglePasswordVisibility('new')}
                  />
                ) : (
                  <EyeIcon
                    className="h-6 w-6 text-blue-gray-400 cursor-pointer"
                    onClick={() => handleTogglePasswordVisibility('new')}
                  />
                )
              }
              inputClassName="border border-blue-gray-300"
            />

            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              label="Confirm New Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              iconRight={
                showConfirmPassword ? (
                  <EyeSlashIcon
                    className="h-6 w-6 text-blue-gray-400 cursor-pointer"
                    onClick={() => handleTogglePasswordVisibility('confirm')}
                  />
                ) : (
                  <EyeIcon
                    className="h-6 w-6 text-blue-gray-400 cursor-pointer"
                    onClick={() => handleTogglePasswordVisibility('confirm')}
                  />
                )
              }
              inputClassName={passwordsMatch ? 'border border-blue-gray-300' : 'border border-red-500'}
            />

            {!passwordsMatch && (
              <Typography variant="small" color="red-500">
                Passwords do not match.
              </Typography>
            )}

<Button disabled={!passwordsMatch} onClick={handleProfileUpdate}>
  Submit
</Button>

          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default PasswordChange;
