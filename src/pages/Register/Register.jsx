import React, { useContext, useEffect, useState, useRef } from 'react'
import { useForm } from 'react-hook-form';
import { Link,  useNavigate } from 'react-router';
import { AuthContext } from '../../Context/AuthContext';

const Register = () => {
    const { register, handleSubmit, watch, setValue, trigger, formState: { errors } } = useForm();
    const role = watch('role');



    useEffect(() => {
        register('degrees', {
            validate: value => {
                if (role === 'doctor') return (value && value.length > 0) || 'Select at least one degree'
                return true
            }
        })
    }, [register, role])

    // degrees multi-select state
    const degreeOptions = [
        'MBBS','MD','MS','FCPS','PhD','BDS','MDS','DM','MPhil','DNB','MCh','FRCS','MBChB','DO','PA','NP'
    ];
    // specialty single-select state
    const specialtyOptions = [
        'General Practitioner','Cardiology','Dermatology','Pediatrics','Surgery','Neurology','Orthopedics','Oncology','Psychiatry','Radiology','Anesthesiology','Ophthalmology','ENT','Urology','Other'
    ];
    const [selectedSpecialty, setSelectedSpecialty] = useState('');
    const [specQuery, setSpecQuery] = useState('');
    const [specOpen, setSpecOpen] = useState(false);
    const specRef = useRef(null);

    const [selectedDegrees, setSelectedDegrees] = useState([]);
    const [degQuery, setDegQuery] = useState('');
    const [degOpen, setDegOpen] = useState(false);
    const degRef = useRef(null);

    useEffect(() => {
        // update form value whenever selectedDegrees changes
        setValue('degrees', selectedDegrees);
        // if role is doctor, trigger validation when degrees change
        if (role === 'doctor') trigger('degrees');
    }, [selectedDegrees, setValue, role, trigger]);

    useEffect(() => {
        // register specialty and validate only when doctor
        register('specialty', {
            validate: v => {
                if (role === 'doctor') return (v && v !== '') || 'Select specialty'
                return true
            }
        })
    }, [register, role])

    useEffect(() => {
        // clear degrees if role changed away from doctor
        if (role !== 'doctor') {
            setSelectedDegrees([]);
            setDegQuery('');
        }
    }, [role]);

    useEffect(() => {
        const onClick = (e) => { 
                if (degRef.current && !degRef.current.contains(e.target)) 
                setDegOpen(false);
            };
        
        document.addEventListener('click', onClick);
        return () => document.removeEventListener('click', onClick);
    }, []);

    useEffect(() => {
        const onClick = (e) => { 
            if (specRef.current && !specRef.current.contains(e.target)) 
                setSpecOpen(false); 
        };
        document.addEventListener('click', onClick);
        return () => document.removeEventListener('click', onClick);
    }, []);

  const filteredDegrees = degreeOptions.filter(d => d.toLowerCase().includes(degQuery.toLowerCase()) && !selectedDegrees.includes(d));
  
  const addDegree = (d) => {
     setSelectedDegrees(prev => [...prev, d]); 
     setDegQuery(''); 
     setDegOpen(false); 
    };
  
  const removeDegree = (d) => { 
    setSelectedDegrees(prev => prev.filter(x => x !== d)); 
    };

        const filteredSpecialties = specialtyOptions.filter(s => s.toLowerCase().includes(specQuery.toLowerCase()));
        const chooseSpecialty = (s) => 
            { 
                setSelectedSpecialty(s); 
                setSpecQuery(''); 
                setSpecOpen(false); 
            };
        const clearSpecialty = () => { 
            setSelectedSpecialty(''); 
        }

        useEffect(() => {
            setValue('specialty', selectedSpecialty);
            if (role === 'doctor') trigger('specialty');
        }, [selectedSpecialty, setValue, role, trigger]);

    const { createUser } = useContext(AuthContext);
    const navigate = useNavigate();
  
  
  const onSubmit = async (data) => {
    const{name, phone, email, password, role} = data;

    createUser(email, password)
    .then( async (result) => {
      const user = result.user;
      console.log(user);

      setTimeout(() => {
          navigate("/auth/login");
        }, 1500);
    })
    .catch(error => {
      console.error(error);
    })
  };

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
                            className="file-input file-input-bordered w-full"
                            accept="image/*"
                            {...register("image", { required: false })}
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

                {role === 'doctor' && (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div ref={specRef}>
                           <label className="label mb-2">Doctor Specialty</label>
                           <div className="relative">
                               <div>
                                   <input
                                       className="input input-bordered w-full"
                                       placeholder="Search specialty..."
                                       value={selectedSpecialty || specQuery}
                                       onChange={e => { setSpecQuery(e.target.value); setSelectedSpecialty(''); setSpecOpen(true); }}
                                       onFocus={() => setSpecOpen(true)}
                                   />
                               </div>

                               {specOpen && filteredSpecialties.length > 0 && (
                                   <ul className="absolute z-50 left-0 right-0 bg-white border rounded shadow max-h-56 overflow-auto">
                                       {filteredSpecialties.map(s => (
                                           <li key={s} className="px-3 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => chooseSpecialty(s)}>{s}</li>
                                       ))}
                                   </ul>
                               )}
                           </div>
                           {errors.specialty && <p className='text-red-500'>{errors.specialty.message || errors.specialty}</p>}
                       </div>

                        <div ref={degRef}>
                            <label className="label mb-2">Degrees (choose one or more)</label>
                            <div className="relative">
                                <div className="flex flex-wrap  gap-2 mb-2">
                                    {selectedDegrees.map(d => (
                                        <span key={d} className="badge badge-outline flex items-center gap-2">
                                            {d}
                                            <button type="button" onClick={() => removeDegree(d)} className="btn btn-ghost btn-xs">✕</button>
                                        </span>
                                    ))}
                                    <div className="flex-1 min-w-full">
                                        <input
                                            className="input input-bordered w-full"
                                            placeholder="Search degrees..."
                                            value={degQuery}
                                            onChange={e => { setDegQuery(e.target.value); setDegOpen(true); }}
                                            onFocus={() => setDegOpen(true)}
                                        />
                                    </div>
                                </div>

                                 {degOpen && filteredDegrees.length > 0 && (
                                                    <ul className="absolute z-50 left-0 right-0 bg-white border rounded shadow max-h-56 overflow-auto">
                                                        {filteredDegrees.map(d => (
                                                            <li key={d} className="px-3 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => addDegree(d)}>{d}</li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                            {errors.degrees && <p className='text-red-500'>{errors.degrees.message || errors.degrees}</p>}
                                        </div>
                                    </div>
                                )}

                  {  /* Register Button */}
                 <button className="btn btn-neutral mt-6 w-full">Register</button>

            </fieldset>

            <p className="text-center mt-4">
                Already have an account?
                <Link to="/auth/login" className="text-blue-600 ml-2">Login</Link>
            </p>
        </form>
        {/* <ToastContainer /> */}
    </div>
  )
}

export default Register