import React, { useContext, useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import { AuthContext } from "@/pages/auth/Auth-context";
import { message } from 'antd';

function EmployeeTasks() {
  const auth = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // Fetch tasks data
        const tasksResponse = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/task/get/tasks/byemail/${auth.email}`);
        if (!tasksResponse.ok) {
          throw new Error(`Failed to fetch tasks data: ${tasksResponse.status}`);
        }
        const tasksData = await tasksResponse.json();
        setTasks(tasksData.tasks);
        
      } catch (error) {
        message.error("Error fetching tasks data", error.message);
      }
    };

    fetchTasks();
  }, [auth.email]);

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Your Tasks
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                  <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                    task Initials
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                  <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                    Start Date
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                  <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                    Deadline
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                  <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                    Description
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                  <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                    Team
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                  <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                    Progress
                  </Typography>
                </th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td className="py-3 px-5">
                    <Typography className="text-xs font-normal text-blue-gray-500">
                      {task.taskName}
                    </Typography>
                  </td>
                  <td className="py-3 px-5">
                    <Typography className="text-xs font-normal text-blue-gray-500">
                      {task.assignedDate}
                    </Typography>
                  </td>
                  <td className="py-3 px-5">
                    <Typography className="text-xs font-normal text-blue-gray-500">
                      {task.deadline}
                    </Typography>
                  </td>
                  <td className="py-3 px-5">
                    <Typography className="text-xs font-normal text-blue-gray-500">
                      {task.taskDescription}
                    </Typography>
                  </td>
                  <td className="py-3 px-5">
  <Typography className="text-xs font-normal text-blue-gray-500">
    {task.members.join(", ")}
  </Typography>
</td>
<td className="py-3 px-5">
                    <Typography className="text-xs font-normal text-blue-gray-500">
                      {task.progress}
                    </Typography>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}

export default EmployeeTasks;
