import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Typography, Progress, Avatar } from "@material-tailwind/react";

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    taskName: '',
    taskDescription: '',
    selectedMembers: [''], // Initial selected members with an empty string for the dropdown
    progress: 0
  });

  // Sample list of members (replace with actual data)
  const members = [
    { id: 1, name: 'John Doe', img: '/img/team-1.jpeg' },
    { id: 2, name: 'Jane Smith', img: '/img/team-2.jpeg' },
    { id: 3, name: 'Alex Johnson', img: '/img/team-3.jpeg' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTask = {
      id: Math.floor(Math.random() * 1000),
      taskName: formData.taskName,
      taskDescription: formData.taskDescription,
      assignedMembers: formData.selectedMembers.filter(member => member !== ''), // Filter out empty string members
      progress: formData.progress
    };
    setTasks([...tasks, newTask]);
    setFormData({
      taskName: '',
      taskDescription: '',
      selectedMembers: [''], // Reset selected members to include an empty string for the dropdown
      progress: 0
    });
  };

  const handleRemoveTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleAddMember = () => {
    setFormData({
      ...formData,
      selectedMembers: [...formData.selectedMembers, ''] // Add an empty string to the selected members array
    });
  };

  const handleMemberChange = (e, index) => {
    const updatedMembers = [...formData.selectedMembers];
    updatedMembers[index] = e.target.value;
    setFormData({
      ...formData,
      selectedMembers: updatedMembers
    });
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex items-center justify-between">
          <div className="flex items-center">
            <Typography variant="h6" color="white" className="mr-4">
              Task Manager
            </Typography>
          </div>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-bold uppercase text-blue-gray-400">Task Name:</label>
                <input
                  type="text"
                  name="taskName"
                  value={formData.taskName}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-bold uppercase text-blue-gray-400">Task Description:</label>
                <textarea
                  name="taskDescription"
                  value={formData.taskDescription}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-bold uppercase text-blue-gray-400">Assigned Members:</label>
                {formData.selectedMembers.map((member, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <select
                      name="selectedMember"
                      value={member}
                      onChange={(e) => handleMemberChange(e, index)}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                    >
                      <option value="">Select Member</option>
                      {members.map(member => (
                        <option key={member.id} value={member.name}>{member.name}</option>
                      ))}
                    </select>
                    {index === formData.selectedMembers.length - 1 && (
                      <button
                        type="button"
                        onClick={handleAddMember}
                        className="bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                      >
                        +
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            >
              Add Task
            </button>
          </form>
          <table className="w-full min-w-[640px] table-auto mt-8">
            <thead>
              <tr>
                <th className="border-b border-blue-gray-50 py-3 px-5 text-left">Task</th>
                <th className="border-b border-blue-gray-50 py-3 px-5 text-left">Members</th>
                <th className="border-b border-blue-gray-50 py-3 px-5 text-left">Progress</th>
                <th className="border-b border-blue-gray-50 py-3 px-5 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(({ id, taskName, taskDescription, assignedMembers, progress }) => (
                <tr key={id}>
                  <td className="border-b border-blue-gray-50 py-3 px-5">
                    <div>
                      <Typography className="font-semibold">{taskName}</Typography>
                      <Typography className="text-xs text-blue-gray-500">{taskDescription}</Typography>
                    </div>
                  </td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">
                    <div className="flex items-center gap-2">
                      {assignedMembers.map((member, index) => (
                        <Avatar
                          key={index}
                          src={members.find(m => m.name === member)?.img}
                          alt={member}
                          size="sm"
                          className="mr-2 relative z-10"
                          style={{ marginLeft: -index * 15 + 'px' }}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">
                    <div className="w-10/12">
                      <Typography
                        variant="small"
                        className="mb-1 block text-xs font-medium text-blue-gray-600"
                      >
                        {progress}%
                      </Typography>
                      <Progress
                        value={progress}
                        variant="gradient"
                        color={progress === 100 ? "green" : "gray"}
                        className="h-1"
                      />
                    </div>
                  </td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">
                    <button
                      onClick={() => handleRemoveTask(id)}
                      className="text-xs font-semibold text-red-600"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
};

export default TaskManager;
