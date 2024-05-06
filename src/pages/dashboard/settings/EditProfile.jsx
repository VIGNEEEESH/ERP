
import React, { useState, useEffect, useContext } from 'react';
import { Card, CardBody, Button } from '@material-tailwind/react';
import { AuthContext } from '@/pages/auth/Auth-context';
import { message } from 'antd';

const ProfileImageUpdate = () => {
  const [currentImage, setCurrentImage] = useState(null);
  const [newImage, setNewImage] = useState(null);
const auth=useContext(AuthContext)
  useEffect(() => {
    const fetchImage=async()=>{
      const response =await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/user/get/user/byid/${auth.userId}`,
      {
        headers:{
          Authorization: "Bearer " + auth.token, 
        }
      })
      if(!response.ok){
        message.error("Something went wrong while fetching the image, please try again")

      }
      const responseData=await response.json()
      setCurrentImage(responseData.user.image)
    }
    fetchImage()
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setNewImage(file);
  
    // Show image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setCurrentImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };
  

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (newImage) {
      try {
        const formData = new FormData();
        formData.append('image', newImage);
  
        const response = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/user/update/image/byid/${auth.userId}`, {
          method: 'PATCH',
          headers: {
            
            Authorization: "Bearer " + auth.token,
          },
          body: formData,
        });
  
        if (!response.ok) {
          message.error("Please try again");
          throw new Error("Network response was not ok");
        } else {
          message.success("Image updated successfully");
          setCurrentImage(URL.createObjectURL(newImage)); // Update the current image preview
        }
        message.success("Profile image updated successfully")
        setTimeout(()=>{
          window.location.reload()
        },[100])
      } catch (err) {
        message.error("Updating failed, please try again");
        console.error("Error updating image:", err);
      }
      event.target.reset();
      setNewImage(null);
    } else {
      console.error('No image selected!');
    }
  };
  

  return (
    <div className='p-4'>
    <Card>
      <CardBody>
        {currentImage && <img src={`${import.meta.env.REACT_APP_BACKEND_URL}/${currentImage}`} alt="Current Profile" style={{ marginBottom: '1rem', maxWidth: '100%' }} />}
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
