import React, { useContext, useState } from "react";
import {
  Input,
  FileInput,
  Button,
  Typography,
  Stepper,
  Step,
  Tooltip,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import {
  BuildingOfficeIcon,
  EyeIcon,
  HomeIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";
import { message } from "antd";
import { AuthContext } from "./Auth-context";

export function SignUp() {
  const [isValidId, setIsValidId] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const auth = useContext(AuthContext);
  const navigate=useNavigate()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    pincode: "",
    state: "",
    image: null,
    password: "",
    confirmPassword: "",
    pan: "",
    aadhar: "",
    id: "",
    mobile: "",
    country:""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Check if the input is for Unique ID
    if (name === "id") {
      setIsValidId(value.length > 4);
    }

    // Update form data
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({
      ...formData,
      [name]: files[0],
    });
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    
    try {
      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match");
      }
  
      const formDataToSend = new FormData();
  
      // Append form data fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && typeof value !== "undefined") {
          formDataToSend.append(key, value);
        }
      });
  
      const response = await fetch(
        `${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/user/create/user`,
        {
          method: "PATCH",
          body: formDataToSend,
        }
      );
      if (!response.ok) {
        throw new Error("Could not create user, please try again");
      }
      const data = await response.json();
      auth.login(data.userId, data.token, data.email, data.role);
      message.success("Signed up successfully");
      setTimeout(() => {
        navigate(`/${data.role.toLowerCase()}/dashboard/home`);
      });
    } catch (err) {
      message.error(err.message || "Sign up failed");
    }
  };
  

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
    <section className="m-8 flex">
      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/pattern.png"
          className="h-full w-full object-cover rounded-3xl"
          alt=""
        />
      </div>

      <div className="w-full lg:w-3/5 flex flex-col justify-center">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">
            Join Us Today
          </Typography>
          <Typography
            variant="paragraph"
            color="blue-gray"
            className="text-lg font-normal"
          >
            Enter your details to register.
          </Typography>
        </div>

        <Stepper activeStep={activeStep} alternativeLabel>
          <Step>
            <Tooltip content="Unique ID">
              <InformationCircleIcon className="h-4 w-4" />
            </Tooltip>
          </Step>
          <Step>
            <Tooltip content="Personal Details">
              <HomeIcon className="h-4 w-4" />
            </Tooltip>
          </Step>
          <Step>
            <Tooltip content="office details">
              <BuildingOfficeIcon className="h-4 w-4" />
            </Tooltip>
          </Step>
        </Stepper>

        {activeStep === 0 && (
          <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
            <div className="mb-1 flex flex-col gap-6">
              <Input
                size="lg"
                label="Unique ID"
                onChange={handleInputChange}
                name="id"
              />

              {isValidId && (
                <>
                  <Button className="mt-6" fullWidth onClick={handleNext}>
                    Next
                  </Button>
                </>
              )}
            </div>
          </form>
        )}

        {activeStep === 1 && (
          <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
            <div className="mb-1 flex flex-col gap-6">
              <Input
                size="lg"
                label="First Name"
                name="firstName"
                onChange={handleInputChange}
              />
              <Input
                size="lg"
                label="Last Name"
                name="lastName"
                onChange={handleInputChange}
              />
              {/* <Input
                size="lg"
                label="Email"
                name="email"
                type="email"
                onChange={handleInputChange}
              /> */}
              <Input
                size="lg"
                label="Address"
                name="address"
                onChange={handleInputChange}
              />
              <Input
                size="lg"
                label="Pincode"
                name="pincode"
                type="number"
                onChange={handleInputChange}
              />
              <Input
                size="lg"
                label="State"
                name="state"
                onChange={handleInputChange}
              />
              <Input
                size="lg"
                label="Country"
                name="country"
                onChange={handleInputChange}
              />
              <Button className="mt-6" fullWidth onClick={handleNext}>
                Next
              </Button>

              <Button
                className="mt-4"
                color="blue-gray"
                fullWidth
                onClick={handleBack}
              >
                Back
              </Button>
            </div>
          </form>
        )}
        {activeStep === 2 && (
          <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
            <div className="mb-1 flex flex-col gap-6">
              <Input
                size="lg"
                type={showPassword ? "text" : "password"}
                label="Password"
                name="password"
                onChange={handleInputChange}
                iconRight={
                  <Button
                    onClick={togglePasswordVisibility}
                    size="small"
                    iconOnly
                  >
                    {showPassword ? (
                      <EyeOffIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </Button>
                }
              />
              <Input
                size="lg"
                type={showConfirmPassword ? "text" : "password"}
                label="Confirm Password"
                name="confirmPassword"
                onChange={handleInputChange}
                iconRight={
                  <Button
                    onClick={toggleConfirmPasswordVisibility}
                    size="small"
                    iconOnly
                  >
                    {showConfirmPassword ? (
                      <EyeOffIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </Button>
                }
              />

              <Input
                size="lg"
                type="file"
                label="Upload Image"
                name="image"
                onChange={handleFileChange}
              />
              <Input
                size="lg"
                label="Mobile Number"
                name="mobile"
                onChange={handleInputChange}
              />
              <Input
                size="lg"
                label="PAN Number"
                name="pan"
                onChange={handleInputChange}
              />
              <Input
                size="lg"
                label="Aadhar Number"
                name="aadhar"
                onChange={handleInputChange}
              />

              <Button className="mt-6" fullWidth onClick={handleSubmit}>
                Register Now
              </Button>

              <Button
                className="mt-4"
                color="blue-gray"
                fullWidth
                onClick={handleBack}
              >
                Back
              </Button>
            </div>
          </form>
        )}

        <Typography
          variant="paragraph"
          className="text-center text-blue-gray-500 font-medium mt-4"
        >
          Already have an account?
          <Link to="/auth/sign-in" className="text-gray-900 ml-1">
            Sign in
          </Link>
        </Typography>
      </div>
    </section>
  );
}

export default SignUp;
