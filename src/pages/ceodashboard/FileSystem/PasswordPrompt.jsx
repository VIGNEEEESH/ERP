import React, { useState } from 'react';
import { Input, Button, Card, CardBody, Typography } from '@material-tailwind/react';

const PasswordPrompt = ({ onPasswordSubmit }) => {
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onPasswordSubmit(password);
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <Card className="w-96">
                <CardBody>
                    <Typography variant="h5" color="blue-gray" className="text-center mb-6">
                        Enter your password to access the file system
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <Input
                                type="password"
                                label="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="text-center">
                            <Button type="submit">Submit</Button>
                        </div>
                    </form>
                </CardBody>
            </Card>
        </div>
    );
};

export default PasswordPrompt;
