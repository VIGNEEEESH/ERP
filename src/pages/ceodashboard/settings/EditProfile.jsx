// import React, { useState } from 'react';
// import { Card, CardBody,Button } from '@material-tailwind/react';

// const ProfileImageUpdate = () => {
//   const [newImage, setNewImage] = useState(null);

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     setNewImage(file);
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     // Perform image upload logic here
//     if (newImage) {
//       // Here you can handle the logic to upload the new image to your backend
//       console.log('New image:', newImage);
//       // Reset the file input after submitting
//       event.target.reset();
//       setNewImage(null);
//     } else {
//       console.error('No image selected!');
//     }
//   };

//   return (
//     <Card>
//       <CardBody>
//         <form onSubmit={handleSubmit}>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleFileChange}
//           />
//           <Button type="submit">Update Image</Button>
//         </form>
//       </CardBody>
//     </Card>
//   );
// };

// export default ProfileImageUpdate;
import React, { useState, useEffect } from 'react';
import { Card, CardBody, Button } from '@material-tailwind/react';

const ProfileImageUpdate = () => {
  const [currentImage, setCurrentImage] = useState(null);
  const [newImage, setNewImage] = useState(null);

  useEffect(() => {
    // Fetch current image from API and set it to setCurrentImage
    fetchCurrentImageFromAPI();
  }, []);

  const fetchCurrentImageFromAPI = () => {
    // Example fetch code, replace with your actual API call
    // fetch('api/endpoint/to/get/current/image')
    //   .then(response => response.json())
    //   .then(data => setCurrentImage(data.imageURL))
    //   .catch(error => console.error('Error fetching current image:', error));

    // For demonstration, setting a dummy image URL
    setCurrentImage('https://example.com/your-current-image.jpg');
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setNewImage(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform image upload logic here
    if (newImage) {
      // Here you can handle the logic to upload the new image to your backend
      console.log('New image:', newImage);
      // Reset the file input after submitting
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
        {currentImage && <img src={currentImage} alt="Current Profile" style={{ marginBottom: '1rem', maxWidth: '100%' }} />}
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
