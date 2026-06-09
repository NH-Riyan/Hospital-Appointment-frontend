import React, { useContext, useState, useRef, useEffect } from 'react'
import banner from '../../assets/banner.jpg'
import { AuthContext } from '../../Context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { FiSearch } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';
import { MdOutlineLocalHospital } from 'react-icons/md';
import { RiHeartPulseLine } from 'react-icons/ri';
import { TbChevronDown } from 'react-icons/tb';
import { BsCheckCircleFill } from 'react-icons/bs';
import useAxiosSecure from '../Hooks/useAxiosSecure';
import DoctorCard from '../Card/DoctorCard';

const specialties = [
  { name: "Cardiology",              emoji: "❤️" },
  { name: "Neurology",               emoji: "🧠" },
  { name: "Dermatology",             emoji: "🩺" },
  { name: "Orthopedics",             emoji: "🦴" },
  { name: "Pediatrics",              emoji: "👶" },
  { name: "General Medicine",        emoji: "💊" },
  { name: "Gynecology & Obstetrics", emoji: "🌸" },
  { name: "Psychiatry",              emoji: "🧘" },
  { name: "Radiology",               emoji: "🔬" },
  { name: "Oncology",                emoji: "🎗️" },
  { name: "Gastroenterology",        emoji: "🫁" },
  { name: "Endocrinology",           emoji: "⚗️" },
  { name: "Urology",                 emoji: "💧" },
  { name: "Nephrology",              emoji: "🫘" },
  { name: "Pulmonology",             emoji: "💨" },
  { name: "Ophthalmology",           emoji: "👁️" },
  { name: "ENT (Otolaryngology)",    emoji: "👂" },
  { name: "Anesthesiology",          emoji: "💉" },
  { name: "Plastic Surgery",         emoji: "✂️" },
  { name: "Physiotherapy",           emoji: "🏃" },
];

const quickTags = ["Cardiology", "Neurology", "Dermatology", "Pediatrics", "Orthopedics"];

