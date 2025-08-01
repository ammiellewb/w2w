"use client"

import { useState, useEffect } from "react"
import AboutModal from './components/about';

import Image from "next/image";
import maplibregl from 'maplibre-gl';
import Navbar from './components/navbar';
import Map from './components/map.js';
import Searchbar from './components/searchbar.js';
import Programs from './components/programs.js';
import ProgramDetails from './components/programdetails.js';
import {X, Map as ButtonMap, AlignJustify} from 'lucide-react';
import { Button } from "@/components/ui/button"
import 'maplibre-gl/dist/maplibre-gl.css';
import "@maptiler/sdk/dist/maptiler-sdk.css";

import './globals.css';

type ToggleViewButtonProps = {
  viewMode: 'list' | 'map';
  setViewMode: (mode: 'list' | 'map') => void;
};
function ToggleViewButton({ viewMode, setViewMode }: ToggleViewButtonProps) {
  return (
    <div className="flex rounded-full border border-gray-200 overflow-hidden shadow-md bg-white z-40">
      <button
        className={`cursor-pointer flex items-center px-5 py-1 text-sm font-semibold focus:outline-none transition-colors ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white text-slate-700'}`}
        onClick={() => setViewMode('list')}
      >
        <AlignJustify className="mr-2" />
        List
      </button>
      <button
        className={`cursor-pointer flex items-center px-5 py-1 text-sm font-semibold focus:outline-none transition-colors ${viewMode === 'map' ? 'bg-blue-500 text-white' : 'bg-white text-slate-700'}`}
        onClick={() => setViewMode('map')}
      >
        <ButtonMap className="mr-2" />
        Map
      </button>
    </div>
  );
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    function checkSize() {
      setIsMobile(window.innerWidth < 1024 || window.innerHeight < 700);
    }
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  useEffect(() => {
    setHasMounted(true);
  }, []);
  return { isMobile, hasMounted };
}

function App() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProgram, setSelectedProgram] = useState(null)
  const [filters, setFilters] = useState({
    likeliness: [],
    languages: [],
    faculties: [],
    type: [],
    academic_level: [],
    term: [],
  });
  const [displayedCount, setDisplayedCount] = useState(0);
  const { isMobile, hasMounted } = useIsMobile();
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [aboutOpen, setAboutOpen] = useState(false);

  // Reset viewMode to 'list' if on mobile and a program is closed
  useEffect(() => {
    if (isMobile) setViewMode('list');
  }, [isMobile]);

  // Helper to select a program and switch to map view on mobile
  const handleSelectProgram = (program: any) => {
    setSelectedProgram(program);
    if (isMobile && viewMode !== 'map') setViewMode('map');
  };

  // Prevent layout flash on reload
  if (!hasMounted) return null;

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {isMobile ? (
        <div className="relative w-full flex-1">
          {/* Always render map as background */}
          <div className="fixed inset-0 z-0">
            <Map 
              selectedProgram={selectedProgram} 
              onProgramSelect={handleSelectProgram} 
              detailsOpen={!!selectedProgram}
            />
            {/* Add semi-transparent overlay below list view */}
            {viewMode === 'list' && !selectedProgram && (
              <div className="absolute inset-0 z-10 pointer-events-none" />
            )}
          </div>
          {/* Show toggle only if About modal is not open and no program is selected */}
          {!aboutOpen && !selectedProgram && (
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-30">
              <ToggleViewButton
                viewMode={viewMode}
                setViewMode={mode => {
                  if (!selectedProgram) setViewMode(mode);
                }}
              />
            </div>
          )}
          {selectedProgram ? (
            <div className="fixed top-10 left-0 right-0 z-20 pointer-events-none">
              <div className="w-full max-w-xl mx-auto pointer-events-auto" style={{maxHeight: 'calc(60vh)', overflowY: 'auto'}}>
                <ProgramDetails program={selectedProgram} onClose={() => {
                  setViewMode('map');
                  setSelectedProgram(null);
                }} />
              </div>
            </div>
          ) : viewMode === 'list' ? (
            <div className="absolute inset-0 z-10 flex flex-col w-full h-full bg-white/95 pt-12">
              <Searchbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} filters={filters} setFilters={setFilters} aboutOpen={aboutOpen} setAboutOpen={setAboutOpen} />
              <Programs selectedProgram={selectedProgram} setSelectedProgram={handleSelectProgram} searchQuery={searchQuery} filters={filters} setDisplayedCount={setDisplayedCount} />
              <div className="absolute bottom-0 left-0 w-full bg-white border-t border-gray-200 py-2 px-4 text-center shadow-md z-10">
                <span className="font-medium text-sm text-gray-700">{displayedCount} program{displayedCount === 1 ? '' : 's'} displayed</span>
              </div>
            </div>
          ) : null}
          {/* About modal (mobile) */}
          {aboutOpen && <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />}
        </div>
      ) : (
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar */}
          <div className="w-90 bg-white border-r border-gray-200 flex flex-col relative">
            <Searchbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} filters={filters} setFilters={setFilters} aboutOpen={aboutOpen} setAboutOpen={setAboutOpen}  />
            <Programs selectedProgram={selectedProgram} setSelectedProgram={handleSelectProgram} searchQuery={searchQuery} filters={filters} setDisplayedCount={setDisplayedCount} />
            <div className="absolute bottom-0 left-0 w-full bg-white border-t border-gray-200 py-2 px-4 text-center shadow-md z-10">
              <span className="font-medium text-sm text-gray-700">{displayedCount} program{displayedCount === 1 ? '' : 's'} displayed</span>
            </div>
          </div>
          {/* Map Area */}
          <div className="flex-1 relative bg-blue-200">
            <Map selectedProgram={selectedProgram} onProgramSelect={setSelectedProgram} detailsOpen={false} />
            {selectedProgram && (
              <div className="fixed top-4 left-[360px] z-30 max-w-xl w-[360px] max-h-[calc(100vh-32px)] overflow-y-auto pointer-events-none">
                <div className="h-full pointer-events-auto">
                  <ProgramDetails program={selectedProgram} onClose={() => setSelectedProgram(null)} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;