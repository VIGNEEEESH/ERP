import React from 'react';
import PasswordChange from './PasswordChange';
import FileSystemPasswordChange from './FileSystemPasswordChange'; 
import ProfileImageUpdate from './EditProfile';

const Settings = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <ProfileImageUpdate />
      </div>
      <div>
        <PasswordChange />
        
      </div>
    </div>
  );
};

export default Settings;
