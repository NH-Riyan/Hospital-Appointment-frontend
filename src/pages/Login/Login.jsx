import React, { useContext } from 'react'
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router';
import { AuthContext } from '../../Context/AuthContext';

const Login = () => {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const { signIn} = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const onSubmit = async (data) => {
        const { email, password } = data;
        // Fixed admin credentials
        if (email === "admin@gmail.com" && password === "admin12") {
            // persist role for app-wide checks
            localStorage.setItem("app_role", "admin");
            localStorage.setItem("app_email", email);
            // always go to home (Home component will render AdminHome for admin role)
            navigate("/");
            return;
        }

        try {
            const result = await signIn(email, password);
            // remove any fixed-role flag (if present)
            localStorage.removeItem("app_role");

            setTimeout(() => {
                navigate(`${location.state ? location.state : "/"}`)
            }, 1500);
        } catch (error) {
            console.error("Login error:", error.message);
            //toast.error(" Login failed.");
        }
    };


  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-200">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-base-100 p-8 rounded-lg shadow-md w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">
                    Login
                </h2>

                <fieldset className="fieldset flex flex-col gap-4">

                    {/* Email */}
                    <label className="label">Enter Email</label>
                    <input
                        type="email"
                        className="input input-bordered w-full"
                        {...register("email", { required: true })}
                        placeholder="Email"
                    />
                    {errors.email?.type === 'required' && (
                        <p className='text-red-500'>Email is required</p>
                    )}

                    {/* Password */}
                    <label className="label">Enter Password</label>
                    <input
                        type="password"
                        className="input input-bordered w-full"
                        {...register("password", { required: true})}
                        placeholder="Password"
                    />
                    {errors.password?.type === 'required' && (
                        <p className='text-red-500'>Password is required</p>
                    )}
                    

                    <div className="text-right">
                        <a className="link link-hover">Forgot password?</a>
                    </div>

                    {/* Login Button */}
                    <button className="btn btn-neutral mt-6 w-full">Login</button>

                </fieldset>

                {/* Register button  */}
                <p className="text-center mt-4">
                    Don't have an account?
                    <Link to="/auth/register" className="text-red-600 ml-2">Register</Link>
                </p>
            </form>
            {/* <ToastContainer /> */}
        </div>
  )
}

export default Login