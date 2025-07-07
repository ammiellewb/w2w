"use client"

import { useState, useEffect } from "react"

import Image from "next/image";
import maplibregl from 'maplibre-gl';
import Navbar from './components/navbar.js';
import Map from './components/map.js';
import Searchbar from './components/searchbar.js';
import Programs from './components/programs.js';
import ProgramDetails from './components/programdetails.js';
import {X} from 'lucide-react';
import { Button } from "@/components/ui/button"
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
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    function checkSize() {
      setShowWarning(window.innerWidth < 1350 || window.innerHeight < 700);
    }
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  return (
    <>
      {showWarning && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 9999 }} className="py-3 bg-yellow-200 text-yellow-900 text-center py-2 font-semibold border-b border-yellow-400">
          <h1 className="">For the best experience, please make your browser go full screen</h1>
          <h1>(width ≥ 1350px, height ≥ 700px)</h1>
          <Button variant="ghost" size="sm" onClick={() => setShowWarning(false)} className="absolute right-1 top-4 -translate-y-1/2 h-6 w-6 p-0 hover:bg-yellow-400">
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      <div className="h-screen flex flex-col bg-gray-50">
     { /* <Navbar /> */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */} 
        <div className="w-90 bg-white border-r border-gray-200 flex flex-col relative">
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
            <div className="fixed top-4 bottom-4 left-90 z-30 w-90 max-w-full">
              <ProgramDetails program={selectedProgram} onClose={() => setSelectedProgram(null)} />
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

export default App;