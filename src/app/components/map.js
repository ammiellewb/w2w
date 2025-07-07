"use client"
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Card, CardContent } from "@/components/ui/card";
import { CircleArrowRight, X } from 'lucide-react';
import maplibregl from 'maplibre-gl';
import * as maptilersdk from '@maptiler/sdk';
import supabase from '@/lib/supabaseClient';
import 'maplibre-gl/dist/maplibre-gl.css';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import './map.css';

const API_KEY = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;
maptilersdk.config.apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;

export default function Map({ selectedProgram, onProgramSelect }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  const lng = -80.5474379;
  const lat = 43.4722854;
  const zoom = 3;

  // fetch programs from Supabase
  useEffect(() => {
    async function fetchPrograms() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('exchange_programs')
          .select('program_id, name, university, lat, lng')
          .not('lat', 'is', null)
          .not('lng', 'is', null);

        if (error) {
          console.error('Error fetching programs:', error);
        } else {
          setPrograms(data || []);
        }
      } catch (err) {
        console.error('Error fetching programs:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPrograms();
  }, []);

  // Zoom to selected program when it changes
  useEffect(() => {
    if (!map.current || !selectedProgram) return;

    // Find the selected program in the programs array
    const selectedProgramData = programs.find(p => p.name === selectedProgram.name);
    
    if (selectedProgramData && selectedProgramData.lat && selectedProgramData.lng) {
      map.current.flyTo({
        center: [selectedProgramData.lng, selectedProgramData.lat],
        zoom: 6,
        duration: 1000
      });
      // Close all popups first
      Object.values(markerRefs.current).forEach(marker => {
        if (marker.getPopup()) marker.getPopup().remove();
      });
      // Open the popup for the selected program's marker
      const marker = markerRefs.current[selectedProgramData.program_id];
      console.log(marker);
      if (marker && !marker.getPopup().isOpen()) {
        marker.togglePopup();
      }
    }
  }, [selectedProgram, programs]);

  // Store marker references for each program
  const markerRefs = useRef({});

  useEffect(() => {
    if (map.current) return; // initialize map only once

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: [lng, lat], // starting position [lng, lat]
      zoom: zoom, // starting zoom
      projectionControl: true //enable the projection control
    });

    // map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    // Waterloo home icon
    const el = document.createElement('div')
      el.className = 'marker'
      Object.assign(el.style, {
        width: '32px',
        height: '32px',
        backgroundImage: 'url(/uni-pin.png)',   // from public/uni-pin.png
        backgroundSize:   'contain',
        backgroundRepeat: 'no-repeat',
      })

    const popupContent = document.createElement('div');

    // Waterloo popup content
    ReactDOM.createRoot(popupContent).render(
      <Card className="p-0 m-0 shadow-lg rounded-lg border-none" style={{ minWidth: 220 }}>

        <CardContent className="p-4">
          <div className="flex items-center mb-1">
            <h3 className="font-medium text-sm underline mr-2">University of Waterloo</h3>
          </div>
          <div className="flex justify-between items-center mb-2">
            <div className="text-xs font-medium">Main Campus</div>
            <CircleArrowRight
              className="text-blue-600 hover:text-blue-800"
              size={22}
              style={{ cursor: "pointer", marginLeft: 12 }}
              // target="_blank"
              // rel="noopener noreferrer"
              onClick={() => {window.open('https://uwaterloo.ca/future-students/programs/exchange-programs', '_blank')}}
            />
          
          </div>
        </CardContent>
      </Card>);

    // Add Waterloo marker
    new maplibregl.Marker({ element: el, anchor: 'bottom' })
    .setLngLat([lng,lat])
    .setPopup(new maplibregl.Popup().setDOMContent(popupContent))
    .addTo(map.current);
  }, [API_KEY, lng, lat, zoom]);

  // Add program markers when programs data is loaded
  useEffect(() => {
    if (!map.current || loading || programs.length === 0) return;

    programs.forEach(program => {
      if (program.lat && program.lng) {
        // create custom image marker
        const el = document.createElement('div')
        el.className = 'marker'
        Object.assign(el.style, {
          width: '32px',
          height: '32px',
          backgroundImage: 'url(/red-pin.png)',   // from public/red-pin.png
          backgroundSize:   'contain',
          backgroundRepeat: 'no-repeat',
        })
        

        // exchange program popup content
        const popupContent = document.createElement('div');

        ReactDOM.createRoot(popupContent).render(
          <Card
            className="p-0 m-0 shadow-lg rounded-lg border-none"
            style={{ minWidth: 220 }}
          >
            <CardContent className="p-4">
              <div className="flex items-center mb-1">
                <h3 className="font-medium text-sm underline mr-2">
                  {program.name}
                </h3>
              </div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-medium">{program.university}</div>
                <CircleArrowRight
                  className="text-blue-600 hover:text-blue-800"
                  size={22}
                  style={{ cursor: "pointer", marginLeft: 8 }}
                  onClick={() => {
                    if (onProgramSelect) {
                      onProgramSelect(program);
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>
        );

        const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
          .setLngLat([program.lng, program.lat])
          .setPopup(new maplibregl.Popup().setDOMContent(popupContent))
          .addTo(map.current);
        markerRefs.current[program.program_id] = marker;
      }
    });
  }, [programs, loading]);

  return (
    <div className="map-container">
      <div ref={mapContainer} className="map" />
      {loading && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          background: 'rgba(255, 255, 255, 0.9)',
          padding: '8px 12px',
          borderRadius: '4px',
          fontSize: '12px',
          zIndex: 1000
        }}>
          Loading program locations...
        </div>
      )}
    </div>
  );
}