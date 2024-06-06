
import { lazy } from 'react';
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
  PresentationChartLineIcon,
  BuildingOfficeIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/solid";
const Home = lazy(() => import('@/pages/deptheaddashboard/Home'));
const Notifications = lazy(() => import('@/pages/dashboard/Notifications'));
const LeaveRequests = lazy(() => import('./pages/deptheaddashboard/leaverequest'));
const Logout = lazy(() => import('./pages/deptheaddashboard/logout'));
const CompanyProducts = lazy(() => import('./pages/deptheaddashboard/companyproducts/CompanyProducts'));
const Profile = lazy(() => import('./pages/deptheaddashboard/profile'));
const MyOffice = lazy(() => import('./pages/deptheaddashboard/myoffice'));
const Settings = lazy(() => import('./pages/deptheaddashboard/settings/Settings'));
const TaskManager = lazy(() => import('./pages/deptheaddashboard/task manager/taskmanager'));
const Communication = lazy(() => import('./pages/deptheaddashboard/communication/communication'));
const Projects = lazy(() => import('./pages/deptheaddashboard/projects/projects'));
const WorkStatus = lazy(() => import('./pages/deptheaddashboard/workstatus/WorkStatus'));
const MyLogRecord = lazy(() => import("./pages/deptheaddashboard/mylogrecord/MylogRecord"));
// import Home from '@/pages/deptheaddashboard/Home';
// import Notifications from '@/pages/dashboard/Notifications';
// import LeaveRequests from './pages/deptheaddashboard/leaverequest';
// import Logout from './pages/deptheaddashboard/logout';
// import CompanyProducts from './pages/deptheaddashboard/companyproducts/CompanyProducts';
// import Profile from './pages/deptheaddashboard/profile';
// import MyOffice from './pages/deptheaddashboard/myoffice';
// import Settings from './pages/deptheaddashboard/settings/Settings';
// import TaskManager from './pages/deptheaddashboard/task manager/taskmanager';
// import Communication from './pages/deptheaddashboard/communication/communication';
// import Projects from './pages/deptheaddashboard/projects/projects';
// import WorkStatus from './pages/deptheaddashboard/workstatus/WorkStatus';
// import MyLogRecord from './pages/deptheaddashboard/mylogrecord/MylogRecord';
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
        icon: <BuildingOfficeIcon {...icon} />,
        name: "Work Status",
        path: "/workstatus",
        element: <WorkStatus />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "Manage Projects",
        path: "/projects",
        element: <Projects/>,
      },
      {
        icon: <PresentationChartLineIcon {...icon} />,
        name: "Task Manager",
        path: "/managetask",
        element: <TaskManager/>,
      },
      {
        icon: <CursorArrowRaysIcon {...icon} />,
        name: "Leave",
        path: "/leave",
        element: <LeaveRequests />,
      },
      {
        icon: <CubeIcon {...icon} />,
        name: "Company Products",
        path: "/product",
        element: <CompanyProducts />,
      },
      {
        icon: <ChatBubbleOvalLeftEllipsisIcon {...icon} />,
        name: "Communication",
        path: "/communication",
        element: <Communication />,
      },
      {
        icon: <CalendarDaysIcon {...icon} />,
        name: "My Log Record",
        path: "/mylogrecord",
        element: <MyLogRecord/>,
      },
      {
        icon: <BellAlertIcon {...icon} />,
        name: "notifications",
        path: "/notifications",
        element: <Notifications />,
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
