"use client" 
import React, { useState, useEffect } from 'react';
import { Search, X, ArrowUpDown, SlidersHorizontal, Bookmark, Share2, HelpCircle, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const filterCategoryNames = {
    likeliness: 'Competitiveness',
    languages: 'Languages',
    faculties: 'Faculties',
    type: 'Type',
    academic_level: 'Academic Level'
};

export default function Searchbar({ searchQuery, setSearchQuery, filters, setFilters, sortOption, setSortOption }){
    const [filterOptions, setFilterOptions] = useState({
        likeliness: [],
        languages: [],
        faculties: [],
        type: [],
        academic_level: [],
    });

    useEffect(() => {
        async function fetchFilterOptions() {
            const { data, error } = await supabase
                .from('exchangeprograms')
                .select('*');

            if (error) {
                console.error('Error fetching filter options:', error);
                return;
            }

            const options = {
                likeliness: [...new Set(data.map(p => p.likeliness).filter(Boolean))],
                languages: [...new Set(data.flatMap(p => p.languages || []).filter(Boolean))],
                faculties: [...new Set(data.flatMap(p => p.faculties || []).filter(Boolean))],
                type: [...new Set(data.map(p => p.type).filter(Boolean))],
                academic_level: ['Graduate', 'Undergraduate'],
            };
            setFilterOptions(options);
        }
        fetchFilterOptions();
    }, []);

    const handleFilterChange = (category, value, checked) => {
        setFilters(prevFilters => {
            const newValues = new Set(prevFilters[category] || []);
            if (checked) {
                newValues.add(value);
            } else {
                newValues.delete(value);
            }
            return {
                ...prevFilters,
                [category]: [...newValues],
            };
        });
    };

    const handleClearAll = () => {
        setSearchQuery("");
        setFilters({
            likeliness: [],
            languages: [],
            faculty: [],
            type: [],
            academic_level: [],
        });
    };

    return (
        <div className="">
            <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
                <Search className="h-4 w-4" />
                <div className="relative flex-1">
                    <Input type="text" placeholder="Search for programs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pr-8" />
                    {searchQuery && (
                        <Button variant="ghost" size="sm" onClick={() => setSearchQuery("")} className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0">
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>

            
        </div>
        <div className="p-3 border-b border-gray-200">
                <div className="flex justify-between items-center">
                <Button 
                    variant="secondary" 
                    size="sm" 
                    className="flex items-center space-x-1 px-2"
                    //onClick={()=>setShowSorts(!showSorts)}
                >
                    <ArrowUpDown className="h-3 w-3" />
                    <span className="text-sm">Sort</span>
                </Button>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="secondary"
                            size="sm"
                            className="flex items-center space-x-1 px-2"
                        >
                            <SlidersHorizontal className="h-3 w-3" />
                            <span className="text-sm">Filters</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">
                                        Filter programs by the following criteria.
                                    </p>
                                </div>
                                <div className="grid gap-y-4">
                                    {Object.entries(filterOptions).map(([category, options]) => (
                                        options.length > 0 && (
                                            <div key={category}>
                                                <h5 className="font-medium text-xs mb-2">{filterCategoryNames[category]}</h5>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {options.map(option => (
                                                        <div key={option} className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id={`${category}-${option}`}
                                                                checked={filters?.[category]?.includes(option) ?? false}
                                                                onCheckedChange={(checked) => handleFilterChange(category, option, checked)}
                                                            />
                                                            <Label htmlFor={`${category}-${option}`} className="text-xs font-normal leading-snug">
                                                                {option}
                                                            </Label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    ))}
                                </div>
                            </div>
                        </PopoverContent>
                </Popover>
                <Button 
                    variant="secondary" 
                    size="sm" 
                    className="flex items-center space-x-1 px-2"
                >
                    <Bookmark className="h-3 w-3" />
                    <span className="text-sm">Saved</span>
                </Button>
                <Button
                    variant="secondary"
                    size="sm"
                    className="flex items-center space-x-1 px-2"
                    onClick={handleClearAll}
                >
                    <Trash2 className="h-3 w-3" />
                    <span className="text-sm">Clear All</span>
                </Button>
               
            </div>

        </div>
        </div>
        
    )
}