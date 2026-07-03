import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useQuery, useQueryClient } from "@tanstack/react-query"; // ✅ Added useQueryClient
import useAxiosSecure from "../../component/Hooks/useAxiosSecure";
import axios from 'axios'; 
import Swal from 'sweetalert2';
import { 
  FaArrowLeft, 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaFilePdf, 
  FaUpload, 
  FaCheckCircle, 
  FaTimes,
  FaFlask
} from 'react-icons/fa';

const ReportSubmit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient(); // ✅ Initialize query client
  
  const [pdfFile, setPdfFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch specific booking details
  const { data: booking, isLoading } = useQuery({
    queryKey: ["bookingDetails", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/test-bookings/${id}`);
      return res.data;
    },
  });

  // Handle File Selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      setPdfUrl(""); 
    } else {
      Swal.fire('Error', 'Please select a valid PDF file.', 'error');
    }
  };

  // Upload PDF to Cloudinary
  const uploadPDF = async () => {
    if (!pdfFile) return null;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('file', pdfFile);
    
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    formData.append('upload_preset', uploadPreset); 

    try {
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      
      if (!cloudName || !uploadPreset) {
        throw new Error("Cloudinary credentials are missing in .env file");
      }

      const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
      const res = await axios.post(url, formData);
      
      return res.data.secure_url; 
    } catch (err) {
      console.error('PDF upload failed:', err);
      Swal.fire('Upload Error', 'Failed to upload PDF. Please check your connection or settings.', 'error');
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Submit Final Report
  const handleSubmitReport = async () => {
    if (!pdfUrl && !pdfFile) {
      Swal.fire('Warning', 'Please upload the test report PDF first.', 'warning');
      return;
    }

    setIsSubmitting(true);

    try {
      let finalPdfUrl = pdfUrl;
      if (pdfFile && !pdfUrl) {
        finalPdfUrl = await uploadPDF();
        if (!finalPdfUrl) {
          setIsSubmitting(false);
          return;
        }
      }

      // Update Backend
      await axiosSecure.patch(`/test-bookings/${id}`, {
        status: 'completed',
        reportPdf: finalPdfUrl,
        completedAt: new Date().toISOString()
      });
      
      // ✅ OPTIMISTIC UPDATE: Remove this card from the Reports list immediately
      queryClient.setQueryData(["allTestBookings"], (oldData) => {
        if (!oldData) return oldData;
        return oldData.filter((item) => item._id !== id);
      });

      // Also invalidate to ensure sync with backend
      queryClient.invalidateQueries({ queryKey: ["allTestBookings"] });
      
      Swal.fire('Success', 'Report submitted successfully!', 'success');
      navigate('/reports');
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Failed to submit report.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="loading loading-infinity loading-xl text-sky-600"></span>
      </div>
    );
  }

  if (!booking) return <div className="text-center p-10">Booking not found</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-sky-600 mb-6 font-medium transition-colors group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Reports
        </button>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-sky-600 to-blue-700 p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <h1 className="text-2xl font-bold mb-2 relative z-10">Submit Diagnostic Report</h1>
            <p className="opacity-90 relative z-10">Booking ID: <span className="font-mono bg-white/20 px-2 py-0.5 rounded">{booking._id}</span></p>
          </div>

          <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Patient Info */}
            <div className="lg:col-span-1 space-y-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <FaUser className="text-sky-600" /> Patient Information
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-500 uppercase font-bold mb-1">Name</p>
                  <p className="font-semibold text-slate-800 text-lg">{booking.name}</p>
                </div>
                
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm text-sky-600"><FaEnvelope /></div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold">Email</p>
                    <p className="font-medium text-slate-800 truncate max-w-[180px]">{booking.email}</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm text-sky-600"><FaPhone /></div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold">Phone</p>
                    <p className="font-medium text-slate-800">{booking.phone}</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-500 uppercase font-bold mb-2">Requested Tests</p>
                  <ul className="space-y-2">
                    {booking.tests.map((t, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                        <FaFlask className="text-sky-400 text-xs" /> {t.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Column: Upload & Action */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
                <FaFilePdf className="text-red-500" /> Upload Report PDF
              </h3>

              {/* Upload Area */}
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:bg-slate-50 transition-colors relative min-h-[200px] flex flex-col items-center justify-center">
                
                {!pdfFile && !pdfUrl && (
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    disabled={uploading || isSubmitting}
                  />
                )}
                
                {!pdfFile && !pdfUrl ? (
                  <div className="pointer-events-none">
                    <div className="w-16 h-16 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaUpload className="text-2xl" />
                    </div>
                    <p className="text-lg font-semibold text-slate-700">Click to upload PDF</p>
                    <p className="text-sm text-slate-500 mt-1">or drag and drop here</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaFilePdf className="text-3xl" />
                    </div>
                    <p className="text-lg font-semibold text-slate-800 truncate max-w-xs">
                      {pdfFile ? pdfFile.name : "Report Uploaded"}
                    </p>
                    <p className="text-sm text-green-600 font-medium mt-2 flex items-center gap-1">
                      <FaCheckCircle /> Ready to submit
                    </p>
                    
                    {!pdfUrl && (
                       <button 
                         onClick={() => setPdfFile(null)}
                         className="mt-4 px-4 py-1.5 text-xs font-bold text-white bg-red-500 hover:bg-red-600 rounded-full transition-colors shadow-sm flex items-center gap-2"
                       >
                         <FaTimes /> Remove File
                       </button>
                    )}
                  </div>
                )}
              </div>

              {uploading && (
                <div className="mt-4 text-center">
                  <span className="loading loading-spinner loading-md text-sky-600"></span>
                  <p className="text-sm text-slate-500 mt-2">Uploading PDF...</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-slate-100">
                <button
                  onClick={() => navigate(-1)}
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReport}
                  disabled={isSubmitting || uploading || (!pdfFile && !pdfUrl)}
                  className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                    isSubmitting || uploading || (!pdfFile && !pdfUrl)
                      ? "bg-slate-300 cursor-not-allowed"
                      : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:shadow-emerald-200 hover:-translate-y-0.5"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span> Submitting...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle /> Submit Final Report
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportSubmit;