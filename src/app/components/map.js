"use client"
import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import * as maptilersdk from '@maptiler/sdk';
import 'maplibre-gl/dist/maplibre-gl.css';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import './map.css';

const API_KEY = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;
maptilersdk.config.apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;

export default function Map() {
  const mapContainer = useRef(null);
  const map = useRef(null);

  const lng = -80.516670;
  const lat = 43.466667;
  const zoom = 3;
  

  useEffect(() => {
    if (map.current) return; // initialize map only once

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: [lng, lat], // starting position [lng, lat]
      zoom: zoom, // starting zoom
      projectionControl: true //enable the projection control
    });

    //map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    new maplibregl.Marker({color: "#FF0000"})
    .setLngLat([lng,lat])
    .setPopup(new maplibregl.Popup().setHTML("<h1>University of Waterloo Main Campus</h1>"))
    .addTo(map.current);
  }, [API_KEY, lng, lat, zoom]);

  return (
    <div className="map-container">
      <div ref={mapContainer} className="map" />
    </div>
  );
}