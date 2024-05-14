import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/authContext';
import defaultProfilePicture from '../assets/pfp.jpeg';
import { FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
    const { currentUser, userLoggedIn } = useAuth();
    const [syncMethod, setSyncMethod] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        if (userLoggedIn) {
            // Update sync method based on the user's authentication provider
            const providerData = currentUser.providerData[0];
            if (providerData.providerId === 'password') {
                setSyncMethod('Email');
            } else if (providerData.providerId === 'google.com') {
                setSyncMethod('Google');
            }
        }
    }, [currentUser, userLoggedIn]);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProfilePictureChange = () => {
        // Here you can upload the selected image to your storage and update the user's profile picture
        console.log('Selected image:', selectedImage);
        // Reset selectedImage state after handling the change
        setSelectedImage(null);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            {/* Back Icon */}
            <Link to="/home" className="absolute top-2 left-2 m-4 flex items-center text-[#509be1] hover:text-[#72afe7]">
                <FiArrowLeft size={24} />
                <span className="ml-1 text-[#509be1] hover:text-[#72afe7]">Back to Homepage</span>
            </Link>

            {/* Display user profile information */}
            {userLoggedIn && (
                <div className="text-center space-y-6 p-12 shadow-xl border rounded-xl bg-[#fbf7f4] border-[#ffa0ad]">
                    {/* User's Profile Picture */}
                    <div className="relative flex justify-center items-center flex-col">
                        <img
                            src={selectedImage || currentUser.photoURL || defaultProfilePicture} // Use selected image if available, otherwise use the user's current profile picture
                            alt="Profile"
                            className="mx-auto rounded-full w-20 h-20 object-cover"
                        />
                        {/* Edit Profile Picture link */}
                        <label htmlFor="imageInput" className="absolute top-16 right-17 lg:right-13 p-1 bg-[#509be1] text-[#f9f2ed] hover:text-[#72afe7] hover:border-[#72afe7] font-semibold text-xs cursor-pointer rounded-md">
                            Edit
                        </label>
                        <input
                            type="file"
                            id="imageInput"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                        />
                    </div>

                    {/* User's Email as Username */}
                    <h1 className="text-2xl font-semibold text-[#509be1]">User: {currentUser.email}</h1>

                    {/* Sync Method */}
                    <p className="text-2xl font-semibold text-[#509be1]">
                        Sync: <span className="font-semibold text-[#509be1]">{syncMethod}</span>
                    </p>

                    {/* Button to Save Changes */}
                    {selectedImage && (
                        <button onClick={handleProfilePictureChange} className="px-4 py-2 bg-[#509be1] text-[#fff] font-semibold rounded-md hover:bg-[#72afe7] mt-4">
                            Save Changes
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProfilePage;


