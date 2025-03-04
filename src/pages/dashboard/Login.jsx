import React, { useState, useContext } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FcGoogle } from 'react-icons/fc';
import { AuthContext } from '../../provider/AuthProvider';

const Login = () => {
    const [isClicked, setIsClicked] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const { userLogin, setUser, signInWithGoogle } = useContext(AuthContext);

    const handleLogin = (e) => {
        e.preventDefault();
        const form = new FormData(e.target);
        const email = form.get('email');
        const password = form.get('password');
        
        userLogin(email, password)
            .then((res) => {
                setUser(res.user);
                Swal.fire({
                    title: 'Log In Successful!',
                    text: 'You have successfully logged in. You will be redirected shortly, or click OK to proceed immediately.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    timer: 3000, 
                    timerProgressBar: true, 
                }).then((result) => {
                    if (result.isConfirmed || result.dismiss === Swal.DismissReason.timer) {
                        navigate(location?.state ? location.state : '/');
                    }
                });
            })
            .catch(() => {
                Swal.fire({
                    title: 'Login Failed!',
                    text: 'Wrong Email or Password!!!',
                    icon: 'error',
                    confirmButtonText: 'Try Again'
                });
            });
    };

    const handleSignInWithGoogle = () => {
        signInWithGoogle()
            .then((res) => {
                setUser(res.user);
                navigate(location?.state ? location.state : '/');
            })
            .catch(() => {
                Swal.fire({
                    title: 'Google Sign In Failed!',
                    text: 'An error occurred while signing in with Google.',
                    icon: 'error',
                    confirmButtonText: 'Try Again'
                });
            });
    };

    return (
        <div className='min-h-screen flex justify-center items-center bg-gray-100 p-4'>
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-gray-700">Email</label>
                        <input type="email" name='email' className="w-full p-2 border border-gray-300 rounded" required />
                    </div>
                    <div className="relative">
                        <label className="block text-gray-700">Password</label>
                        <input type={isClicked ? 'password' : 'text'} name='password' className="w-full p-2 border border-gray-300 rounded" required />
                        <button type='button' onClick={() => setIsClicked(!isClicked)} className="absolute right-3 top-10 text-gray-600">
                            {isClicked ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                        </button>
                    </div>
                    <div className="text-right">
                        <Link to='/auth/forgetPassword' className="text-blue-500 text-sm">Forgot password?</Link>
                    </div>
                    <button type='submit' className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Login</button>
                </form>
                <div className="text-center mt-4">
                    <span className="text-gray-600">Don't have an account? </span>
                    <Link to='/signUp' className="text-blue-500">Sign Up</Link>
                </div>
                <div className="flex justify-center mt-6">
                    <button
                        onClick={handleSignInWithGoogle}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded shadow hover:bg-gray-100"
                    >
                        <FcGoogle size={20} /> 
                        <span>Log In with Google</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;