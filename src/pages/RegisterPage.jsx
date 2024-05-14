import React, { useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import { doCreateUserWithEmailAndPassword } from "../firebase/auth";
import logo from '../assets/logo.png';
import styles from '../styles/global.module.css';

const Register = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setconfirmPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { userLoggedIn } = useAuth();

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!isRegistering) {
            setIsRegistering(true);
            try {
                console.log('Starting registration...');
                if (password !== confirmPassword) {
                    throw new Error('Passwords do not match');
                }

                await doCreateUserWithEmailAndPassword(email, password);
                console.log('Registration successful');
                navigate('/login');
            } catch (error) {
                console.error('Registration error:', error.message);
                setErrorMessage(error.message);
            } finally {
                setIsRegistering(false);
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            {userLoggedIn && (<Navigate to={'/home'} replace={true} />)}
            <img src={logo} className={styles.auth} alt="Logo" />
            <main className="main-content w-full h-screen flex self-center place-content-center place-items-center">
                <div className="w-96 text-gray-600 space-y-9 p-4 shadow-xl border rounded-xl bg-[#fbf7f4] border-[#ffa0ad]">
                    <div className="text-center mb-6">
                        <div className="mt-2">
                            <h3 className="text-[#509be1] text-xl font-semibold sm:text-2xl">Create a New Account</h3>
                        </div>
                    </div>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm text-[#509be1] font-bold">Email</label>
                            <input
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full mt-2 px-3 py-2 text-[#ff71b2] bg-transparent outline-none border focus:border-[#d3e9ff] shadow-sm rounded-lg border-[#ffa0ad] transition duration-300"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-[#509be1] font-bold">Password</label>
                            <input
                                disabled={isRegistering}
                                type="password"
                                autoComplete="new-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full mt-2 px-3 py-2 text-[#ff71b2] bg-transparent outline-none border focus:border-[#d3e9ff] shadow-sm rounded-lg border-[#ffa0ad] transition duration-300"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-[#509be1] font-bold">Confirm Password</label>
                            <input
                                disabled={isRegistering}
                                type="password"
                                autoComplete="off"
                                required
                                value={confirmPassword}
                                onChange={(e) => setconfirmPassword(e.target.value)}
                                className="w-full mt-2 px-3 py-2 text-[#ff71b2] bg-transparent outline-none border focus:border-[#d3e9ff] shadow-sm rounded-lg border-[#ffa0ad] transition duration-300"
                            />
                        </div>
                        {errorMessage && (
                            <span className="text-red-600 font-bold">{errorMessage}</span>
                        )}
                        <button
                            type="submit"
                            disabled={isRegistering}
                            className={`w-full px-4 py-2 text-[#f9f2ed] font-medium rounded-lg ${isRegistering ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#509be1] hover:bg-[#61a5e4] hover:shadow-xl transition duration-300'}`}
                        >
                            {isRegistering ? 'Signing Up...' : 'Sign Up'}
                        </button>
                        <div className="text-sm text-center text-[#ff8797]">
                            Already have an account? {'   '}
                            <Link to="/login" className="text-center text-sm hover:underline font-bold">Continue</Link>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default Register;
