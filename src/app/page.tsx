"use client"

import { useState, useEffect } from "react"

import Image from "next/image";
import maplibregl from 'maplibre-gl';
import Navbar from './components/navbar.js';
import Map from './components/map.js';
import Searchbar from './components/searchbar.js';
import Programs from './components/programs.js';
import ProgramDetails from './components/programdetails.js';
import 'maplibre-gl/dist/maplibre-gl.css';
import "@maptiler/sdk/dist/maptiler-sdk.css";

import './globals.css';

function App() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedProgram, setSelectedProgram] = useState(null)
  const [filters, setFilters] = useState({
    likeliness: [],
    languages: [],
    faculties: [],
    type: [],
    academic_level: [],
  });
  const [displayedCount, setDisplayedCount] = useState(0);
  // const [sortOption, setSortOption] = useState(null);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
     { /* <Navbar /> */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */} 
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col relative">
        <Searchbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} filters={filters} setFilters={setFilters}  />
        <Programs selectedProgram={selectedProgram} setSelectedProgram={setSelectedProgram} searchQuery={searchQuery} filters={filters} setDisplayedCount={setDisplayedCount} />
        <div className="absolute bottom-0 left-0 w-full bg-white border-t border-gray-200 py-2 px-4 text-center shadow-md z-10">
          <span className="font-medium text-sm text-gray-700">{displayedCount} program{displayedCount === 1 ? '' : 's'} displayed</span>
        </div>
        </div>
        {/* Map Area */}
        <div className="flex-1 relative bg-blue-200">
          <Map selectedProgram={selectedProgram} onProgramSelect={setSelectedProgram} />
          {selectedProgram && (
            <div className="fixed top-4 bottom-4 left-80 z-30 w-90 max-w-full">
              <ProgramDetails program={selectedProgram} onClose={() => setSelectedProgram(null)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;