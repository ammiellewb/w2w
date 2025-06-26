"use client" 
import React, { useState } from 'react';
import { Search, X, ArrowUpDown, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Searchbar(){
    const [searchQuery, setSearchQuery] = useState("")
    const [showFilters, setShowFilters] = useState(false)
    const [showSorts, setSShowSorts] = useState(false)

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
        <div className="p-4 border-b border-gray-200">
                <div className="flex space-x-2">
                <Button 
                    variant="secondary" 
                    size="sm" 
                    className="flex items-center space-x-2"
                    onClick={()=>setShowSorts(!showSorts)}
                >
                    <ArrowUpDown className="h-4 w-4" />
                    <span>Sort</span>
                </Button>
                <Button
                    variant="secondary"
                    size="sm"
                    className="flex items-center space-x-2"
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <SlidersHorizontal className="h-4 w-4" />
                    <span>Filters</span>
                </Button>
            </div>

        </div>
        </div>
        
    )
}