const Banner = () => {
  const [query, setQuery]                         = useState("");
  const [searchTag, setSearchTag]                 = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [specOpen, setSpecOpen]                   = useState(false);
  const [filterQuery, setFilterQuery]             = useState("");

  const specRef       = useRef(null);
  const { user }      = useContext(AuthContext);
  const axiosInstance = useAxiosSecure();

  // ── GET: fires when searchTag changes ────────────────────────────────────
  const { isPending, isError, data: results = [] } = useQuery({
    queryKey: ["searchDoctors", searchTag],
    queryFn: async () => {
      const res = await axiosInstance.get(`/doctors/search/${searchTag}`);
      return res.data;
    },
    enabled: !!searchTag,
  });

  // ── Helpers (unchanged) ───────────────────────────────────────────────────
  const handleSearch = (e) => {
    e.preventDefault();
    buildAndSetTag(query.trim(), selectedSpecialty);
  };

  const buildAndSetTag = (q, specialty) => {
    const tag = specialty ? `${q}|${specialty}` : q;
    if (tag) setSearchTag(tag);
  };

  useEffect(() => {
    const onDocClick = (e) => {
      if (specRef.current && !specRef.current.contains(e.target)) {
        setSpecOpen(false);
        setFilterQuery("");
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  useEffect(() => {
    if (!query && !selectedSpecialty) { setSearchTag(""); return; }
    const timer = setTimeout(() => buildAndSetTag(query.trim(), selectedSpecialty), 500);
    return () => clearTimeout(timer);
  }, [query, selectedSpecialty]);

  const filtered = specialties.filter(s =>
    s.name.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const chooseSpecialty = (name) => {
    setSelectedSpecialty(name);
    setSpecOpen(false);
    setFilterQuery("");
    buildAndSetTag(query.trim(), name);
  };

  const clearSpecialty = (e) => {
    e.stopPropagation();
    setSelectedSpecialty(null);
    buildAndSetTag(query.trim(), null);
  };

  const handleQuickTag = (tag) => {
    const isActive = selectedSpecialty === tag;
    const next = isActive ? null : tag;
    setSelectedSpecialty(next);
    buildAndSetTag(query.trim(), next);
  };

  const selectedObj = specialties.find(s => s.name === selectedSpecialty);

  return (
    <div className="w-11/12 mx-auto pb-20 my-10">

      {/* ── Hero (unchanged) ── */}
      <div className="relative rounded-3xl shadow-2xl">
        <img src={banner} alt="Hospital Banner" className="w-full h-[440px] rounded-2xl object-cover" />
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-950/80 via-blue-900/55 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-center px-10 md:px-16 gap-4">

          <div className="badge badge-outline text-white border-white/30 bg-white/10 backdrop-blur-sm gap-2 py-3 px-4 text-xs font-semibold tracking-widest uppercase w-fit">
            <RiHeartPulseLine className="text-sky-400 text-sm" />
            Trusted Healthcare Platform
          </div>

          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
              Find the Right <span className="text-sky-400">Doctor,</span>
            </h1>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
              Right Away
            </h1>
            <p className="text-white/60 mt-2 text-sm font-medium">
              Search from 500+ verified specialists across all departments
            </p>
          </div>

          <div className="relative max-w-2xl" ref={specRef}>
            <form
              onSubmit={handleSearch}
              className="flex items-center bg-white/95 backdrop-blur-md rounded-2xl shadow-xl shadow-black/25 p-1.5 gap-2"
            >
              <button
                type="button"
                onClick={() => setSpecOpen(o => !o)}
                className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold
                  transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0
                  ${selectedSpecialty
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'}`}
              >
                <MdOutlineLocalHospital className="text-base shrink-0" />
                {selectedSpecialty ? (
                  <>
                    <span className="text-sm">{selectedObj?.emoji}</span>
                    <span className="max-w-[90px] truncate">{selectedSpecialty}</span>
                    <span onClick={clearSpecialty} className="ml-1 hover:opacity-70 transition-opacity">
                      <IoClose className="text-base" />
                    </span>
                  </>
                ) : (
                  <>
                    <span>Specialty</span>
                    <TbChevronDown className={`text-base transition-transform duration-200 ${specOpen ? 'rotate-180' : ''}`} />
                  </>
                )}
              </button>

              <div className="w-px h-7 bg-gray-200 shrink-0" />

              <input
                type="text"
                placeholder="Search by doctor name or symptom…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400 px-2 py-2 min-w-0"
              />

              {isPending && searchTag && (
                <span className="loading loading-spinner loading-sm text-blue-500 shrink-0" />
              )}

              <button type="submit" className="btn btn-primary rounded-xl gap-2 text-sm px-5 shrink-0 border-0 bg-blue-600 hover:bg-blue-700 text-white">
                <FiSearch className="text-base" />
                Search
              </button>
            </form>

            {specOpen && (
              <div className="absolute top-[calc(100%+10px)] left-0 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                <div className="p-3 border-b border-gray-100">
                  <input
                    type="text"
                    placeholder="Filter specialties…"
                    value={filterQuery}
                    onChange={e => setFilterQuery(e.target.value)}
                    autoFocus
                    className="input input-sm input-bordered w-full rounded-xl text-sm focus:outline-blue-400"
                  />
                </div>
                <ul className="max-h-56 overflow-y-auto py-2 px-2">
                  {filtered.length === 0 && (
                    <li className="text-center text-gray-400 text-sm py-4">No specialty found</li>
                  )}
                  {filtered.map(({ name, emoji }) => (
                    <li
                      key={name}
                      onClick={() => chooseSpecialty(name)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-sm font-medium
                        transition-colors duration-150
                        ${selectedSpecialty === name ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      <span className="text-base w-5 text-center">{emoji}</span>
                      <span className="flex-1">{name}</span>
                      {selectedSpecialty === name && <BsCheckCircleFill className="text-blue-500 text-sm" />}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mt-1">
            {quickTags.map(tag => {
              const obj = specialties.find(s => s.name === tag);
              const isActive = selectedSpecialty === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleQuickTag(tag)}
                  className={`badge gap-1.5 py-3 px-3 text-xs font-semibold cursor-pointer border transition-all duration-200
                    ${isActive
                      ? 'bg-sky-400 border-sky-400 text-blue-950'
                      : 'bg-white/10 backdrop-blur-sm border-white/25 text-white hover:bg-white/20'}`}
                >
                  {obj?.emoji} {tag}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Search Results ── */}
      {searchTag && (
        <div className="mt-8">

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                {isPending
                  ? "Searching…"
                  : `${results.length} doctor${results.length !== 1 ? 's' : ''} found`}
              </h2>
              {!isPending && (query || selectedSpecialty) && (
                <p className="text-xs text-gray-400 mt-0.5">
                  {query && <>for "<span className="text-gray-600 font-medium">{query}</span>"</>}
                  {query && selectedSpecialty && " in "}
                  {selectedSpecialty && <span className="text-blue-600 font-medium">{selectedSpecialty}</span>}
                </p>
              )}
            </div>
            <button
              onClick={() => { setSearchTag(""); setQuery(""); setSelectedSpecialty(null); }}
              className="btn btn-ghost btn-sm gap-1 text-gray-500 hover:text-red-500"
            >
              <IoClose /> Clear results
            </button>
          </div>

          {/* Error */}
          {isError && (
            <div className="alert alert-error rounded-2xl">
              <span>Something went wrong. Please try again.</span>
            </div>
          )}

          {/* Skeleton loaders — match DoctorCard shape */}
          {isPending && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
                  <div className="h-1.5 bg-gray-200 w-full" />
                  <div className="p-5 space-y-4">
                    <div className="flex gap-4">
                      <div className="w-[68px] h-[68px] rounded-2xl bg-gray-200 shrink-0" />
                      <div className="flex-1 space-y-2 pt-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-5 bg-gray-100 rounded-full w-2/4" />
                        <div className="h-4 bg-gray-100 rounded-full w-1/3" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-100 rounded w-2/3" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                    </div>
                    <div className="h-px bg-gray-100" />
                    <div className="flex gap-2">
                      <div className="flex-1 h-8 bg-gray-100 rounded-xl" />
                      <div className="flex-1 h-8 bg-blue-100 rounded-xl" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No results */}
          {!isPending && !isError && results.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <p className="text-5xl mb-4">🔍</p>
              <p className="font-bold text-gray-700 text-lg">No doctors found</p>
              <p className="text-sm text-gray-400 mt-1 mb-5">Try a different name or specialty</p>
              <button
                onClick={() => { setSearchTag(""); setQuery(""); setSelectedSpecialty(null); }}
                className="btn btn-sm btn-outline rounded-xl border-gray-300 text-gray-500"
              >
                Clear search
              </button>
            </div>
          )}

          {/* ✅ Doctor Cards Grid — mapped from results */}
          {!isPending && results.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {results.map(doctor => (
                <DoctorCard key={doctor._id} doctor={doctor} />
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default Banner;