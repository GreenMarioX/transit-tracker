import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (authContext && authContext.logout) {
      authContext.logout();
      navigate('/login'); // Redirect to login page after logout
    }
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
};

export default Logout;
