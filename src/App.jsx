import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { AuthContext } from "./pages/auth/Auth-context";
import { useAuth } from "./pages/auth/auth-hook";
import ForgotPassword from "./pages/auth/Forgot-Password";
import UpdatePassword from "./pages/auth/reset-password";
import ChatProvider from "./pages/dashboard/chat/component/miscellaneous/ChatProvider";


import "./App.css"
// Lazy-loaded components
import Dashboard from "@/layouts/dashboard";
import Auth from "@/layouts/auth";
import CEODashboard from "@/layouts/CEOdashboard";
import DEPTHEADDashboard from "@/layouts/DEPTHEADdashboard";
import HRDashboard from "@/layouts/HRdashboard";
const SignIn = lazy(() => import("./pages/auth/sign-in"));
const SignUp = lazy(() => import("./pages/auth/sign-up"));

// import Dashboard from "@/layouts/Dashboard";
// import Auth from "@/layouts/Auth";
// import CEODashboard from "@/layouts/CEODashboard";
// import DEPTHEADDashboard from "@/layouts/DEPTHEADDashboard";
// import HRDashboard from "@/layouts/HRDashboard";
// import SignIn from "./pages/auth/sign-in";
// import SignUp from "./pages/auth/sign-up";

function App() {
  const { login, logout, userId, token, email, role } = useAuth();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (role === null) {
      setLoading(false);
    }
  }, [role]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <BeatLoader color="#1890ff" loading={loading} size={15} />
      </div>
    );
  }

  let routes;
  if (role === "CEO") {
    routes = (
      <Routes>
        <Route path="/*" element={<Navigate to="/ceo/dashboard/home" replace />} />
        <Route path="/ceo/dashboard/*" element={<CEODashboard />} />
      </Routes>
    );
  } else if (role === "HR") {
    routes = (
      <Routes>
        <Route path="/*" element={<Navigate to="/hr/dashboard/home" replace />} />
        <Route path="/hr/dashboard/*" element={<HRDashboard />} />
      </Routes>
    );
  } else if (role === "DeptHead") {
    routes = (
      <Routes>
        <Route path="/*" element={<Navigate to="/depthead/dashboard/home" replace />} />
        <Route path="/depthead/dashboard/*" element={<DEPTHEADDashboard />} />
      </Routes>
    );
  } else if (role === "Employee") {
    routes = (
      <Routes>
        <Route path="/*" element={<Navigate to="/employee/dashboard/home" replace />} />
        <Route path="/employee/dashboard/*" element={<Dashboard />} />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/auth/sign-in" element={<SignIn />} />
        <Route path="/auth/sign-up" element={<SignUp />} />
        <Route path="/*" element={<Navigate to="/auth/sign-in" replace />} />
        <Route path="/auth/forgotpassword" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<UpdatePassword/>} />
      </Routes>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        login: login,
        logout: logout,
        userId: userId,
        token: token,
        email: email,
        role: role,
      }}
    >
    
      <ChatProvider>
      <Suspense
        fallback={
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <BeatLoader color="#1890ff" loading={true} size={15} />
          </div>
        }
      >
        <main>{routes}</main>
      </Suspense></ChatProvider>
    </AuthContext.Provider>
  );
}

export default App;

