import React, { useState } from "react";
import {
  Input,
  FileInput,
  Button,
  Typography,
  Stepper,
  Step,
  Tooltip,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { BuildingOfficeIcon, HomeIcon, InformationCircleIcon } from "@heroicons/react/24/solid";

export function SignUp() {
  const [isValidId, setIsValidId] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    pincode: "",
    state: "",
    image: "",
    offerLetter: "",
    pan: "",
    aadhar: "",
  });

  const handleUniqueIdChange = (e) => {
    const { value } = e.target;
    setIsValidId(value === "validId");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
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
          <Step >
            <Tooltip content="Unique ID">
            <InformationCircleIcon className="h-4 w-4"/>
            </Tooltip>
          </Step>
          <Step>
          <Tooltip content="Personal Details">
            <HomeIcon className="h-4 w-4"/>
            </Tooltip>
          </Step>
          <Step>
          <Tooltip content="office details">
            <BuildingOfficeIcon className="h-4 w-4"/>
          </Tooltip>
          </Step>
        </Stepper>

        {activeStep === 0 && (
          <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
            <div className="mb-1 flex flex-col gap-6">
              <Input
                size="lg"
                label="Unique ID"
                onChange={handleUniqueIdChange}
              />

              {isValidId && (
                <>
                  <Button
                    className="mt-6"
                    fullWidth
                    onClick={handleNext}
                  >
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
              <Input
                size="lg"
                label="Email"
                name="email"
                type="email"
                onChange={handleInputChange}
              />
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
              <Button
                className="mt-6"
                fullWidth
                onClick={handleNext}
              >
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
                label="password"
                name="image"
                onChange={handleInputChange}
              />
              <Input
                size="lg"
                label="confirm Password"
                name="image"
                onChange={handleInputChange}
              />

              <Input
                size="lg"
                label="Upload Image"
                name="image"
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

              <Button
                className="mt-6"
                fullWidth
                onClick={handleNext}
              >
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

        <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
          Already have an account?
          <Link to="/auth/sign-in" className="text-gray-900 ml-1">Sign in</Link>
        </Typography>
      </div>
    </section>
  );
}

export default SignUp;
