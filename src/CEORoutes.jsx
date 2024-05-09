// import {
//   HomeIcon,
//   UserCircleIcon,
//   BuildingOfficeIcon,
//   BriefcaseIcon,
//   CalendarDaysIcon,
//   CubeIcon,
//   UserIcon,
//   CalendarIcon,
//   Cog6ToothIcon,
//   ArrowRightOnRectangleIcon,
//   ChatBubbleLeftRightIcon,
//   DocumentTextIcon,
//   ClipboardDocumentListIcon,
//   WalletIcon
// } from "@heroicons/react/24/solid";
// import Logout from "./pages/ceodashboard/logout";
// import ManageEmployees from "./pages/ceodashboard/manage-employees/manageEmployees";
// import AttendenceTracker from "./pages/ceodashboard/Attendence/AttendenceTracker";
// import Communication from "./pages/ceodashboard/communication/communication";
// import WorkStatus from "./pages/ceodashboard/workstatus/WorkStatus";
// import CompanyProducts from "./pages/ceodashboard/companyproducts/CompanyProducts";
// import MyOffice from "./pages/ceodashboard/myOffice/MyOffice";
// import OurClients from "./pages/ceodashboard/clients/OurClients";
// import Leave from "./pages/ceodashboard/leaves/Leave";
// import CEOProfile from "./pages/ceodashboard/profile/CEOProfile";
// import Settings from "./pages/ceodashboard/settings/Settings";
// import Projects from "./pages/ceodashboard/projects/Projects";
// import TaskManager from "./pages/ceodashboard/task manager/taskmanager";
// import Home from "./pages/ceodashboard/home";
// import ManageDepartments from "./pages/ceodashboard/Departments/ManageDepartments";
// const icon = {
//   className: "w-5 h-5 text-inherit",
// };

// export const CEORoutes = [
//   {
//     layout: "ceo/dashboard",
//     pages: [
//       {
//         icon: <HomeIcon {...icon} />,
//         name: "dashboard",
//         path: "/home",
//         element: <Home />,
//       },
//       {
//         icon: <UserCircleIcon {...icon} />,
//         name: "Manage Employees",
//         path: "/manage-employees",
//         element: <ManageEmployees />,
//       },
//       {
//         icon: <CalendarDaysIcon {...icon} />,
//         name: "Attendence Tracker",
//         path: "/attendence-tracker",
//         element: <AttendenceTracker />,
//       },
//       {
//         icon: <WalletIcon {...icon} />,
//         name: "Manage Departments",
//         path: "/manage-departments",
//         element: <ManageDepartments />,
//       },
//       {
//         icon: <BuildingOfficeIcon {...icon} />,
//         name: "My Office",
//         path: "/my-office",
//         element: <MyOffice/>,
//       },
//       {
//         icon: <ChatBubbleLeftRightIcon {...icon} />,
//         name: "Communication",
//         path: "/communication",
//         element: <Communication />,
//       },
//       {
//         icon: <BriefcaseIcon {...icon} />,
//         name: "Work Status",
//         path: "/workstatus",
//         element: <WorkStatus />,
//       },
//       {
//         icon: <ClipboardDocumentListIcon {...icon} />,
//         name: "Manage Tasks",
//         path: "/managetasks",
//         element: <TaskManager/>,
//       },
//       {
//         icon: <DocumentTextIcon {...icon} />,
//         name: "Our Projects",
//         path: "/projects",
//         element: <Projects/>,
//       },
//       {
//         icon: <CubeIcon {...icon} />,
//         name: "Company products",
//         path: "/companyproducts",
//         element: <CompanyProducts/>,
//       },
//       {
//         icon: <UserIcon {...icon} />,
//         name: "Our Clients",
//         path: "/ourclients",
//         element: <OurClients/>,
//       },
//       {
//         icon: <CalendarIcon {...icon} />,
//         name: "Employee Leave",
//         path: "/employeeleaves",
//         element: <Leave/>,
//       },
//       {
//         icon: <UserCircleIcon {...icon} />,
//         name: "profile",
//         path: "/profile",
//         element: <CEOProfile/>,
//       },
//       {
//         icon: <Cog6ToothIcon {...icon} />,
//         name: "settings",
//         path: "/settings",
//         element: <Settings/>,
//       },
//       {
//         icon: <ArrowRightOnRectangleIcon {...icon} />,
//         name: "Logout",
//         path: "/logout",
//         element: <Logout/>,
//       },
//     ],
//   },
// ];

// export default CEORoutes;
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