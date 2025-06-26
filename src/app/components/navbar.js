import React from 'react';
import { Home, Bookmark, Share2, HelpCircle, SlidersHorizontal, ArrowUpDown, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Navbar(){
  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
                <Button variant="ghost" size="sm" className="p-2">
                    <Home className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <Bookmark className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <Share2 className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <HelpCircle className="h-3 w-3" />
                </Button>
            </div>
            <h1 className="text-xl font-semibold text-gray-800">Waterloo 2 World (W2W)</h1>
        </div>
        
    </nav>
  );
}