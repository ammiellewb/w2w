import React, { useState } from 'react';
import { Home, Bookmark, Share2, HelpCircle, SlidersHorizontal, ArrowUpDown, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Navbar(){
  const [isDisclaimerVisible, setIsDisclaimerVisible] = useState(true);

  if (!isDisclaimerVisible) {
    return null;
  }

  return (
    <nav className="w-full bg-blue-50 border-b border-blue-200 py-1 px-4 relative z-50">
      <div className="flex items-center justify-center">
        <span className="text-xs text-blue-800 text-center">
          ⚠️ This an{" "}
          <a 
            href="https://github.com/ammiellewb/w2w"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-blue-900"
          >
            independent, student-created tool
          </a> 
          . For official information, visit{" "}
          <a
            href="https://uwaterloo.ca/international-experience/exchange-and-study-abroad"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-blue-900"
          >
            UW International Experience Centre
          </a>
          {" "}and{" "}
          <a 
            href="https://uwaterloo-horizons.symplicity.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="underline hover:text-blue-900"
          >
            Waterloo Passport
          </a>
          {"."}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsDisclaimerVisible(false)}
          className="absolute right-2 h-4 w-4 p-0 text-blue-600 hover:text-blue-800"
          aria-label="Close disclaimer"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </nav>
  );
}