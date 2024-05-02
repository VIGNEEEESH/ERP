import React, { useState } from 'react';
import { Button, Input, Select, CardFooter } from "@material-tailwind/react";

const AddProject = ({ onAddProject }) => {
    const [projectName, setProjectName] = useState('');
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [budget, setBudget] = useState('');
    const [progress, setProgress] = useState(0);

    // Sample members data
    const sampleMembers = [
        { id: 1, name: "John Doe" },
        { id: 2, name: "Jane Doe" },
        { id: 3, name: "Alice Smith" },
        { id: 4, name: "Bob Smith" }
    ];

    const toggleMember = (memberId) => {
        const index = selectedMembers.findIndex(member => member.id === memberId);
        if (index !== -1) {
            setSelectedMembers(selectedMembers.filter(member => member.id !== memberId));
        } else {
            const member = sampleMembers.find(member => member.id === memberId);
            setSelectedMembers([...selectedMembers, member]);
        }
    };

    const removeMember = (memberId) => {
        setSelectedMembers(selectedMembers.filter(member => member.id !== memberId));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newProject = {
            name: projectName,
            members: selectedMembers,
            budget,
            completion: progress
        };
        onAddProject(newProject);
        setProjectName('');
        setSelectedMembers([]);
        setBudget('');
        setProgress(0);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-4 p-6">
                <Input
                    type="text"
                    label="Project Name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                />
                <Select
                    multiple
                    value={selectedMembers.map(member => member.id)} // Use member id as value
                    onChange={(e) => setSelectedMembers(sampleMembers.filter(member => e.target.value.includes(member.id)))} // Filter members by id
                    label='Select Members'>
                    {sampleMembers.map(member => (
                        <option key={member.id} value={member.id} onClick={() => toggleMember(member.id)} className='cursor-pointer'>
                            {member.name}
                        </option> // Use member id as value
                    ))}
                </Select>
                <div>
                    <p>Selected Members:</p>
                    <ul className="flex flex-wrap gap-2">
                        {selectedMembers.map((member, index) => (
                            <li key={index} className="bg-gray-600 text-white rounded p-2 flex items-center">
                                <span>{member.name}</span>
                                <button onClick={() => removeMember(member.id)} className="ml-1 focus:outline-none">&times;</button>
                            </li>
                        ))}
                    </ul>
                </div>
                <Input
                    type="text"
                    label="Budget"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                />
                <Input
                    type="number"
                    label="Progress (0-100)"
                    value={progress}
                    onChange={(e) => setProgress(parseInt(e.target.value))}
                />
            </div>
            <CardFooter>
                <Button  onClick={handleSubmit}>Submit</Button>
            </CardFooter>
        </form>
    );
};

export default AddProject;
