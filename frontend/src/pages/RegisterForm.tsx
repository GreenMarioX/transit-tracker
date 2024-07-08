import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const RegisterForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const authContext = useContext(AuthContext);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (authContext && authContext.register) {
            try {
                console.log("Registering user:", username, password);
                await authContext.register(username, password);
                //window.location.href = '/login';
            } catch (error) {
                console.error('Registration error:', error);
            }
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="first-name">First name</Label>
                            <Input
                                id="first-name"
                                placeholder="John"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="last-name">Last name</Label>
                            <Input
                                id="last-name"
                                placeholder="Doe"
                                required
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="user@gousa.com"
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full">
                        Create an account
                    </Button>
                    <Button variant="outline" className="w-full">
                        Sign up with GitHub
                    </Button>
                </div>
            </form>
            <div className="mt-4 text-center text-sm">
                Already have an account?{' '}
                <a href="/login" className="underline">
                    Sign in
                </a>
            </div>

            {/* <form onSubmit={handleSubmit}>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                <button type="submit">Register</button>
            </form> */}
        </div>
    );
};

export default RegisterForm;
