import {
  HomeIcon,
  UserCircleIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  CalendarDaysIcon,
  CubeIcon,
  UserIcon,
  CalendarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/solid";
import { SignIn, SignUp } from "@/pages/auth";
import Home from "./pages/hrdashboard/home";
import Tables from "./pages/hrdashboard/tables";
import Notifications from "./pages/hrdashboard/notifications";
import ManageEmployees from "./pages/hrdashboard/manage-employees/manageEmployees";
import AttendenceTracker from "./pages/hrdashboard/Attendence/AttendenceTracker";
import MyOffice from "./pages/hrdashboard/myOffice/MyOffice";
import WorkStatus from "./pages/hrdashboard/workstatus/WorkStatus";
import CompanyProducts from "./pages/hrdashboard/companyproducts/CompanyProducts";
import OurClients from "./pages/hrdashboard/clients/OurClients";
import Leave from "./pages/hrdashboard/leaves/Leave";
import Settings from "./pages/hrdashboard/settings/Settings";
import Communication from "./pages/hrdashboard/communication/communication";
import Projects from "./pages/hrdashboard/projects/projects";
import Logout from "./pages/hrdashboard/logout";
import Profile from "./pages/hrdashboard/profile/Profile";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const HRroutes = [
  {
    layout: "hr/dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "Manage Employees",
        path: "/manage-employees",
        element: <ManageEmployees />,
      },
      {
        icon: <CalendarDaysIcon {...icon} />,
        name: "Attendence Tracker",
        path: "/attendence-tracker",
        element: <AttendenceTracker />,
      },
      {
        icon: <BuildingOfficeIcon {...icon} />,
        name: "My Office",
        path: "/my-office",
        element: <MyOffice />,
      },
      {
        icon: <ChatBubbleLeftRightIcon {...icon} />,
        name: "Communication",
        path: "/communication",
        element: <Communication />,
      },
      {
        icon: <BriefcaseIcon {...icon} />,
        name: "Work Status",
        path: "/workstatus",
        element: <WorkStatus />,
      },
      {
        icon: <DocumentTextIcon {...icon} />,
        name: "Our Projects",
        path: "/projects",
        element: <Projects />,
      },
      {
        icon: <CubeIcon {...icon} />,
        name: "Company products",
        path: "/companyproducts",
        element: <CompanyProducts />,
      },
      {
        icon: <UserIcon {...icon} />,
        name: "Our Clients",
        path: "/ourclients",
        element: <OurClients />,
      },
      {
        icon: <CalendarIcon {...icon} />,
        name: "Employee Leaves",
        path: "/employeeleaves",
        element: <Leave />,
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
        element: <Settings />,
      },
      {
        icon: <ArrowRightOnRectangleIcon {...icon} />,
        name: "Logout",
        path: "/logout",
        element: <Logout/>,
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

export default HRroutes;
