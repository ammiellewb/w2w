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
  const [showSorts, setSShowSorts] = useState(false)
  const [selectedProgram, setSelectedProgram] = useState(null)

  return (
    <div className="h-screen flex flex-col bg-gray-50">
     { /* <Navbar /> */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */} 
        <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        <Searchbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <Programs selectedProgram={selectedProgram} setSelectedProgram={setSelectedProgram} searchQuery={searchQuery} />
        </div>
        {/* Details Pane */}
        {selectedProgram && (
          <div className="w-96 bg-white border-r border-gray-200">
            <ProgramDetails program={selectedProgram} />
          </div>
        )}
          
        <div className="flex-1 relative bg-blue-200">
          <Map selectedProgram={selectedProgram} onProgramSelect={setSelectedProgram} />
        </div>
      </div>
    </div>
  );
}

export default App;