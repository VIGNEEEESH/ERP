
import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./Auth-context";
import { message } from "antd";
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'; // Import eye icons

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/user/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      auth.login(data.userId, data.token, data.email, data.role);
      message.success("Logged in successfully");
      setTimeout(() => {
        navigate(`/${data.role.toLowerCase()}/dashboard/home`);
      });
    } catch (error) {
      message.error("Login Failed. Please check Email and Password Again.");
      console.error("Error signing in:", error.message);
    }
  };

  return (
    <section className="m-8 flex gap-4">
      <div className="w-full lg:w-3/5 mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Sign In</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Enter your email and password to Sign In.</Typography>
        </div>
        <form  className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
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
              onChange={handleEmailChange}
            />
            <Typography variant="small" color="blue-gray"  className="-mb-3 font-medium">
              Password
            </Typography>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"} // Toggle input type
                size="lg"
                placeholder="********"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900 pr-10" // Added padding for icon
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                onChange={handlePasswordChange}
              />
              {/* Eye icon to toggle password visibility */}
              {showPassword ? (
                <EyeSlashIcon
                  className="absolute h-6 w-6 right-3 top-1/2 transform -translate-y-1/2 text-blue-gray-400 cursor-pointer"
                  onClick={togglePasswordVisibility}
                />
              ) : (
                <EyeIcon
                  className="absolute h-6 w-6 right-3 top-1/2 transform -translate-y-1/2 text-blue-gray-400 cursor-pointer"
                  onClick={togglePasswordVisibility}
                />
              )}
            </div>
          </div>
          <Typography variant="paragraph" className="text-right text-blue-gray-500 font-medium mt-4">
          <Link to="/auth/forgotpassword" className="text-gray-900 ml-1">Forgot Password ?</Link>
        </Typography>
          
          <Button onClick={handleSignIn} className="mt-6" fullWidth>
            Sign In
          </Button>
          <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
          Need an Account?
          <Link to="/auth/sign-up" className="text-gray-900 ml-1">Sign up</Link>
        </Typography>
        </form>

      </div>
      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/csc-logo.png"
          className="h-full w-full object-cover rounded-3xl"
        />
      </div>

    </section>
  );
}

export default SignIn;
