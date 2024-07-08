import { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  register: (username: string, password: string) => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log("Token found:", token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.get('http://localhost:9998/api/users/me')
        .then(response => {
          console.log("User data fetched:", response.data);
          setUser(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error("Error fetching user data:", error);
          localStorage.removeItem('token');
          setLoading(false);
        });
    } else {
      console.log("No token found");
      setLoading(false);
    }
  }, []);

  const register = async (username: string, password: string) => {
    try {
      // Example: Perform registration API call
      const response = await fetch('http://localhost:9998/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        // Registration successful, redirect to login page
        window.location.href = '/login'; // Directly change window location
        // or use useHistory or Redirect component from react-router-dom
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      // Handle error (e.g., show error message)
    }
  };

  const login = async (username: string, password: string) => {
    const response = await axios.post('http://localhost:9998/api/users/login', { username, password });
    localStorage.setItem('token', response.data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    setUser(response.data.user);
    console.log("Login successful:", response.data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    console.log("Logout successful");
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
