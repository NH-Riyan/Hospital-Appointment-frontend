import React, { useState } from 'react';

import { FaSearch, FaFlask, FaPhone, FaEnvelope, FaUser, FaCheckCircle, FaTimes, FaReceipt } from 'react-icons/fa';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../component/Hooks/useAxiosSecure';

// Mock Data for Tests
const AVAILABLE_TESTS = [
  { _id: '1', name: 'Complete Blood Count (CBC)', price: 500 },
  { _id: '2', name: 'Lipid Profile', price: 800 },
  { _id: '3', name: 'Liver Function Test (LFT)', price: 750 },
  { _id: '4', name: 'Kidney Function Test (KFT)', price: 700 },
  { _id: '5', name: 'Thyroid Profile (T3, T4, TSH)', price: 1200 },
  { _id: '6', name: 'Blood Sugar (Fasting)', price: 300 },
  { _id: '7', name: 'HbA1c (Diabetes)', price: 600 },
  { _id: '8', name: 'Urine Routine & Microscopy', price: 400 },
  { _id: '9', name: 'Vitamin D Total', price: 1500 },
  { _id: '10', name: 'Vitamin B12', price: 1200 },
  { _id: '11', name: 'CRP (C-Reactive Protein)', price: 550 },
  { _id: '12', name: 'ECG', price: 400 },
  { _id: '13', name: 'Ultrasound (Abdomen)', price: 1800 },
  { _id: '14', name: 'X-Ray Chest PA View', price: 600 },
];

const Test = () => {
  const axiosSecure = useAxiosSecure();
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });

  // Search & Selection State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTests, setSelectedTests] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter tests based on search
  const filteredTests = AVAILABLE_TESTS.filter(test => 
    test.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle Input Change
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Toggle Test Selection
  const toggleTestSelection = (test) => {
    const isSelected = selectedTests.some(t => t._id === test._id);
    if (isSelected) {
      setSelectedTests(selectedTests.filter(t => t._id !== test._id));
    } else {
      setSelectedTests([...selectedTests, test]);
    }
  };

  // Calculate Total Cost
  const totalCost = selectedTests.reduce((sum, test) => sum + test.price, 0);

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedTests.length === 0) {
      Swal.fire('Warning', 'Please select at least one test.', 'warning');
      return;
    }

    setIsSubmitting(true);

    const bookingData = {
      ...formData,
      tests: selectedTests.map(t => ({ id: t._id, name: t.name, price: t.price })),
      totalAmount: totalCost,
      status: 'pending',
      bookedAt: new Date().toISOString()
    };

    try {
      await axiosSecure.post('/test-bookings', bookingData);
      
      Swal.fire('Success!', 'Your test booking has been confirmed.', 'success');
      
      // Reset Form
      setFormData({ name: '', phone: '', email: '' });
      setSelectedTests([]);
      setSearchTerm('');
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Failed to book tests. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Patient Info Form (Wider: 5/12) */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl shadow-xl p-8 sticky top-8 border border-slate-100">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  <FaUser />
                </div>
                Patient Details
              </h2>
              <p className="text-slate-500 text-sm mt-2 ml-1">Enter your information to proceed with booking.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Full Name</label>
                <div className="relative">
                  <FaUser className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-200"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Phone Number</label>
                <div className="relative">
                  <FaPhone className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-200"
                    placeholder="01XXXXXXXXX"
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Email Address</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-200"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              {/* Summary Box */}
              <div className="mt-8 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 shadow-inner">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-bold text-blue-800 uppercase tracking-wide">Items Selected</span>
                  <span className="font-bold text-blue-900 bg-white px-3 py-1 rounded-full text-xs shadow-sm">{selectedTests.length}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-blue-200/50">
                  <span className="text-base font-bold text-slate-700">Total Estimate</span>
                  <span className="text-2xl font-extrabold text-blue-600">৳{totalCost}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || selectedTests.length === 0}
                className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all duration-300 flex items-center justify-center gap-2 mt-4 ${
                  isSubmitting || selectedTests.length === 0
                    ? 'bg-slate-300 cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-blue-500/30 hover:-translate-y-1 active:translate-y-0'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span> Processing...
                  </>
                ) : (
                  <>Confirm Booking <FaCheckCircle /></>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: Test Selection (Wider: 7/12) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* SELECTED TESTS PANEL (Top of Right Column) */}
          {selectedTests.length > 0 && (
            <div className="bg-white rounded-3xl shadow-lg border border-emerald-100 overflow-hidden animate-fade-in-up">
              <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100 flex items-center justify-between">
                <h3 className="font-bold text-emerald-800 flex items-center gap-2">
                  <FaReceipt className="text-emerald-600" /> Selected Tests ({selectedTests.length})
                </h3>
                <span className="text-sm font-bold text-emerald-700">Total: ৳{totalCost}</span>
              </div>
              <div className="p-4 flex flex-wrap gap-3 max-h-40 overflow-y-auto custom-scrollbar">
                {selectedTests.map((test) => (
                  <div key={test._id} className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg text-sm font-medium text-emerald-900 shadow-sm">
                    <span>{test.name}</span>
                    <span className="text-emerald-600 font-bold ml-1">৳{test.price}</span>
                    <button 
                      onClick={() => toggleTestSelection(test)}
                      className="ml-2 text-emerald-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MAIN TEST LIST CARD */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 h-[calc(100vh-150px)] min-h-[600px] flex flex-col">
            <div className="p-6 border-b border-slate-100 bg-white z-10 rounded-t-3xl">
              <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
                <div className="p-2 bg-cyan-100 rounded-lg text-cyan-600">
                  <FaFlask />
                </div>
                Diagnostic Tests
              </h2>

              {/* Search Bar */}
              <div className="relative">
                <FaSearch className="absolute left-4 top-4 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for a test (e.g., CBC, Lipid)..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 outline-none transition-all duration-200"
                />
              </div>
            </div>

            {/* Scrollable Test List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar bg-slate-50/30">
              {filteredTests.length > 0 ? (
                filteredTests.map((test) => {
                  const isSelected = selectedTests.some(t => t._id === test._id);
                  return (
                    <div
                      key={test._id}
                      onClick={() => toggleTestSelection(test)}
                      className={`group flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'border-cyan-500 bg-cyan-50/50 shadow-md translate-x-1'
                          : 'border-transparent bg-white hover:border-cyan-200 hover:shadow-lg hover:-translate-y-0.5'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          isSelected ? 'border-cyan-500 bg-cyan-500' : 'border-slate-300 group-hover:border-cyan-400'
                        }`}>
                          {isSelected && <FaCheckCircle className="text-white text-xs" />}
                        </div>
                        <span className={`font-semibold text-lg ${isSelected ? 'text-cyan-900' : 'text-slate-700'}`}>
                          {test.name}
                        </span>
                      </div>
                      <span className={`font-bold text-lg ${isSelected ? 'text-cyan-700' : 'text-slate-500'}`}>
                        ৳{test.price}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-20 text-slate-400">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaFlask className="text-2xl text-slate-300" />
                  </div>
                  <p className="text-lg font-medium">No tests found matching "{searchTerm}"</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Test;