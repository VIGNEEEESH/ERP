import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/pages/auth/Auth-context";
import { message } from 'antd';
import Kanban from './Kanban';

function EmployeeTasks() {
  const auth = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);

  // useEffect(() => {
  //   const fetchTasks = async () => {
  //     try {
  //       const tasksResponse = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/task/get/tasks/byemail/${auth.email}`, {
  //         headers: { Authorization: "Bearer " + auth.token }
  //       });
  //       if (!tasksResponse.ok) {
  //         throw new Error(`Failed to fetch tasks data: ${tasksResponse.status}`);
  //       }
  //       const tasksData = await tasksResponse.json();
  //       setTasks(tasksData.tasks);
  //     } catch (error) {
  //       message.error("Error fetching tasks data: " + error.message);
  //     }
  //   };

  //   fetchTasks();
  // }, [auth.email, auth.token]);

  useEffect(() => {
    // Dummy tasks for testing
    const dummyTasks = [
      {
        id: 'CP-1',
        taskName: 'Dummy Task 1',
        taskDescription: 'Description for Dummy Task 1',
        status: 'todo',
        priority: 'medium',
        deadline: '2024-06-30',
      },
      {
        id: 'CP-2',
        taskName: 'Dummy Task 2',
        taskDescription: 'Description for Dummy Task 2',
        status: 'in-progress',
        priority: 'high',
        deadline: '2024-07-15',
      },
      {
        id: 'CP-3',
        taskName: 'Dummy Task 3',
        taskDescription: 'Description for Dummy Task 3',
        status: 'done',
        priority: 'low',
        deadline: '2024-06-25',
      },
    ];

    setTasks(dummyTasks);
  }, []); // Empty dependency array to run once on mount

  return (
    <Kanban tasks={tasks} />
  );
}

export default EmployeeTasks;
