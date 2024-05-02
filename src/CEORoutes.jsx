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
import { Home, Profile, Tables, Notifications } from "@/pages/dashboard";
import Logout from "./pages/ceodashboard/logout";
import ManageEmployees from "./pages/ceodashboard/manage-employees/manageEmployees";
import AttendenceTracker from "./pages/ceodashboard/Attendence/AttendenceTracker";
import Communication from "./pages/ceodashboard/communication/communication";
import WorkStatus from "./pages/ceodashboard/workstatus/WorkStatus";
import CompanyProducts from "./pages/ceodashboard/companyproducts/CompanyProducts";
import MyOffice from "./pages/ceodashboard/myOffice/MyOffice";
import OurClients from "./pages/ceodashboard/clients/OurClients";
import Leave from "./pages/ceodashboard/leaves/Leave";
import CEOProfile from "./pages/ceodashboard/profile/CEOProfile";
import Settings from "./pages/ceodashboard/settings/Settings";
import Projects from "./pages/ceodashboard/projects/Projects";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const CEORoutes = [
  {
    layout: "ceo/dashboard",
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
        element: <MyOffice/>,
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
        element: <Projects/>,
      },
      {
        icon: <CubeIcon {...icon} />,
        name: "Company products",
        path: "/companyproducts",
        element: <CompanyProducts/>,
      },
      {
        icon: <UserIcon {...icon} />,
        name: "Our Clients",
        path: "/ourclients",
        element: <OurClients/>,
      },
      {
        icon: <CalendarIcon {...icon} />,
        name: "Employee Leaves",
        path: "/employeeleaves",
        element: <Leave/>,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <CEOProfile/>,
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
        element: <Logout/>,
      },
    ],
  },
];

export default CEORoutes;
