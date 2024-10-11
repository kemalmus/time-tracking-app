import React from 'react';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { Clock, Calendar, LogOut } from 'lucide-react';

const Header = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">WorkTime</Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="flex items-center hover:text-blue-200 transition duration-300">
                <Clock className="mr-1" size={18} /> Dashboard
              </Link>
            </li>
            <li>
              <Link to="/allocate" className="flex items-center hover:text-blue-200 transition duration-300">
                <Calendar className="mr-1" size={18} /> Allocate Time
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className="flex items-center hover:text-blue-200 transition duration-300">
                <LogOut className="mr-1" size={18} /> Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;