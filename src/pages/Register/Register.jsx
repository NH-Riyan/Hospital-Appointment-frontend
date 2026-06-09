import React, { useContext, useEffect, useState, useRef } from 'react'
import { useForm } from 'react-hook-form';
import { Link,  useNavigate } from 'react-router';
import { AuthContext } from '../../Context/AuthContext';
import axios from 'axios';
import useAxiosSecure from '../../component/Hooks/useAxiosSecure';

const Register = () => {
    const { register, handleSubmit, watch, setValue, trigger, formState: { errors } } = useForm();
    const role = watch('role');
    const { createUser, updateUserProfile } = useContext(AuthContext);
    const [dp,setDP] = useState('');
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();


    const onSubmit = async (data) => {
        const { name, phone, email, password, role } = data;

        try {
            const result = await createUser(email, password);
            const createdUser = result.user;
            console.log(createdUser);

        
            if (updateUserProfile && name) {
                    await updateUserProfile({ displayName: name , photoURL: dp});
                }
        } catch (error) {
            console.error("Error creating user:", error);
            return;
        }

            const userData = {
                name,
                phone,
                email,
                photoURL: dp,
                role
            };

       
            const endpoint = role === 'doctor' ? '/doctors' : '/users';

            try { 
                const response = await axiosSecure.post(endpoint, userData);
                 console.log("Success:", response.data);
            }catch (err) {
               console.error("Error saving user:", err);
           }

            navigate("/auth/login");
        
    };

    const handleimage = async (e) => {
        const file = e.target.files && e.target.files[0];

        if (!file) {
            setDP('');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        try {
            const imgURL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_imgbb_key}`;
            const res = await axios.post(imgURL, formData);
            setDP(res?.data?.data?.display_url || '');
        } catch (err) {
            console.error('Image upload failed:', err);
            setDP('');
        }
    }

  return (
     <div className="flex justify-center items-center py-34 bg-blue-200">
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-base-100 p-8 rounded-lg shadow-md w-1/2"
        >
            <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

            <fieldset className="fieldset flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="label">Full Name</label>
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            {...register("name", { required: true })}
                            placeholder="Your full name"
                        />
                    </div>

                    <div>
                        <label className="label">Phone Number</label>
                        <input
                            type="tel"
                            className="input input-bordered w-full"
                            {...register("phone", { required: true, pattern: { value: /^01\d{9}$/, message: 'Phone number must start with 01 and be 11 digits' } })}
                            placeholder="Phone number"
                        />
                        {errors.phone?.type === 'required' && <p className='text-red-500'>Phone number is required</p>}
                        {errors.phone?.message && <p className='text-red-500'>{errors.phone.message}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="label">Enter Email</label>
                        <input
                            type="email"
                            className="input input-bordered w-full"
                            {...register("email", { required: true })}
                            placeholder="Email"
                        />
                        {errors.email && <p className='text-red-500'>Email is required</p>}
                    </div>

                    <div>
                        <label className="label">Upload Profile Image</label>
                        <input
                            type="file"
                            onChange={handleimage}
                            className="file-input file-input-bordered w-full"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="label">Enter Password</label>
                        <input
                            type="password"
                            className="input input-bordered w-full"
                            {...register("password", { required: true, minLength: 6 })}
                            placeholder="Password"
                        />
                        {errors.password?.type === 'required' && <p className='text-red-500'>Password is required</p>}
                        {errors.password?.type === 'minLength' && <p className='text-red-500'>Password must be at least 6 characters</p>}
                    </div>

                    <div>
                        <label className="label">Confirm Password</label>
                        <input
                            type="password"
                            className="input input-bordered w-full"
                            {...register("confirmPassword", { required: true, validate: value => value === watch('password') || 'Passwords do not match' })}
                            placeholder="Confirm password"
                        />
                        {errors.confirmPassword?.type === 'required' && <p className='text-red-500'>Please confirm your password</p>}
                        {errors.confirmPassword?.message && <p className='text-red-500'>{errors.confirmPassword.message}</p>}
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="label text">Account Type</label>
                    <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2">
                            <input type="radio" value="doctor" {...register("role", { required: true })} />
                            <span className='text-[16px]'>Doctor</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="radio" value="patient" {...register("role", { required: true })} />
                            <span className='text-[16px]'>Patient</span>
                        </label>
                    </div>
                    {errors.role && <p className='text-red-500'>Please select account type</p>}
                </div>

                 <button className="btn btn-neutral mt-6 w-full">Register</button>

            </fieldset>

            <p className="text-center mt-4">
                Already have an account?
                <Link to="/auth/login" className="text-blue-600 ml-2">Login</Link>
            </p>
        </form>
    </div>
  )
}

export default Register