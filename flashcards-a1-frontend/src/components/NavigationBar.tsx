import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, BookOpenIcon, LightBulbIcon, UserIcon, CogIcon } from '@heroicons/react/24/outline';
import '../styles/components/NavigationBar.css';

interface NavigationBarProps {
  activePage: 'home' | 'decks' | 'study' | 'profile' | 'settings';
}

const NavigationBar: React.FC<NavigationBarProps> = ({ activePage }) => {
  return (
    <div className='navigation-bar'>
      <div className='nav-inner'>
        <Link to='/' className={`nav-link ${activePage === 'home' ? 'active' : ''}`}>
          <HomeIcon className='navigation-icon' />
          <span className='navigation-text'>Home</span>
        </Link>
        <Link to='/decks' className={`nav-link ${activePage === 'decks' ? 'active' : ''}`}>
          <BookOpenIcon className='navigation-icon' />
          <span className='navigation-text'>Decks</span>
        </Link>
        <Link to='/study' className={`nav-link ${activePage === 'study' ? 'active' : ''}`}>
          <LightBulbIcon className='navigation-icon' />
          <span className='navigation-text'>Study</span>
        </Link>
        <Link to='/profile' className={`nav-link ${activePage === 'profile' ? 'active' : ''}`}>
          <UserIcon className='navigation-icon' />
          <span className='navigation-text'>Profile</span>
        </Link>
        <Link to='/settings' className={`nav-link ${activePage === 'settings' ? 'active' : ''}`}>
          <CogIcon className='navigation-icon' />
          <span className='navigation-text'>Settings</span>
        </Link>
      </div>
    </div>
  );
};

export default NavigationBar;
