import React, { useState } from 'react';
import {
    CardBody,
    Input,
    Button,
    CardHeader,
    Typography,
} from "@material-tailwind/react";
import { message } from 'antd';

const AddTaskForm = () => {
    const [formData, setFormData] = useState({
        taskName: '',
        taskDescription: '',
        selectedMembers: [''],
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
        console.log(formData); // For testing purposes

        // Add your form submission logic here
        try {
            // Example: Send form data to backend
            message.success(`Task "${formData.taskName}" added successfully`);
            // Reset form after successful submission
            setFormData({
                taskName: '',
                taskDescription: '',
                selectedMembers: [''],
            });
        } catch (error) {
            message.error(`Error adding task: ${error.message}`);
            console.error("Error submitting form:", error.message);
        }
    };

    return (
        <div >
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
                            <Input
                                type="text"
                                name="taskDescription"
                                value={formData.taskDescription}
                                onChange={handleInputChange}
                                label="Task Description"
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
                                            className="bg-gray-800 text-white px-3 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600 "
                                        >
                                            +
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <Button type="submit" className="mt-6">Add Task</Button>
                </form>
            </CardBody>
        </div>
    );
}

export default AddTaskForm;
