import React from 'react';
import useUserRole from '../../component/Hooks/useUserRole';
import DocAppointments from './DocAppointments';
import PatientAppointments from './PatientAppointments';

const Appointment = () => {
  const { role, loading } = useUserRole();

  console.log('User role:', role);

  // Loading state
 if (loading) {
  return (
    <div className="flex items-center justify-center h-screen">
      <span className="loading loading-infinity loading-xl"></span>
    </div>
  );
}

  // No role or unauthorized
  if (!role) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-4xl">⚠️</p>
        <p className="text-gray-700 font-bold">Unauthorized Access</p>
        <p className="text-gray-500">Please log in to view appointments</p>
      </div>
    );
  }

  // Render based on role
  return role === 'doctor' ? <DocAppointments /> : <PatientAppointments />;
};

export default Appointment;