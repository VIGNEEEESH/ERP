import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth,CEODashboard,DEPTHEADDashboard,HRDashboard } from "@/layouts";
import { useAuth } from "./pages/auth/auth-hook";
import { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { AuthContext } from "./pages/auth/Auth-context";
function App() {
  const { login, logout, userId, token, email, role } = useAuth();
  const [loading, setLoading] = useState(true);
  
  let routes;

  useEffect(() => {
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
  if(role==="CEO"){
    routes=(
      <Routes>
 <Route path="/ceo/dashboard/*" element={<CEODashboard />} />
      </Routes>
    )
  }else if(role==="HR"){
    routes=(
      <Routes>
  <Route path="/hr/dashboard/*" element={<HRDashboard />} />
      </Routes>
    )
  }
  else if(role==="DeptHead"){
    routes=(
      <Routes>
 <Route path="/depthead/dashboard/*" element={<DEPTHEADDashboard />} />
      </Routes>
    )
  }
  else if(role==="Employee"){
    routes=(
      <Routes>
  <Route path="/employee/dashboard/*" element={<Dashboard />} />
      </Routes>
    )
  }else{
    routes=(
      <Routes>
<Route path="/auth/*" element={<Auth />} />
<Route path="/*" element={<Navigate to="/auth/sign-in" replace />} />
      {/* <Route path="*" element={<Navigate to="/employee/dashboard/home" replace />} />
      <Route path="*" element={<Navigate to="/ceo/dashboard/home" replace />} />
      <Route path="*" element={<Navigate to="/hr/dashboard/home" replace />} />
      <Route path="*" element={<Navigate to="/depthead/dashboard/home" replace />} /> */}
      </Routes>
    )
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
    <main>{routes}</main>
  </AuthContext.Provider>
  );
}

export default App;
