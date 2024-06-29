import { useContext, useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './Kanban.css';
import TaskCard from './TaskCard';
import { AuthContext } from '@/pages/auth/Auth-context';

const statuses = ['todo', 'inprogress', 'completed'];
const BoardIcon = (
  <svg
    className="w-10 h-10 text-blue-300"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      fillRule="evenodd"
      d="M8 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1h2a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2Zm6 1h-4v2H9a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2h-1V4Zm-3 8a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1Zm-2-1a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H9Zm2 5a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1Zm-2-1a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H9Z"
      clipRule="evenodd"
    />
  </svg>
);

const Kanban = ({ tasks }) => {
  const [columns, setColumns] = useState({
    todo: [],
    inprogress: [],
    completed: []
  });
  const auth=useContext(AuthContext)

  useEffect(() => {
    const initializeColumns = () => {
      const columnsData = {
        todo: tasks.filter(task => task.progress === 'To Do'),
        inprogress: tasks.filter(task => task.progress === 'In Progress'),
        completed: tasks.filter(task => task.progress === 'Completed')
      };
      setColumns(columnsData);
    };

    initializeColumns();
  }, [tasks]);

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData('id', id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('id');
    const updatedTask = tasks.find((task) => task._id === taskId);
    const oldStatus = updatedTask.progress;

    if (updatedTask && updatedTask.progress !== newStatus) {
      const newStatusFormatted = {
        todo: 'To Do',
        inprogress: 'In Progress',
        completed: 'Completed'
      }[newStatus];

      updatedTask.progress = newStatusFormatted;
      setColumns((prevColumns) => ({
        ...prevColumns,
        [newStatus]: [...prevColumns[newStatus], updatedTask],
        [oldStatus.toLowerCase().replace(/\s/g, '')]: prevColumns[oldStatus.toLowerCase().replace(/\s/g, '')].filter(
          (task) => task._id !== taskId
        ),
      }));

      try {
        const response = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/task/update/taskprogress/byid/${taskId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json', Authorization: "Bearer " + auth.token,
          },
          body: JSON.stringify({ progress: newStatusFormatted }),
        });

        if (!response.ok) {
          throw new Error('Failed to update task status');
        }
      } catch (error) {
        console.error('Error updating task status:', error);
      }
    }
  };

  const downloadTasksAsPdf = () => {
    const doc = new jsPDF();
    const tableColumn = ['ID', 'Title', 'Description', 'Status', 'Priority'];
    const tableRows = tasks.map((task) => [
      task._id,
      task.taskName,
      task.taskDescription,
      task.progress,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
    });

    doc.save('kanban_tasks.pdf');
  };

  return (
    <div className="my-4 mx-2">
      <h1 className="flex bg-gray-900 text-2xl mb-8 p-6 text-gray-200 font-bold rounded-lg">
        My Tasks
        <button
          className="ml-auto px-4 text-xs py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={downloadTasksAsPdf}
        >
          Download Tasks as PDF
        </button>
      </h1>
      <div className="grid grid-cols-3 gap-4">
        {statuses.map((status) => (
          <div
            key={status}
            onDrop={(e) => handleDrop(e, status)}
            onDragOver={handleDragOver}
            className="relative"
          >
            <div className="border rounded-lg">
              <div className="flex rounded-lg bg-gray-900 items-center justify-between p-2">
                <h1 className="text-xl capitalize font-bold text-gray-200">{status}</h1>
                {BoardIcon}
              </div>
              <div className="h-full">
                {columns[status]?.map((task) => (
                  <div
                    key={task._id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task._id)}
                  >
                    <TaskCard task={task} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Kanban;
