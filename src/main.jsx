/**
=========================================================
* Material Tailwind Dashboard React - v2.1.0
=========================================================
* Product Page: https://www.creative-tim.com/product/material-tailwind-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-tailwind-dashboard-react/blob/main/LICENSE.md)
* Coded by Creative Tim
=========================================================
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@material-tailwind/react";
import { NotificationProvider } from './context/NotificationContext';
import { MaterialTailwindControllerProvider } from "@/context";
import "../public/css/tailwind.css";
import { ChakraProvider } from '@chakra-ui/react'
//import "@heroicons/vue/dist/\@heroicons/vue.css"; // Use the escaped backslash




ReactDOM.createRoot(document.getElementById("root")).render(
      
  <React.StrictMode>
    <BrowserRouter>

      <ThemeProvider>
        <MaterialTailwindControllerProvider>
        <ChakraProvider>
        
     <NotificationProvider>
      
       
          <App />
          </NotificationProvider>
        
          
          </ChakraProvider>
        </MaterialTailwindControllerProvider>
      </ThemeProvider>
      
    </BrowserRouter>
  </React.StrictMode>
  
);