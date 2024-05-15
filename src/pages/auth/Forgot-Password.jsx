import { Card, Input, Button, Typography } from "@material-tailwind/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { message } from "antd";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4444/api/erp/user/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (response.ok) {
        message.success(data.message);
      } else {
        message.error(data.message || "Failed to send reset password email.");
      }
    } catch (error) {
      message.error("Failed to send reset password email. Please try again.");
      console.error("Error:", error.message);
    }
  };

  return (
    <section className="m-8 flex gap-4">
      <Card className="w-60% lg:w-full mt-24 shadow-md">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4 text-gray-800">Forgot Password</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Enter your email to reset your password.</Typography>
        </div>
        <form onSubmit={handleForgotPassword} className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Your email
            </Typography>
            <Input
              size="lg"
              placeholder="name@mail.com"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          <Button type="submit" className="mt-6" fullWidth>
            Reset Password
          </Button>
          <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
            Remember your password? <Link to="/auth/sign-in" className="text-gray-900 ml-1">Sign in</Link>
          </Typography>
        </form>
      </Card>
    </section>
  );
};

export default ForgotPassword;
