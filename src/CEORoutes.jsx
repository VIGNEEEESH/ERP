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
  WalletIcon
} from "@heroicons/react/24/solid";
const Home = lazy(() => import('./pages/ceodashboard/home'));
const ManageEmployees = lazy(() => import('./pages/ceodashboard/manage-employees/manageEmployees'));
const AttendenceTracker = lazy(() => import('./pages/ceodashboard/Attendence/AttendenceTracker'));
const ManageDepartments = lazy(() => import('./pages/ceodashboard/Departments/ManageDepartments'));
const MyOffice = lazy(() => import('./pages/ceodashboard/myOffice/MyOffice'));
const Communication = lazy(() => import('./pages/ceodashboard/communication/communication'));
const WorkStatus = lazy(() => import('./pages/ceodashboard/workstatus/WorkStatus'));
const TaskManager = lazy(() => import('./pages/ceodashboard/task manager/taskmanager'));
const Projects = lazy(() => import('./pages/ceodashboard/projects/Projects'));
const CompanyProducts = lazy(() => import('./pages/ceodashboard/companyproducts/CompanyProducts'));
const OurClients = lazy(() => import('./pages/ceodashboard/clients/OurClients'));
const Leave = lazy(() => import('./pages/ceodashboard/leaves/Leave'));
const CEOProfile = lazy(() => import('./pages/ceodashboard/profile/CEOProfile'));
const Settings = lazy(() => import('./pages/ceodashboard/settings/Settings'));
const Logout = lazy(() => import('./pages/ceodashboard/logout'));
const LogRecord = lazy(() => import('./pages/ceodashboard/logrecord/LogRecord'));
const MyLogRecord = lazy(() => import('./pages/ceodashboard/mylogrecord/MylogRecord'));

const icon = {
  className: "w-5 h-5 text-inherit",
};
const CEORoutes = [
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
        icon: <WalletIcon {...icon} />,
        name: "Manage Departments",
        path: "/manage-departments",
        element: <ManageDepartments />,
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
        icon: <ClipboardDocumentListIcon {...icon} />,
        name: "Manage Tasks",
        path: "/managetasks",
        element: <TaskManager/>,
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
        name: "Employee Leave",
        path: "/employeeleaves",
        element: <Leave/>,
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
export default CEORoutes