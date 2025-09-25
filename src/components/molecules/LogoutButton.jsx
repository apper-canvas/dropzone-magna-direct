import React, { useContext } from 'react';
import Button from '@/components/atoms/Button';
import { AuthContext } from '../../App';

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout();
    }
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      icon="LogOut"
      onClick={handleLogout}
      className="text-slate-600"
    >
      Logout
    </Button>
  );
};

export default LogoutButton;