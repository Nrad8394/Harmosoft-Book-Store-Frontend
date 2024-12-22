"use client";
import { useState } from "react";
import {
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
  AiFillEye,
  AiFillEyeInvisible,
} from "react-icons/ai";
import { useRouter } from "next/navigation"; // Import useRouter
import { useAuth } from "../context/AuthContext";

export const AuthModal = ({ closeModal }: { closeModal: () => void }) => {
  const { login, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and register
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password1: "",
    password2: "",
    user_type: "individual",
  });
  const [loading, setLoading] = useState(false); // Loading state
  const [authSuccess, setAuthSuccess] = useState(false); // Track success/failure
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Error message state
  const [showAuthModal, setShowAuthModal] = useState(false); // Show modal for success/failure
  const [showPassword1, setShowPassword1] = useState(false); // Toggle password visibility for password1
  const [showPassword2, setShowPassword2] = useState(false); // Toggle password visibility for password2
  const router = useRouter(); // Initialize useRouter for redirection

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true); // Start loading

    try {
      if (isLogin) {
        if (formData.email === "" || formData.password1 === "") {
          throw new Error("Email and password are required.");
        }
        await login(formData.email, formData.password1);
        setAuthSuccess(true); // Success on login
      } else {
        if (
          formData.email === "" ||
          formData.username === "" ||
          formData.password1 === "" ||
          formData.password2 === ""
        ) {
          throw new Error("All fields are required for registration.");
        }
        if (formData.password1 !== formData.password2) {
          throw new Error("Passwords do not match.");
        }
        await signUp(
          formData.email,
          formData.username,
          formData.password1,
          formData.password2,
          formData.user_type
        );
        setAuthSuccess(true); // Success on signup
      }
      setErrorMessage(null); // Clear any previous errors
      setShowAuthModal(true); // Show success modal
      setTimeout(() => {
        router.push("/account"); // Redirect to /account after successful login
      }, 2000); // Add delay before redirecting to give users time to see the success message
    } catch (error: any) {
      setAuthSuccess(false); // Failure
      setErrorMessage(error.message || "An error occurred during authentication.");
      setShowAuthModal(true); // Show failure modal
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const togglePasswordVisibility1 = () => {
    setShowPassword1(!showPassword1);
  };

  const togglePasswordVisibility2 = () => {
    setShowPassword2(!showPassword2);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
    if (authSuccess) closeModal(); // Close parent modal on success
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20 p-4"
        onClick={handleBackgroundClick} // Close modal when clicking the background
      >
        <div className="bg-white p-6 rounded-lg shadow-lg relative w-full max-w-md md:max-w-lg mx-auto">
          <button
            onClick={closeModal}
            className="absolute top-3 right-3 text-xl font-bold text-gray-600"
          >
            &times;
          </button>

          {/* Header with Login and Register Selection */}
          <div className="flex justify-center mb-6 space-x-4">
            <button
              onClick={() => setIsLogin(true)}
              className={`text-2xl font-semibold pb-2 ${
                isLogin ? "border-b-2 border-green-600" : "text-gray-400"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`text-2xl font-semibold pb-2 ${
                !isLogin ? "border-b-2 border-green-600" : "text-gray-400"
              }`}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full mb-4 p-2 border border-gray-300 rounded text-black"
          />
          {!isLogin && (
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full mb-4 p-2 border border-gray-300 rounded text-black"
            />
          )}
          <div className="relative mb-4">
            <input
              type={showPassword1 ? "text" : "password"}
              name="password1"
              placeholder="Password"
              value={formData.password1}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded text-black"
            />
            <span
              onClick={togglePasswordVisibility1}
              className="absolute inset-y-0 right-4 flex items-center cursor-pointer"
            >
              {showPassword1 ? <AiFillEyeInvisible /> : <AiFillEye />}
            </span>
          </div>
          {!isLogin && (
            <div className="relative mb-4">
              <input
                type={showPassword2 ? "text" : "password"}
                name="password2"
                placeholder="Confirm Password"
                value={formData.password2}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded text-black"
              />
              <span
                onClick={togglePasswordVisibility2}
                className="absolute inset-y-0 right-4 flex items-center cursor-pointer"
              >
                {showPassword2 ? <AiFillEyeInvisible /> : <AiFillEye />}
              </span>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 text-red-600 text-center">
              {errorMessage}
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="w-full bg-green-600 text-white py-2 rounded font-semibold flex justify-center items-center"
          >
            {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
          </button>
        </div>
      </div>

      {/* Modal for success or failure */}
      {showAuthModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <div className="flex items-center space-x-4">
              {authSuccess ? (
                <>
                  <AiOutlineCheckCircle className="text-green-700 text-6xl md:text-9xl" />
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold">
                      {isLogin ? "Login Successful" : "Registration Successful"}
                    </h3>
                    <p className="text-gray-700 mt-2">
                      {isLogin
                        ? "You have successfully logged in."
                        : "Your account has been created successfully."}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <AiOutlineCloseCircle className="text-red-700 text-6xl md:text-9xl" />
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold">
                      {isLogin ? "Login Failed" : "Registration Failed"}
                    </h3>
                    <p className="text-gray-700 mt-2">
                      {errorMessage || "Unfortunately, your authentication attempt failed."}
                    </p>
                  </div>
                </>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeAuthModal}
                className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-gray-900 transition-all duration-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
              >
                {authSuccess ? "Close" : "Retry"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
