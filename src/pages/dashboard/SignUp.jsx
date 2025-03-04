import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FcGoogle } from "react-icons/fc";
import { AuthContext } from "../../provider/AuthProvider";

const SignUp = () => {
  const [isClicked, setIsClicked] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { createNewUser, setUser, updateUserProfile, signInWithGoogle } =
    useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const form = new FormData(e.target);
    const name = form.get("name");
    const email = form.get("email");
    const password = form.get("password");

    createNewUser(email, password)
      .then((res) => {
        setUser(res.user);
        updateUserProfile({ displayName: name })
          .then(() => {
            Swal.fire({
              title: "Sign-Up Successful!",
              text: "Redirecting...",
              icon: "success",
              confirmButtonText: "OK",
              timer: 3000,
              timerProgressBar: true,
            }).then((result) => {
              if (result.isConfirmed || result.dismiss === Swal.DismissReason.timer) {
                navigate("/");
              }
            });
          })
          .catch((err) => console.error(err));
      })
      .catch(() => setError("Failed to create account. Please try again."));
  };

  const handleSignUpWithGoogle = () => {
    signInWithGoogle()
      .then((res) => {
        setUser(res.user);
        Swal.fire({
          title: "Sign-Up Successful!",
          text: "Redirecting...",
          icon: "success",
          confirmButtonText: "OK",
          timer: 3000,
          timerProgressBar: true,
        }).then((result) => {
          if (result.isConfirmed || result.dismiss === Swal.DismissReason.timer) {
            navigate("/");
          }
        });
      })
      .catch(() => setError("Failed to sign up with Google."));
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-4">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Name</label>
            <input type="text" name="name" className="w-full p-2 border border-gray-300 rounded" required />
          </div>
          <div>
            <label className="block text-gray-700">Email</label>
            <input type="email" name="email" className="w-full p-2 border border-gray-300 rounded" required />
          </div>
          <div className="relative">
            <label className="block text-gray-700">Password</label>
            <input type={isClicked ? "password" : "text"} name="password" className="w-full p-2 border border-gray-300 rounded" required />
            <button type="button" onClick={() => setIsClicked(!isClicked)} className="absolute right-3 top-10 text-gray-600">
              {isClicked ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
            </button>
          </div>
          {error && <p className="text-red-600 text-center mt-2">{error}</p>}
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Sign Up
          </button>
        </form>
        <div className="text-center mt-4">
          <span className="text-gray-600">Already have an account? </span>
          <Link to="/login" className="text-blue-500">Log In</Link>
        </div>
        <div className="flex justify-center mt-6">
          <button onClick={handleSignUpWithGoogle} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded shadow hover:bg-gray-100">
            <FcGoogle size={20} />
            <span>Sign Up with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
