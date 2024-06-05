import React, { useContext, useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import { AuthContext } from "@/pages/auth/Auth-context";
import { message } from 'antd';

function EmployeeProjects() {
  const auth = useContext(AuthContext);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Fetch projects data
        const projectsResponse = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/project/get/projects/byemail/${auth.email}`, { 
          headers: { Authorization: "Bearer " + auth.token } 
        });
        if (!projectsResponse.ok) {
          throw new Error(`Failed to fetch projects data: ${projectsResponse.status}`);
        }
        const projectsData = await projectsResponse.json();
        setProjects(projectsData.projects);
      } catch (error) {
        message.error("Error fetching projects data: " + error.message);
      }
    };

    fetchProjects();
  }, [auth.email]);

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Your Projects
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                <th className="border-b border-blue-gray-50 py-3 px-5 text-left w-1/12">
                  <Typography variant="small" className="text-[12px] font-bold uppercase text-blue-gray-400">
                    Project Title
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-50 py-3 px-5 text-left w-1/12">
                  <Typography variant="small" className="text-[12px] font-bold uppercase text-blue-gray-400">
                    Start Date
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-50 py-3 px-5 text-left w-1/12">
                  <Typography variant="small" className="text-[12px] font-bold uppercase text-blue-gray-400">
                    Deadline
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-50 py-3 px-5 text-left w-2/12">
                  <Typography variant="small" className="text-[12px] font-bold uppercase text-blue-gray-400">
                    Description
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-50 py-3 px-5 text-left w-1/12">
                  <Typography variant="small" className="text-[12px] font-bold uppercase text-blue-gray-400">
                    Team
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-50 py-3 px-5 text-left w-1/12">
                  <Typography variant="small" className="text-[12px] font-bold uppercase text-blue-gray-400">
                    Progress
                  </Typography>
                </th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <td className="text-[12px] py-3 px-5 truncate">
                    <Typography className="text-xs font-normal text-blue-gray-500">
                      {project.projectName}
                    </Typography>
                  </td>
                  <td className="text-[12px] py-3 px-5 truncate">
                    <Typography className="text-xs font-normal text-blue-gray-500">
                      {project.assignedDate}
                    </Typography>
                  </td>
                  <td className="text-[12px] py-3 px-5 truncate">
                    <Typography className="text-xs font-normal text-blue-gray-500">
                      {project.deadline}
                    </Typography>
                  </td>
                  <td className="text-[12px] py-3 px-5 truncate w-48">
                    <Typography className="text-xs font-normal text-blue-gray-500">
                      {project.projectDescription}
                    </Typography>
                  </td>
                  <td className="text-[12px] py-3 px-5 truncate w-48">
                    <Typography className="text-xs font-normal text-blue-gray-500">
                      {project.members.join(", ")}
                    </Typography>
                  </td>
                  <td className="text-[12px] py-3 px-5 truncate">
                    <Typography className="text-xs font-normal text-blue-gray-500">
                      {project.progress}
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

export default EmployeeProjects;
