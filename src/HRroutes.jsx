
import { lazy } from 'react';
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
  ClipboardDocumentListIcon,
  WalletIcon,
} from "@heroicons/react/24/solid";

const Home = lazy(() => import("./pages/hrdashboard/home"));
const Tables = lazy(() => import("./pages/hrdashboard/tables"));
const Notifications = lazy(() => import("./pages/hrdashboard/notifications"));
const ManageEmployees = lazy(() => import("./pages/hrdashboard/manage-employees/manageEmployees"));
const AttendenceTracker = lazy(() => import("./pages/hrdashboard/Attendence/AttendenceTracker"));
const MyOffice = lazy(() => import("./pages/hrdashboard/myOffice/MyOffice"));
const WorkStatus = lazy(() => import("./pages/hrdashboard/workstatus/WorkStatus"));
const CompanyProducts = lazy(() => import("./pages/hrdashboard/companyproducts/CompanyProducts"));
const OurClients = lazy(() => import("./pages/hrdashboard/clients/OurClients"));
const Leave = lazy(() => import("./pages/hrdashboard/leaves/Leave"));
const Settings = lazy(() => import("./pages/hrdashboard/settings/Settings"));
const Communication = lazy(() => import("@/pages/dashboard/communication"));
const Projects = lazy(() => import("./pages/hrdashboard/projects/projects"));
const Logout = lazy(() => import("./pages/hrdashboard/logout"));
const Profile = lazy(() => import("./pages/hrdashboard/profile/Profile"));
const TaskManager = lazy(() => import("./pages/hrdashboard/task manager/taskmanager"));
const LogRecord = lazy(() => import("./pages/hrdashboard/logrecord/LogRecord"));
const MyLogRecord = lazy(() => import("./pages/hrdashboard/mylogrecord/MylogRecord"));
const ManageDepartments = lazy(() => import("./pages/hrdashboard/Departments/ManageDepartments"));
// import Home from "./pages/hrdashboard/home";
// import Tables from "./pages/hrdashboard/tables";
// import Notifications from "./pages/hrdashboard/notifications";
// import ManageEmployees from "./pages/hrdashboard/manage-employees/manageEmployees";
// import AttendenceTracker from "./pages/hrdashboard/Attendence/AttendenceTracker";
// import MyOffice from "./pages/hrdashboard/myOffice/MyOffice";
// import WorkStatus from "./pages/hrdashboard/workstatus/WorkStatus";
// import CompanyProducts from "./pages/hrdashboard/companyproducts/CompanyProducts";
// import OurClients from "./pages/hrdashboard/clients/OurClients";
// import Leave from "./pages/hrdashboard/leaves/Leave";
// import Settings from "./pages/hrdashboard/settings/Settings";
// import Communication from "./pages/hrdashboard/communication/communication";
// import Projects from "./pages/hrdashboard/projects/projects";
// import Logout from "./pages/hrdashboard/logout";
// import Profile from "./pages/hrdashboard/profile/Profile";
// import TaskManager from "./pages/hrdashboard/task manager/taskmanager";
// import LogRecord from "./pages/hrdashboard/logrecord/LogRecord";
// import MyLogRecord from "./pages/hrdashboard/mylogrecord/MylogRecord";
// import ManageDepartments from "./pages/hrdashboard/Departments/ManageDepartments";

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
        icon: <WalletIcon {...icon} />,
        name: "Manage Departments",
        path: "/manage-departments",
        element: <ManageDepartments />,
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
        icon: <ClipboardDocumentListIcon {...icon} />,
        name: "Manage Tasks",
        path: "/managetasks",
        element: <TaskManager />,
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
        icon: <CalendarDaysIcon {...icon} />,
        name: "Manage Log Record",
        path: "/logrecord",
        element: <LogRecord/>,
      },
      {
        icon: <CalendarDaysIcon {...icon} />,
        name: "My Log Record",
        path: "/mylogrecord",
        element: <MyLogRecord/>,
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
        element: <Logout />,
      },
    ],
  },
];

export default HRroutes;
