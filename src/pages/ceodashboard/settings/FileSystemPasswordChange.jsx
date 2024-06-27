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

function FileSystemPasswordChange() {
  const auth = useContext(AuthContext);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [formData, setFormData] = useState({
    password: "",
    newPassword: "",
    confirmPassword: "",
    userId: auth.userId
  });

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
    setFormData({
      ...formData,
      [name]: value,
    });

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

  const handleProfileUpdate = async () => {
    try {
      const response = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/fileSystem/user/changepassword`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update password');
      }

      message.success("Password updated successfully");
      setTimeout(() => {
        window.location.reload();
      }, 300);
    } catch (err) {
      message.error(err.message || "Something went wrong, please try again");
    }
  };

  const handleSetPassword = async () => {
    try {
      const response = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/fileSystem/user/setpassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`
        },
        body: JSON.stringify({ newPassword: formData.newPassword })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to set password');
      }

      message.success("Password set successfully");
      setTimeout(() => {
        window.location.reload();
      }, 300);
    } catch (err) {
      message.error(err.message || "Something went wrong, please try again");
    }
  };

  return (
    <div className="p-4">
      <Card>
        <CardBody>
          <Typography variant="h6" color="blue-gray" className="mb-4">
            Set Password
          </Typography>
          <div className="space-y-4">
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
            />
            {!passwordsMatch && (
              <Typography variant="small" color="red">
                Passwords do not match.
              </Typography>
            )}
            <Button disabled={!passwordsMatch} onClick={handleSetPassword}>
              Set Password
            </Button>
          </div>
          <Typography variant="h6" color="blue-gray" className="mt-8 mb-4">
            Change Password
          </Typography>
          <div className="space-y-4">
            <Button onClick={handleProfileUpdate}>
              Change Password
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default FileSystemPasswordChange;
