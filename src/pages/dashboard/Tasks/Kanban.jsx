import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './Kanban.css';
import TaskCard from './TaskCard';
import { statuses } from './data_task';
import db from './db.json';

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

function Kanban() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Initialize the tasks state with data from db.json
    setTasks(db.tasks);
  }, []);

  const updateTask = (updatedTask) => {
    const updatedTasks = tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task));
    setTasks(updatedTasks);
  };

  const handleDrop = (e, status) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('id');
    const updatedTask = tasks.find((task) => task.id === taskId);
    if (updatedTask) {
      updateTask({ ...updatedTask, status });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData('id', id);
  };

  const downloadTasksAsPdf = () => {
    const doc = new jsPDF();
    const tableColumn = ['ID', 'Title', 'Description', 'Status', 'Priority'];
    const tableRows = tasks.map((task) => [
      task.id,
      task.title,
      task.description,
      task.status,
      task.priority || 'low', // Default priority if not specified
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
                <h1 className="text-xl capitalize font-bold text-gray-200"> {status}</h1>
              </div>
              <div className="h-full">
                {tasks
                  .filter((task) => task.status === status)
                  .map((task) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
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
}

export default Kanban;
