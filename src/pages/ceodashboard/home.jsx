import React, { useContext, useEffect, useState } from "react";
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
import {
  CalendarDaysIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  FolderIcon,
  UserCircleIcon,
  UserIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import { AuthContext } from "../auth/Auth-context";
import { message } from "antd";

export function Home() {
  const auth = useContext(AuthContext);
  const [employees, setEmployees] = useState([]);
  const [clients, setClients] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [products, setProducts] = useState([]);
  const [departments, setDepartments] = useState([]);
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split("T")[0];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeeResponse = await fetch(
          `${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/user/get/all/users`,
          { headers: { Authorization: "Bearer " + auth.token } }
        );
        const clientResponse = await fetch(
          `${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/client/get/all/clients`,
          { headers: { Authorization: "Bearer " + auth.token } }
        );
        const clockInEmployeeResponse = await fetch(
          `${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/attendance/get/attendance/bydate/${formattedDate}`,
          { headers: { Authorization: "Bearer " + auth.token } }
        );
        const projectResponse = await fetch(
          `${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/project/get/all/projects`,
          { headers: { Authorization: "Bearer " + auth.token } }
        );
        const productResponse = await fetch(
          `${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/product/get/all/products`,
          { headers: { Authorization: "Bearer " + auth.token } }
        );
        const taskResponse = await fetch(
          `${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/task/get/all/tasks`,
          { headers: { Authorization: "Bearer " + auth.token } }
        );
        const leaveResponse = await fetch(
          `${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/leave/get/all/leaves`,
          { headers: { Authorization: "Bearer " + auth.token } }
        );
        const departmentResponse = await fetch(
          `${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/department/get/all/departments`,
          { headers: { Authorization: "Bearer " + auth.token } }
        );

        if (
          !employeeResponse.ok ||
          !clientResponse.ok ||
          !clockInEmployeeResponse.ok ||
          !projectResponse.ok ||
          !taskResponse.ok ||
          !leaveResponse.ok ||
          !productResponse.ok ||
          !departmentResponse.ok
        ) {
          throw new Error("Failed to fetch data");
        }

        const employeeData = await employeeResponse.json();
        const clientData = await clientResponse.json();
        const clockInEmployeeData = await clockInEmployeeResponse.json();
        const projectData = await projectResponse.json();
        const productData = await productResponse.json();
        const taskData = await taskResponse.json();
        const leaveData = await leaveResponse.json();
        const departmentData = await departmentResponse.json();

        setEmployees(employeeData.users);
        setClients(clientData.clients);
        setAttendance(clockInEmployeeData.attendance);
        setProjects(projectData.projects);
        setTasks(taskData.tasks);
        setLeaves(leaveData.leaves);
        setProducts(productData.products);
        setDepartments(departmentData.departments);
      } catch (err) {
        message.error("Error fetching data", err.message);
      }
    };
    fetchData();
  }, [auth.token]);

  return (
    <div className="mt-12">
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        <StatisticsCard
          title="Total Employees"
          icon={<UserCircleIcon className="w-8 h-8" />}
          color="gray"
          value={employees.length}
        />
        <StatisticsCard
          title="Employees Clock In"
          icon={<UsersIcon className="w-8 h-8" />}
          color="gray"
          value={attendance.filter((a) => !a.loggedOutTime).length}
        />
        <StatisticsCard
          title="Projects Ongoing"
          icon={<ChartBarIcon className="w-8 h-8" />}
          color="gray"
          value={projects.filter((project) => project.progress !== 100).length}
        />
        <StatisticsCard
          title="Tasks Pending"
          icon={<ClipboardDocumentListIcon className="w-8 h-8" />}
          color="gray"
          value={tasks.filter((task) => task.progress !== 100).length}
        />
        <StatisticsCard
          title="Tasks Completed"
          icon={<ClipboardDocumentListIcon className="w-8 h-8" />}
          color="gray"
          value={tasks.filter((task) => task.progress === 100).length}
        />
        <StatisticsCard
          title="Total Clients"
          icon={<UserCircleIcon className="w-8 h-8" />}
          color="gray"
          value={clients.length}
        />
        <StatisticsCard
          title="Leaves Pending"
          icon={<CalendarDaysIcon className="w-8 h-8" />}
          color="gray"
          value={leaves.filter((leave) => leave.status !== "Approved").length}
        />
        <StatisticsCard
          title="No of Products"
          icon={<FolderIcon className="w-8 h-8" />}
          color="gray"
          value={products.length}
        />
        <StatisticsCard
          title="No of Departments"
          icon={<UserCircleIcon className="w-8 h-8" />}
          color="gray"
          value={departments.length}
        />
        <StatisticsCard
          title="People Available"
          icon={<UserIcon className="w-8 h-8" />}
          color="gray"
          value={attendance.filter((a) => a.workStatus === "Available").length}
        />
        <StatisticsCard
          title="Completed Projects"
          icon={<ClipboardDocumentCheckIcon className="w-8 h-8" />}
          color="gray"
          value={projects.filter((project) => project.progress === 100).length}
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
