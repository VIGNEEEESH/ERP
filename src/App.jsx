// import { Routes, Route, Navigate } from "react-router-dom";
// import { Dashboard, Auth,CEODashboard,DEPTHEADDashboard,HRDashboard } from "@/layouts";
// import { useAuth } from "./pages/auth/auth-hook";
// import { useEffect, useState } from "react";
// import { BeatLoader } from "react-spinners";
// import { AuthContext } from "./pages/auth/Auth-context";
// import { SignIn, SignUp } from "./pages/auth";
// function App() {
//   const { login, logout, userId, token, email, role } = useAuth();
//   const [loading, setLoading] = useState(true);
  
//   let routes;

//   useEffect(() => {
//     // Check if authentication information is available
//     if (role === null) {
//       setLoading(false);
//     }
//   }, [role]);
//   if (loading) {
//     // Display a loading spinner while authentication is in progress
//     return (
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "100vh",
//         }}
//       >
//         <BeatLoader color="#1890ff" loading={loading} size={15} />
//       </div>
//     );
//   }
//   if(role==="CEO"){
//     routes=(
//       <Routes>
//  <Route path="/ceo/dashboard/*" element={<CEODashboard />} />
//       </Routes>
//     )
//   }else if(role==="HR"){
//     routes=(
//       <Routes>
//   <Route path="/hr/dashboard/*" element={<HRDashboard />} />
//       </Routes>
//     )
//   }
//   else if(role==="DeptHead"){
//     routes=(
//       <Routes>
//  <Route path="/depthead/dashboard/*" element={<DEPTHEADDashboard />} />
//       </Routes>
//     )
//   }
//   else if(role==="Employee"){
//     routes=(
//       <Routes>
//   <Route path="/employee/dashboard/*" element={<Dashboard />} />
//       </Routes>
//     )
//   }else{
//     routes = (
//       <Routes>
//         <Route path="/auth/sign-in" element={<SignIn />} />
//         <Route path="/auth/sign-up" element={<SignUp />} />
//         <Route path="/*" element={<Navigate to="/auth/sign-in" replace />} />
//       </Routes>)
//   }
//   return (
//     <AuthContext.Provider
//     value={{
//       isLoggedIn: !!token,
//       login: login,
//       logout: logout,
//       userId: userId,
//       token: token,
//       email: email,
//       role: role,
//     }}
//   >
//     <main>{routes}</main>
//   </AuthContext.Provider>
//   );
// }

// export default App;
import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { AuthContext } from "./pages/auth/Auth-context";
import { useAuth } from "./pages/auth/auth-hook";

// Lazy-loaded components
const Dashboard = lazy(() => import("@/layouts/Dashboard"));
const Auth = lazy(() => import("@/layouts/Auth"));
const CEODashboard = lazy(() => import("@/layouts/CEODashboard"));
const DEPTHEADDashboard = lazy(() => import("@/layouts/DEPTHEADDashboard"));
const HRDashboard = lazy(() => import("@/layouts/HRDashboard"));
const SignIn = lazy(() => import("./pages/auth/sign-in"));
const SignUp = lazy(() => import("./pages/auth/sign-up"));

function App() {
  const { login, logout, userId, token, email, role } = useAuth();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Check if authentication information is available
    if (role === null) {
      setLoading(false);
    }
  }, [role]);

  if (loading) {
    // Display a loading spinner while authentication is in progress
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
        <Route path="/ceo/dashboard/*" element={<CEODashboard />} />
      </Routes>
    );
  } else if (role === "HR") {
    routes = (
      <Routes>
        <Route path="/hr/dashboard/*" element={<HRDashboard />} />
      </Routes>
    );
  } else if (role === "DeptHead") {
    routes = (
      <Routes>
        <Route path="/depthead/dashboard/*" element={<DEPTHEADDashboard />} />
      </Routes>
    );
  } else if (role === "Employee") {
    routes = (
      <Routes>
        <Route path="/employee/dashboard/*" element={<Dashboard />} />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/auth/sign-in" element={<SignIn />} />
        <Route path="/auth/sign-up" element={<SignUp />} />
        <Route path="/*" element={<Navigate to="/auth/sign-in" replace />} />
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
      </Suspense>
    </AuthContext.Provider>
  );
}

export default App;
