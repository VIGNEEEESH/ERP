// UpdateProject.js
import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Typography, Avatar, Button, Input } from "@material-tailwind/react";

function UpdateProject({ project, onUpdate, onCancel }) {
    const [name, setName] = useState(project.name);
    const [budget, setBudget] = useState(project.budget);

    const handleUpdate = () => {
        const updatedProject = { ...project, name, budget };
        onUpdate(updatedProject);
    };

    return (
        <Card className="max-w-md mx-auto">
            <CardHeader variant="gradient" color="gray" className="p-6">
                <Typography variant="h6" color="white">Update Project</Typography>
            </CardHeader>
            <CardBody>
                <div className="mb-4">
                    <Typography variant="subtitle">Project Name</Typography>
                    <Input value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="mb-4">
                    <Typography variant="subtitle">Budget</Typography>
                    <Input value={budget} onChange={(e) => setBudget(e.target.value)} />
                </div>
                <div className="flex justify-end">
                    <Button onClick={handleUpdate} color="green">Update</Button>
                    <Button onClick={onCancel} color="red" className="ml-2">Cancel</Button>
                </div>
            </CardBody>
        </Card>
    );
}

export default UpdateProject;
