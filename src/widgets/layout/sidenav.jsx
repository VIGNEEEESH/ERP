import PropTypes from "prop-types";
import React, { useState, useEffect, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  Avatar,
  Button,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import { AuthContext } from '@/pages/auth/Auth-context';

export function Sidenav({ brandName, routes }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav } = controller;
  const sidenavTypes = {
    dark: "bg-gradient-to-br from-gray-800 to-gray-900",
    white: "bg-white shadow-sm",
    transparent: "bg-transparent",
  };

  const auth = useContext(AuthContext);

  const [profileImg, setProfileImg] = useState(null);
  const [firstName, setFirstName] = useState("");
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/user/get/user/byid/${auth.userId}`,
        {
          headers:{
            Authorization: "Bearer " + auth.token, 
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const userData = await response.json();
        if (userData) {
          // Prepend base URL to the image path
          const imageUrl = `${import.meta.env.REACT_APP_BACKEND_URL}/${userData.user.image}`;
          setProfileImg(imageUrl);
          setFirstName(userData.user.firstName);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [auth.userId]);
  
  

  return (
    <aside
      className={`${sidenavTypes[sidenavType]} ${
        openSidenav ? "translate-x-0" : "-translate-x-80"
      } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0 border border-blue-gray-100 overflow-auto overflow-x-hidden hover:overflow-scroll`}
    >
      <div className="relative flex flex-col items-center">
  <Link to="/" className="py-6 px-8 text-center">
    <Typography
      variant="h6"
      color={sidenavType === "dark" ? "white" : "blue-gray"}
    >
      {brandName}
    </Typography>
  </Link>
  {profileImg && (
    <Avatar
      src={profileImg}
      alt="Profile Picture"
      size="xxl"
      variant="rounded-full"
      className="mx-auto mb-4"
    />
  )}
  <Typography
    variant="h6"
    color={sidenavType === "dark" ? "white" : "blue-gray"}
    className="text-center"
  >
    {`Hello ${firstName}`}
  </Typography>
  <IconButton
    variant="text"
    color="white"
    size="sm"
    ripple={false}
    className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:visible"
    onClick={() => setOpenSidenav(dispatch, false)}
  >
    <XMarkIcon strokeWidth={2.5} className="h-5 w-5 dark:text-white" />
  </IconButton>
</div>

      <div className="m-4">
        {routes.map(({ layout, title, pages }, key) => (
          <ul key={key} className="mb-4 flex flex-col gap-1">
            {title && (
              <li className="mx-3.5 mt-4 mb-2">
                <Typography
                  variant="small"
                  color={sidenavType === "dark" ? "white" : "blue-gray"}
                  className="font-black uppercase opacity-75"
                >
                  {title}
                </Typography>
              </li>
            )}
            {pages.map(({ icon, name, path }) => (
              <li key={name}>
                <NavLink to={`/${layout}${path}`}>
                  {({ isActive }) => (
                    <Button
                      variant={isActive ? "gradient" : "text"}
                      color={
                        isActive
                          ? sidenavColor
                          : sidenavType === "dark"
                          ? "white"
                          : "blue-gray"
                      }
                      className="flex items-center gap-4 px-4 capitalize"
                      fullWidth
                    >
                      {icon}
                      <Typography
                        color="inherit"
                        className="font-medium capitalize"
                      >
                        {name}
                      </Typography>
                    </Button>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </aside>
  );
}

Sidenav.propTypes = {
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidenav;
