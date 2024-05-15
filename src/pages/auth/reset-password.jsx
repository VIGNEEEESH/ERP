
import { Card, Input, Button, Typography } from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { message } from "antd";

// Function to decode JWT payload
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};

const UpdatePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  // Parse query parameters
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");

  // Decode token to get email
  const decodedToken = decodeToken(token);
  const email = decodedToken ? decodedToken.email : null;

  useEffect(() => {
    if (!email) {
      message.error("Invalid or expired token.");
      navigate("/auth/sign-in");
    }
  }, [email, navigate]);

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4444/api/erp/user/update-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        message.success(data.message);
        navigate("/auth/sign-in");
      } else {
        message.error(data.message || "Failed to update password.");
      }
    } catch (error) {
      message.error("Failed to update password. Please try again.");
      console.error("Error:", error.message);
    }
  };

  return (
    <section className="m-8 flex gap-4">
      <Card className="w-60% lg:w-full mt-24 shadow-md">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4 text-gray-800">Update Password</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Enter your new password.</Typography>
        </div>
        <form onSubmit={handleUpdatePassword} className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              New Password
            </Typography>
            <Input
              size="lg"
              type="password"
              placeholder="Enter your new password"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={newPassword}
              onChange={handlePasswordChange}
            />
          </div>
          <Button type="submit" className="mt-6" fullWidth>
            Update Password
          </Button>
        </form>
      </Card>
    </section>
  );
};

export default UpdatePassword;
