import React from 'react';

const LowIcon = (
  <svg
    className="w-6 h-6 text-green-500"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7" />
  </svg>
);

const MediumIcon = (
  <svg
    className="w-6 h-6 text-yellow-500"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h14" />
  </svg>
);

const HighIcon = (
  <svg
    className="w-6 h-6 text-red-500"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m5 15 7-7 7 7" />
  </svg>
);

const TaskCard = ({ task }) => {
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("id", task.id);
      }}
      className="border border-gray-900 rounded-lg px-2 m-2 bg-white"
    >
      <div className='flex justify-between'>
        <div className='text-base font-base py-2'>
          {task.title}
        </div>
      </div>
      <div className="text-xs">
        {task.desc}
      </div>
      <div className='text-xs flex justify-between py-2 text-gray-600'>
        <div>{task.id}</div>
        <div className="capitalize">
          {task.priority === 'high' && HighIcon}
          {task.priority === 'medium' && MediumIcon}
          {task.priority === 'low' && LowIcon}
        </div>
      </div>
      <div className="text-xs text-gray-600">
        Deadline: {task.deadline || '20-07-2024'}
      </div>
    </div>
  );
};

export default TaskCard;
