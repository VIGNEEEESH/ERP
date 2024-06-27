import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/pages/auth/Auth-context";
import { message } from 'antd';
import Kanban from './Kanban';

function EmployeeTasks() {
  const auth = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/task/get/tasks/byemail/${auth.email}`, {
          headers: { Authorization: "Bearer " + auth.token }
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch tasks data: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched tasks:", data.tasks); // Add log to check fetched tasks
        setTasks(data.tasks);
      } catch (error) {
        message.error("Error fetching tasks data: " + error.message);
      }
    };

    fetchTasks();
  }, [auth.email, auth.token]);

  return (
    <Kanban tasks={tasks} />
  );
}

export default EmployeeTasks;
