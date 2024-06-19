import React from 'react';

const TaskCard = ({ task }) => {
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('id', task.id);
      }}
      className="border border-gray-300 rounded-lg p-4 m-2 bg-white shadow-lg hover:shadow-xl transition-shadow duration-200"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-lg text-gray-800">{task.taskName}</h3>
      </div>
      <p className="text-gray-600 mb-4">{task.taskDescription}</p>
      <p className="text-gray-500 text-sm">Deadline: {task.deadline}</p>
    </div>
  );
};

export default TaskCard;
