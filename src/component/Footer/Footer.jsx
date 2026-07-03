import React from 'react'
import { FaHospital, FaFacebook, FaTwitter, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-slate-900 to-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <FaHospital className="text-2xl text-sky-400" />
              <span className="font-bold text-lg">MediCare</span>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              Your trusted healthcare platform for finding and booking appointments with qualified specialists.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 bg-sky-600/20 hover:bg-sky-600 rounded-lg transition text-sky-400 hover:text-white">
                <FaFacebook size={18} />
              </a>
              <a href="#" className="p-2 bg-sky-600/20 hover:bg-sky-600 rounded-lg transition text-sky-400 hover:text-white">
                <FaTwitter size={18} />
              </a>
              <a href="#" className="p-2 bg-sky-600/20 hover:bg-sky-600 rounded-lg transition text-sky-400 hover:text-white">
                <FaLinkedin size={18} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-white mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-slate-400 hover:text-sky-400 transition">Book Appointment</a></li>
              <li><a href="#" className="text-slate-400 hover:text-sky-400 transition">Find Doctors</a></li>
              <li><a href="#" className="text-slate-400 hover:text-sky-400 transition">Medical Records</a></li>
              <li><a href="#" className="text-slate-400 hover:text-sky-400 transition">Health Tips</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-slate-400 hover:text-sky-400 transition">About Us</a></li>
              <li><a href="#" className="text-slate-400 hover:text-sky-400 transition">Contact</a></li>
              <li><a href="#" className="text-slate-400 hover:text-sky-400 transition">Careers</a></li>
              <li><a href="#" className="text-slate-400 hover:text-sky-400 transition">Blog</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-slate-400">
                <FaPhone size={16} className="text-sky-400" />
                +880 1234567890
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <FaEnvelope size={16} className="text-sky-400" />
                support@medicare.com
              </li>
              <li className="flex items-start gap-2 text-slate-400">
                <FaMapMarkerAlt size={16} className="text-sky-400 mt-0.5" />
                123 Healthcare Ave, Medical City, MC 12345
              </li>
            </ul>
          </div>
        </div>

       
      </div>
    </footer>
  )
}

export default Footer