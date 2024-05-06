import React, { useState } from 'react';
import {
    CardBody,
    Input,
    Button,
    Avatar,
} from "@material-tailwind/react";
import { message } from 'antd';

const EditTaskForm = ({ taskData, onClose }) => {
    const [formData, setFormData] = useState({
        taskName: taskData.taskName,
        taskDescription: taskData.taskDescription,
        selectedMembers: taskData.assignedMembers,
    });

    const members = [
        { id: 1, name: 'John Doe', img: '/img/team-1.jpeg' },
        { id: 2, name: 'Jane Smith', img: '/img/team-2.jpeg' },
        { id: 3, name: 'Alex Johnson', img: '/img/team-3.jpeg' }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleMemberChange = (e, index) => {
        const updatedMembers = [...formData.selectedMembers];
        updatedMembers[index] = e.target.value;
        setFormData({
            ...formData,
            selectedMembers: updatedMembers,
        });
    };

    const handleAddMember = () => {
        setFormData({
            ...formData,
            selectedMembers: [...formData.selectedMembers, ''],
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Add your form submission logic here
        try {
            // Example: Send form data to backend
            message.success(`Task "${formData.taskName}" updated successfully`);
            // Close the edit form after successful submission
            onClose();
        } catch (error) {
            message.error(`Error updating task: ${error.message}`);
            console.error("Error submitting form:", error.message);
        }
    };

    return (
        <div className="mt-4 mb-8">
            <CardBody>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <Input
                                type="text"
                                name="taskName"
                                value={formData.taskName}
                                onChange={handleInputChange}
                                label="Task Name"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-blue-gray-500">Task Description</label>
                            <textarea
                                name="taskDescription"
                                value={formData.taskDescription}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-blue-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-blue-gray-500">Assigned Members</label>
                            {formData.selectedMembers.map((member, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <select
                                        name="selectedMember"
                                        value={member}
                                        onChange={(e) => handleMemberChange(e, index)}
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
                    <div className="flex justify-between mt-4">
                        <Button type="submit">Update Task</Button>
                        <Button onClick={onClose} color="red">Cancel</Button>
                    </div>
                </form>
            </CardBody>
        </div>
    );
}

export default EditTaskForm;
