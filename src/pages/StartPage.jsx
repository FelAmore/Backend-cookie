import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/authContext'
import { doSignOut } from '../firebase/auth'
import { FiLogOut, FiUser } from 'react-icons/fi'; // Importing icons

const Starter = () => {
    const navigate = useNavigate()
    const { userLoggedIn } = useAuth()
    const location = useLocation();

    // Function to check if current route is ProfilePage
    const isProfilePage = location.pathname === '/profile';

    // Render the Starter component only if not on the ProfilePage
    if (isProfilePage) return null;

    return (
        <nav className='flex flex-row justify-between items-center w-full z-20 fixed top-0 left-0 h-12 border-b bg-transparent border-transparent'>
            <div className="ml-2 flex items-center">
                {userLoggedIn && (
                    <>
                        <Link to="/login" onClick={() => { doSignOut().then(() => { navigate('/login') }) }} className="absolute top-2 left-2 m-4 flex items-center text-[#509be1] hover:text-[#72afe7]">
                            <FiLogOut size={24} className="mr-1" />
                            <span className="ml-1">Logout</span>
                        </Link>
                    </>
                )}
            </div>
            {userLoggedIn && (
                <div className="mr-2 flex items-center">
                    <Link to="/profile" className="absolute top-2 right-2 m-4 flex items-center text-[#509be1] hover:text-[#72afe7]">
                        <FiUser size={24} className="mr-1" />
                        <span className="ml-1">Profile</span>
                    </Link>

                </div>
            )}
        </nav>
    );
}

export default Starter


