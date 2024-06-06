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
  const navigate = useNavigate();
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
    country: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateField = (name, value) => {
    let error = "";
    if (!value) {
      error = "This field is required";
    } else {
      switch (name) {
        case "pincode":
          if (!/^\d{6}$/.test(value)) {
            error = "Pincode must be a 6-digit number";
          }
          break;
        case "mobile":
          if (!/^\d{10}$/.test(value)) {
            error = "Mobile number must be a 10-digit number";
          }
          break;
        case "email":
          if (!/\S+@\S+\.\S+/.test(value)) {
            error = "Email is invalid";
          }
          break;
        case "password":
          if (value.length < 6) {
            error = "Password must be at least 6 characters long";
          }
          break;
        case "confirmPassword":
          if (value !== formData.password) {
            error = "Passwords do not match";
          }
          break;
        default:
          break;
      }
    }
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Validate field
    validateField(name, value);

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
    // Validate current step fields before proceeding
    const fieldsToValidate = {
      0: ["id"],
      1: ["firstName", "lastName", "address", "pincode", "state", "country"],
      2: ["password", "confirmPassword", "image", "mobile", "pan", "aadhar"],
    };

    const currentStepFields = fieldsToValidate[activeStep] || [];
    let isValid = true;
    currentStepFields.forEach((field) => {
      validateField(field, formData[field]);
      if (!formData[field]) {
        isValid = false;
      }
    });

    if (isValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      message.error("Please fill out all mandatory fields before proceeding");
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    try {
      // Validate all fields before submitting
      Object.keys(formData).forEach((field) => validateField(field, formData[field]));

      if (Object.values(formErrors).some((error) => error)) {
        throw new Error("Please fix the errors before submitting");
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
          src="/img/csc-logo.png"
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
            <Tooltip content="Office Details">
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
                error={formErrors.id}
              />
              {formErrors.id && (
                <Typography color="red">{formErrors.id}</Typography>
              )}
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
                error={formErrors.firstName}
              />
              {formErrors.firstName && (
                <Typography color="red">{formErrors.firstName}</Typography>
              )}
              <Input
                size="lg"
                label="Last Name"
                name="lastName"
                onChange={handleInputChange}
                error={formErrors.lastName}
              />
              {formErrors.lastName && (
                <Typography color="red">{formErrors.lastName}</Typography>
              )}
              <Input
                size="lg"
                label="Address"
                name="address"
                onChange={handleInputChange}
                error={formErrors.address}
              />
              {formErrors.address && (
                <Typography color="red">{formErrors.address}</Typography>
              )}
              <Input
                size="lg"
                label="Pincode"
                name="pincode"
                type="number"
                onChange={handleInputChange}
                error={formErrors.pincode}
              />
              {formErrors.pincode && (
                <Typography color="red">{formErrors.pincode}</Typography>
              )}
              <Input
                size="lg"
                label="State"
                name="state"
                onChange={handleInputChange}
                error={formErrors.state}
              />
              {formErrors.state && (
                <Typography color="red">{formErrors.state}</Typography>
              )}
              <Input
                size="lg"
                label="Country"
                name="country"
                onChange={handleInputChange}
                error={formErrors.country}
              />
              {formErrors.country && (
                <Typography color="red">{formErrors.country}</Typography>
              )}
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
                error={formErrors.password}
                iconRight={
                  <Button
                    onClick={togglePasswordVisibility}
                    size="small"
                    iconOnly
                  >
                    <EyeIcon className="w-5 h-5" />
                  </Button>
                }
              />
              {formErrors.password && (
                <Typography color="red">{formErrors.password}</Typography>
              )}
              <Input
                size="lg"
                type={showConfirmPassword ? "text" : "password"}
                label="Confirm Password"
                name="confirmPassword"
                onChange={handleInputChange}
                error={formErrors.confirmPassword}
                iconRight={
                  <Button
                    onClick={toggleConfirmPasswordVisibility}
                    size="small"
                    iconOnly
                  >
                    <EyeIcon className="w-5 h-5" />
                  </Button>
                }
              />
              {formErrors.confirmPassword && (
                <Typography color="red">{formErrors.confirmPassword}</Typography>
              )}
              <Input
                size="lg"
                type="file"
                label="Upload Image"
                name="image"
                onChange={handleFileChange}
                error={formErrors.image}
              />
              {formErrors.image && (
                <Typography color="red">{formErrors.image}</Typography>
              )}
              <Input
                size="lg"
                label="Mobile Number"
                name="mobile"
                onChange={handleInputChange}
                error={formErrors.mobile}
              />
              {formErrors.mobile && (
                <Typography color="red">{formErrors.mobile}</Typography>
              )}
              <Input
                size="lg"
                label="PAN Number"
                name="pan"
                onChange={handleInputChange}
                error={formErrors.pan}
              />
              {formErrors.pan && (
                <Typography color="red">{formErrors.pan}</Typography>
              )}
              <Input
                size="lg"
                label="Aadhar Number"
                name="aadhar"
                onChange={handleInputChange}
                error={formErrors.aadhar}
              />
              {formErrors.aadhar && (
                <Typography color="red">{formErrors.aadhar}</Typography>
              )}

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
