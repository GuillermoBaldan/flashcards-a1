import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, BookOpenIcon, LightBulbIcon, UserIcon, CogIcon } from '@heroicons/react/24/outline';
import '../styles/components/NavigationBar.css';

interface NavigationBarProps {
  activePage: 'home' | 'decks' | 'study' | 'profile' | 'settings';
}

const NavigationBar: React.FC<NavigationBarProps> = ({ activePage }) => {
  return (
    <div className='fixed top-0 w-full border-b border-gray-200 z-10 navigation-bar'>
      <div className='flex justify-between items-center p-4'>
        <Link to='/' className={`flex flex-col items-center no-underline ${activePage === 'home' ? 'text-blue-500' : 'text-black hover:text-blue-500'}`}>
          <HomeIcon className='h-6 w-6 navigation-icon' />
          <span className='text-xs navigation-text'>Home</span>
        </Link>
        <Link to='/decks' className={`flex flex-col items-center no-underline ${activePage === 'decks' ? 'text-blue-500' : 'text-black hover:text-blue-500'}`}>
          <BookOpenIcon className='h-6 w-6 navigation-icon' />
          <span className='text-xs navigation-text'>Decks</span>
        </Link>
        <Link to='/study' className={`flex flex-col items-center no-underline ${activePage === 'study' ? 'text-blue-500' : 'text-black hover:text-blue-500'}`}>
          <LightBulbIcon className='h-6 w-6 navigation-icon' />
          <span className='text-xs navigation-text'>Study</span>
        </Link>
        <Link to='/profile' className={`flex flex-col items-center no-underline ${activePage === 'profile' ? 'text-blue-500' : 'text-black hover:text-blue-500'}`}>
          <UserIcon className='h-6 w-6 navigation-icon' />
          <span className='text-xs navigation-text'>Profile</span>
        </Link>
        <Link to='/settings' className={`flex flex-col items-center no-underline ${activePage === 'settings' ? 'text-blue-500' : 'text-black hover:text-blue-500'}`}>
          <CogIcon className='h-6 w-6 navigation-icon' />
          <span className='text-xs navigation-text'>Settings</span>
        </Link>
      </div>
    </div>
  );
};

export default NavigationBar;
