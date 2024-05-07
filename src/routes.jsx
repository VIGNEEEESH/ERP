import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  BuildingOfficeIcon,
  RectangleStackIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  CalendarDaysIcon,
  CalendarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  PresentationChartLineIcon,
  CubeIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables, Notifications } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";
import CommunicationComponent from "@/pages/dashboard/communication";
import Logout from "./pages/dashboard/logout";
// import Leave from "./pages/dashboard/leave";
// import AttendenceTracker from "./pages/dashboard/Attendence/AttendenceTracker"; 
import Settings from "./pages/dashboard/settings/Settings";
import LeaveForm from "./pages/dashboard/leavereq/LeaveForm";
import MyOffice from "./pages/dashboard/myOffice/MyOffice";
import EmployeeProjects from "./pages/dashboard/myProjects/EmployeeProjects";
import EmployeeTasks from "./pages/dashboard/Tasks/EmployeeTasks";
import CompanyProducts from "./pages/dashboard/companyproducts/CompanyProducts";
import Employee from "./pages/dashboard/profile/employee";
import WorkStatus from "./pages/dashboard/workstatus/WorkStatus";
// import employee from "./pages/dashboard/profile/employee";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "employee/dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },


      {
        icon: <BriefcaseIcon {...icon} />,
        name: "My Office",
        path: "/my-office",
        element: <MyOffice/>,
      },
      {
        icon: <BuildingOfficeIcon {...icon} />,
        name: "Work Status",
        path: "/work-staus",
        element: <WorkStatus/>,
      },
      {
        icon: <HomeIcon {...icon} />,
        name: "MyProjects",
        path: "/myProjects",
        element: <EmployeeProjects />,
      },
      {
        icon: <PresentationChartLineIcon {...icon} />,
        name: "MyTasks",
        path: "/Tasks",
        element: <EmployeeTasks />,
      },

     
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Leave",
        path: "/leavereq",
        element: <LeaveForm />,
      },
      {
        icon: <CubeIcon {...icon} />,
        name: "CompanyProducts",
        path: "/companyproducts",
        element: <CompanyProducts />,
      },
      {
        icon: <ChatBubbleOvalLeftEllipsisIcon {...icon} />,
        name: "Communication",
        path: "/communication",
        element: <CommunicationComponent />,
      },
      
     
      
    
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "notifications",
        path: "/notifications",
        element: <Notifications />,
      },
    
      
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Employee />,
      },
      {
        icon: <Cog6ToothIcon {...icon} />, 
        name: "settings",
        path: "/settings",
        element: <Settings />,
      },
      {
        icon: <ArrowRightOnRectangleIcon {...icon} />, 
        name: "Logout",
        path: "/logout",
        element: <Logout />,
      },
  
    ],
  },
  // {
  //   title: "auth pages",
  //   layout: "auth",
  //   pages: [
  //     {
  //       icon: <ServerStackIcon {...icon} />,
  //       name: "sign in",
  //       path: "/sign-in",
  //       element: <SignIn />,
  //     },
  //     {
  //       icon: <RectangleStackIcon {...icon} />,
  //       name: "sign up",
  //       path: "/sign-up",
  //       element: <SignUp />,
  //     },
  //   ],
  // },
];

export default routes;
