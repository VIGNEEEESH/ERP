import React, { useState, useEffect, useContext } from 'react';
import { Card, CardBody, Button } from '@material-tailwind/react';
import { AuthContext } from '@/pages/auth/Auth-context';

const ProfileImageUpdate = () => {
  const [profileImg, setProfileImg] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:4444/api/erp/user/get/user/byid/${auth.userId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const userData = await response.json();
        if (userData) {
          // Prepend base URL to the image path
          const imageUrl = `http://localhost:4444/${userData.user.image}`;
          console.log("Profile Image URL:", imageUrl);
          setProfileImg(imageUrl);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [auth.userId]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setNewImage(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Perform image upload logic here
    if (newImage) {
      try {
        const formData = new FormData();
        formData.append('image', newImage);

        const response = await fetch(`http://localhost:4444/api/erp/user/update/image/byid/${auth.userId}`, {
          method: 'PATCH',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Reset the file input after submitting
        event.target.reset();
        setNewImage(null);

        // Update the profile image URL after successful upload
        const userData = await response.json();
        const imageUrl = `http://localhost:4444/${userData.user.image}`;
        setProfileImg(imageUrl);

        console.log('Profile image updated successfully:', imageUrl);
      } catch (error) {
        console.error('Error updating profile image:', error);
      }
    } else {
      console.error('No image selected!');
    }
  };

  return (
    <div className='p-4'>
      <Card>
        <CardBody>
          {profileImg && <img src={profileImg} alt="Current Profile" style={{ marginBottom: '1rem', maxWidth: '100%' }} />}
          <form onSubmit={handleSubmit}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            <Button type="submit" className='mt-4'>Update Image</Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default ProfileImageUpdate;
