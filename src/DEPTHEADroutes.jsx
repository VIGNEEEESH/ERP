import {
  HomeIcon,
  UserCircleIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  BellAlertIcon,
  CubeIcon,
  Cog6ToothIcon,
  CursorArrowRaysIcon,
  BriefcaseIcon,
  UserGroupIcon,
  ArrowRightOnRectangleIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import { Home, Notifications} from "@/pages/dashboard";
import LeaveRequests  from "./pages/deptheaddashboard/leaverequest.jsx";
import Logout from "./pages/deptheaddashboard/logout.jsx";
import CompanyProducts from "./pages/deptheaddashboard/companyproducts/CompanyProducts";
import Profile from "./pages/deptheaddashboard/profile.jsx";
import MyOffice from "./pages/deptheaddashboard/myoffice.jsx";
import Settings from "./pages/deptheaddashboard/settings/Settings.jsx";
import TaskManager from "./pages/deptheaddashboard/task manager/taskmanager.jsx";
import Communication from "./pages/deptheaddashboard/communication/communication.jsx";
import Projects from "./pages/deptheaddashboard/projects/projects.jsx";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const DEPTHEADroutes = [
  {
    layout: "depthead/dashboard",
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
        path: "/loginstatus",
        element: <MyOffice />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "Manage Projects",
        path: "/projects",
        element: <Projects/>,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "Task Manager",
        path: "/managetask",
        element: <TaskManager/>,
      },
      {
        icon: <CursorArrowRaysIcon {...icon} />,
        name: "Leave Request",
        path: "/leaverequest",
        element: <LeaveRequests />,
      },
      {
        icon: <CubeIcon {...icon} />,
        name: "Company Products",
        path: "/product",
        element: <CompanyProducts />,
      },
      
      {icon: <BellAlertIcon {...icon} />,
      name: "notifications",
      path: "/notifications",
      element: <Notifications />,
    },
    {
      icon: <ChatBubbleOvalLeftEllipsisIcon {...icon} />,
      name: "Communication",
      path: "/communication",
      element: <Communication />,
    },
    {
      icon: <UserCircleIcon {...icon} />,
      name: "profile",
      path: "/profile",
      element: <Profile />,
    },
      {
        icon: <Cog6ToothIcon {...icon} />,
        name: "settings",
        path: "/settings",
        element: <Settings/>,
      },
      {
        icon: <ArrowRightOnRectangleIcon {...icon} />,
        name: "Logout",
        path: "/logout",
        element: <Logout />,
      },
    ],
  },
];

export default DEPTHEADroutes;
