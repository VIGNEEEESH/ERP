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
import { CalendarDaysIcon, ChartPieIcon, CheckCircleIcon, ClipboardDocumentIcon, ClockIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { AuthContext } from "../auth/Auth-context";
import { message } from "antd";

export function Home() {
  const auth=useContext(AuthContext)
  const [department,setDepartment]=useState([])
  const [projects,setProjects]=useState([])
  const [leaves,setLeaves]=useState([])
  const [tasks,setTasks]=useState([])

  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split("T")[0];
  useEffect(()=>{
    const fetchData=async()=>{
      try{
    const departmentResponse=await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/department/get/department/byuserid/${auth.userId}`,{headers:{Authorization:"Bearer "+auth.token}})
    const projectResponse=await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/project/get/projects/byEmail/${auth.email}`,{headers:{Authorization:"Bearer "+auth.token}})
    const taskResponse=await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/task/get/tasks/byemail/${auth.email}`,{headers:{Authorization:"Bearer "+auth.token}})
    const leaveResponse=await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/leave/get/leave/byemail/${auth.email}`,{headers:{Authorization:"Bearer "+auth.token}})
    

    if (!departmentResponse.ok || !projectResponse.ok || !leaveResponse.ok|| !taskResponse.ok) {
      throw new Error(`Failed to fetch data`);
  }
  const departmentData = await departmentResponse.json();
  const projectData = await projectResponse.json();
  const leaveData = await leaveResponse.json();
  const taskData = await taskResponse.json();

  
  setDepartment(departmentData.department);
  setProjects(projectData.projects);
  setLeaves(leaveData.leaves);
  setTasks(taskData.tasks);
 
    }  catch(err){
      message.error("Error fetching data", err.message);
    }
  }
    fetchData()
  },[auth.token])
  return (
    <div className="mt-12">
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
      <StatisticsCard
    title="Department Name"
    icon={<ChartPieIcon className="w-8 h-8"/>}
    color="gray"
    value={department.map(dept => dept.departmentName).join(', ')}
/>

       <StatisticsCard
        title="Projects Involved"
        icon={<UserCircleIcon className="w-8 h-8"/>}
        color="gray"
        value={projects.length}
        />
        <StatisticsCard
        title="Pending Leaves"
        icon={<CalendarDaysIcon className="w-8 h-8"/>}
        color="gray"
        value={leaves.filter(leave => leave.status !="Approved").length}
        />
        <StatisticsCard
        title="Tasks Pending"
        icon={<ClipboardDocumentIcon className="w-8 h-8"/>}
        color="gray"
        value={tasks.filter(task => task.progress !=100).length}
        />
        <StatisticsCard
        title="Tasks Completed"
        icon={<ClipboardDocumentIcon className="w-8 h-8"/>}
        color="gray"
        value={tasks.filter(task => task.progress ==100).length}
        />
        <StatisticsCard
        title="Projects Pending"
        icon={<ChartPieIcon className="w-8 h-8"/>}
        color="gray"
        value={projects.filter(project => project.progress !=100).length}
        />
        <StatisticsCard
        title="Projects Completed"
        icon={<ChartPieIcon className="w-8 h-8"/>}
        color="gray"
        value={projects.filter(project => project.progress ==100).length}
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
      <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 flex items-center justify-between p-6"
          >
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-1">
                Projects
              </Typography>
              <Typography
                variant="small"
                className="flex items-center gap-1 font-normal text-blue-gray-600"
              >
                <CheckCircleIcon strokeWidth={3} className="h-4 w-4 text-blue-gray-200" />
                <strong>30 done</strong> this month
              </Typography>
            </div>
            <Menu placement="left-start">
              <MenuHandler>
                <IconButton size="sm" variant="text" color="blue-gray">
                  <EllipsisVerticalIcon
                    strokeWidth={3}
                    fill="currenColor"
                    className="h-6 w-6"
                  />
                </IconButton>
              </MenuHandler>
              <MenuList>
                <MenuItem>Action</MenuItem>
                <MenuItem>Another Action</MenuItem>
                <MenuItem>Something else here</MenuItem>
              </MenuList>
            </Menu>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["companies", "members", "budget", "completion"].map(
                    (el) => (
                      <th
                        key={el}
                        className="border-b border-blue-gray-50 py-3 px-6 text-left"
                      >
                        <Typography
                          variant="small"
                          className="text-[11px] font-medium uppercase text-blue-gray-400"
                        >
                          {el}
                        </Typography>
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {projectsTableData.map(
                  ({ img, name, members, budget, completion }, key) => {
                    const className = `py-3 px-5 ${
                      key === projectsTableData.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                    }`;

                    return (
                      <tr key={name}>
                        <td className={className}>
                          <div className="flex items-center gap-4">
                            <Avatar src={img} alt={name} size="sm" />
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-bold"
                            >
                              {name}
                            </Typography>
                          </div>
                        </td>
                        <td className={className}>
                          {members.map(({ img, name }, key) => (
                            <Tooltip key={name} content={name}>
                              <Avatar
                                src={img}
                                alt={name}
                                size="xs"
                                variant="circular"
                                className={`cursor-pointer border-2 border-white ${
                                  key === 0 ? "" : "-ml-2.5"
                                }`}
                              />
                            </Tooltip>
                          ))}
                        </td>
                        <td className={className}>
                          <Typography
                            variant="small"
                            className="text-xs font-medium text-blue-gray-600"
                          >
                            {budget}
                          </Typography>
                        </td>
                        <td className={className}>
                          <div className="w-10/12">
                            <Typography
                              variant="small"
                              className="mb-1 block text-xs font-medium text-blue-gray-600"
                            >
                              {completion}%
                            </Typography>
                            <Progress
                              value={completion}
                              variant="gradient"
                              color={completion === 100 ? "green" : "blue"}
                              className="h-1"
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </CardBody>
        </Card>
        <Card className="border border-blue-gray-100 shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 p-6"
          >
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Orders Overview
            </Typography>
            <Typography
              variant="small"
              className="flex items-center gap-1 font-normal text-blue-gray-600"
            >
              <ArrowUpIcon
                strokeWidth={3}
                className="h-3.5 w-3.5 text-green-500"
              />
              <strong>24%</strong> this month
            </Typography>
          </CardHeader>
          <CardBody className="pt-0">
            {ordersOverviewData.map(
              ({ icon, color, title, description }, key) => (
                <div key={title} className="flex items-start gap-4 py-3">
                  <div
                    className={`relative p-1 after:absolute after:-bottom-6 after:left-2/4 after:w-0.5 after:-translate-x-2/4 after:bg-blue-gray-50 after:content-[''] ${
                      key === ordersOverviewData.length - 1
                        ? "after:h-0"
                        : "after:h-4/6"
                    }`}
                  >
                    {React.createElement(icon, {
                      className: `!w-5 !h-5 ${color}`,
                    })}
                  </div>
                  <div>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="block font-medium"
                    >
                      {title}
                    </Typography>
                    <Typography
                      as="span"
                      variant="small"
                      className="text-xs font-medium text-blue-gray-500"
                    >
                      {description}
                    </Typography>
                  </div>
                </div>
              )
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default Home;
