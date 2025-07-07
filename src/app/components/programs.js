"use client"
import React, { useState, useEffect } from 'react';
import supabase from '@/lib/supabaseClient';
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

function getColor(likeliness) {
  switch (likeliness) {
    case "Moderate":
      return "bg-green-200";
    case "Low":
      return "bg-yellow-200";
    case "Lowest":
      return "bg-red-200";
    default:
      return "bg-gray-200";
  }
}

export default function Programs({ selectedProgram, setSelectedProgram, searchQuery = "", filters, setDisplayedCount }){
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchPrograms() {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('exchange_programs')
                    .select('*')
                    .order('name');

                if (error) {
                    throw error;
                }

                setPrograms(data || []);
            } catch (err) {
                console.error('Error fetching programs:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchPrograms();
    }, []);

    // Filter programs based on search query
    const searchedPrograms = programs.filter(program => {
        if (!searchQuery) return true;
        
        const query = searchQuery.toLowerCase();
        return (
            program.name?.toLowerCase().includes(query) ||
            program.university?.toLowerCase().includes(query) ||
            program.location?.toLowerCase().includes(query) ||
            program.likeliness?.toLowerCase().includes(query)
        );
    });

    const filteredPrograms = searchedPrograms.filter(program => {
        return Object.entries(filters).every(([category, values]) => {
            if (!values || values.length === 0) {
                return true;
            }

            const programValue = program[category];
            
            if (category === 'academic_level') {
                if (!programValue) return false;
                return values.some(filterValue => programValue.includes(filterValue));
            }
            
            if (Array.isArray(programValue)) {
                // Handle cases where the program property is an array (e.g., languages)
                return values.some(filterValue => programValue.includes(filterValue));
            }
            
            return values.includes(program[category]);
        });
    });

    useEffect(() => {
        if (setDisplayedCount) {
            setDisplayedCount(filteredPrograms.length);
        }
    }, [filteredPrograms.length, setDisplayedCount]);

    if (loading) {
        return (
            <div className="flex-1 overflow-y-auto flex items-center justify-center">
                <div className="text-gray-500">Loading programs...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 overflow-y-auto flex items-center justify-center">
                <div className="text-red-500">Error loading programs: {error}</div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto pb-10">
            {filteredPrograms.length === 0 ? (
                <div className="flex items-center justify-center p-8">
                    <div className="text-gray-500">No programs found</div>
                </div>
            ) : (
                filteredPrograms.map((program) => (
                    <Card
                        key={program.program_id}
                        className={`p-0 m-3 cursor-pointer transition-all hover:shadow-md ${getColor(program.likeliness)} ${
                      selectedProgram?.program_id === program.program_id ? "ring-2 ring-blue-500" : ""
                    }`}
                        onClick={() => setSelectedProgram(selectedProgram?.program_id === program.program_id ? null : program)}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-center mb-1">
                                <h3 className="font-medium text-sm underline mr-2">{program.name}</h3>
                                {program.is_new && <Badge className="mb-2 bg-green-600 text-white align-left">*NEW*</Badge>}
                            </div>
                            <div className="flex justify-between items-start mb-1">
                                <div className="text-xs font-medium">{program.university}</div>
                                <div className="text-sm font-medium text-right">{program.location}</div>
                            </div>
                        </CardContent>
                    </Card>
                ))
            )}
        </div>
    );
}