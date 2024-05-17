import React from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Tooltip,
  Progress,
} from "@material-tailwind/react";
import {
  EllipsisVerticalIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/outline";
import { StatisticsCard } from "@/widgets/cards";
import { StatisticsChart } from "@/widgets/charts";
import {
  statisticsCardsData,
  statisticsChartsData,
  projectsTableData,
  ordersOverviewData,
} from "@/data";
import { CalendarDaysIcon, ChartBarIcon, CheckCircleIcon, ClipboardDocumentCheckIcon, ClipboardDocumentIcon, ClipboardDocumentListIcon, ClockIcon, FolderIcon, UserCircleIcon, UserIcon, UsersIcon } from "@heroicons/react/24/solid";

export function Home() {
  return (
    <div className="mt-12">
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        <StatisticsCard
        title="Total Employees"
        icon={<UserCircleIcon className="w-8 h-8"/>}
        color="gray"
        value="50"
        />
        <StatisticsCard
        title="Employees Clocked In"
        icon={<UsersIcon className="w-8 h-8"/>}
        color="gray"
        value="50"
        />
        <StatisticsCard
        title="Projects Ongoing"
        icon={<ChartBarIcon className="w-8 h-8"/>}
        color="gray"
        value="50"
        />
        <StatisticsCard
        title="Tasks Pending"
        icon={<ClipboardDocumentListIcon className="w-8 h-8"/>}
        color="gray"
        value="50"
        />
        <StatisticsCard
        title="Total Clients"
        icon={<UserCircleIcon className="w-8 h-8"/>}
        color="gray"
        value="50"
        />
        <StatisticsCard
        title="Leaves Pending"
        icon={<CalendarDaysIcon className="w-8 h-8"/>}
        color="gray"
        value="50"
        />
        <StatisticsCard
        title="No of Products"
        icon={<FolderIcon className="w-8 h-8"/>}
        color="gray"
        value="50"
        />
        <StatisticsCard
        title="No of Departments"
        icon={<UserCircleIcon className="w-8 h-8"/>}
        color="gray"
        value="50"
        />
        <StatisticsCard
        title="People Avalible"
        icon={<UserIcon className="w-8 h-8"/>}
        color="gray"
        value="50"
        />
        <StatisticsCard
        title="Completed Projects"
        icon={<ClipboardDocumentCheckIcon className="w-8 h-8"/>}
        color="gray"
        value="50"
        />
      </div>
      <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
        {statisticsChartsData.map((props) => (
          <StatisticsChart
            key={props.title}
            {...props}
            footer={
              <Typography
                variant="small"
                className="flex items-center font-normal text-blue-gray-600"
              >
                <ClockIcon strokeWidth={2} className="h-4 w-4 text-blue-gray-400" />
                &nbsp;{props.footer}
              </Typography>
            }
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
