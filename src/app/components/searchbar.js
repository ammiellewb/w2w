"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  X,
  ArrowUpDown,
  SlidersHorizontal,
  Bookmark,
  Share2,
  HelpCircle,
  Trash2,
  Info,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import AboutModal from "./about";
import supabase from "@/lib/supabaseClient";

const filterCategoryNames = {
  likeliness: "Likelihood",
  type: "Type",
  faculties: "Faculties",
  languages: "Languages",
  academic_level: "Academic Level",
  term: "Academic Terms",
};

export default function Searchbar({
  searchQuery,
  setSearchQuery,
  filters,
  setFilters,
  aboutOpen,
  setAboutOpen,
}) {
  const [filterOptions, setFilterOptions] = useState({
    likeliness: [],
    type: [],
    faculties: [],
    languages: [],
    academic_level: [],
    term: [],
  });
  const [activeTooltip, setActiveTooltip] = useState(null);

  useEffect(() => {
    async function fetchFilterOptions() {
      const { data, error } = await supabase
        .from("exchange_programs")
        .select("*");

      if (error) {
        console.error("Error fetching filter options:", error);
        return;
      }

      const options = {
        likeliness: [...new Set(data.map((p) => p.likeliness).filter(Boolean))],
        type: [...new Set(data.map((p) => p.type).filter(Boolean))],
        faculties: [
          ...new Set(data.flatMap((p) => p.faculties || []).filter(Boolean)),
        ],
        languages: [
          ...new Set(data.flatMap((p) => p.languages || []).filter(Boolean)),
        ],
        academic_level: ["Graduate", "Undergraduate"],
        term: [
          ...new Set(data.flatMap((p) => p.term || []).filter(Boolean)),
        ],
      };
      setFilterOptions(options);
    }
    fetchFilterOptions();
  }, []);

  const handleFilterChange = (category, value, checked) => {
    setFilters((prevFilters) => {
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
      term: [],
    });
  };

  const isFilterActive = Object.values(filters).some(
    (arr) => Array.isArray(arr) && arr.length > 0
  );

  return (
    <div className="">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4" />
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search for programs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-8"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery("")}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="p-3 border-b border-gray-200">
        <div className="flex justify-between items-center px-2">
          <Button
            variant="secondary"
            size="sm"
            className="cursor-pointer flex items-center space-x-1 px-2"
            onClick={()=>setAboutOpen(true)}
          >
            <HelpCircle className="h-3 w-3" />
            <span className="text-sm">About</span>
          </Button>
          {aboutOpen && (
            <AboutModal open={aboutOpen} onClose={() => setAboutOpen(null)} />
          )}
          {/* <Button 
                    variant="secondary" 
                    size="sm" 
                    className="flex items-center space-x-1 px-2"
                    //onClick={()=>setShowSorts(!showSorts)}
                >
                    <ArrowUpDown className="h-3 w-3" />
                    <span className="text-sm">Sort</span>
                </Button> */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="secondary"
                size="sm"
                className={`cursor-pointer flex items-center space-x-1 px-2  ${
                  isFilterActive ? "bg-gray-200 hover:bg-gray-200" : ""
                }`}
              >
                <SlidersHorizontal className="h-3 w-3" />
                <span className="text-sm">Filters</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-90 max-h-96 overflow-y-auto relative" sideOffset={5} align="center">
              {isFilterActive && (
                <Button
                  variant="danger"
                  size="icon"
                  className="absolute top-2 right-2 text-gray-600 hover:text-red-600 z-10"
                  onClick={handleClearAll}
                  aria-label="Clear All Filters"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              )}
              <div className="grid gap-4 pr-8">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Filter programs by the following criteria.
                  </p>
                </div>
                <div className="grid gap-y-4">
                  {Object.entries(filterOptions).map(
                    ([category, options]) =>
                      options.length > 0 && (
                        <div key={category}>
                          <div className="flex items-center gap-2 mb-2">
                            <h5 className="font-medium text-xs">
                              {filterCategoryNames[category]}
                            </h5>
                            {category === "languages" && (
                              <div className="group relative">
                                <Info 
                                  className="h-3 w-3 text-gray-400 cursor-help" 
                                  onClick={() => setActiveTooltip(activeTooltip === 'languages' ? null : 'languages')}
                                />
                                <div className={`absolute left-0 bottom-full mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded transition-opacity duration-200 z-50 w-60 ${
                                  activeTooltip === 'languages' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                }`}>
                                  All partner institutions teach in English
                                  <div className="absolute top-full left-4 border-4 border-transparent border-t-gray-800"></div>
                                </div>
                              </div>
                            )}
                            {category === "term" && (
                              <div className="group relative">
                                <Info 
                                  className="h-3 w-3 text-gray-400 cursor-help" 
                                  onClick={() => setActiveTooltip(activeTooltip === 'term' ? null : 'term')}
                                />
                                <div className={`absolute left-0 bottom-full mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded transition-opacity duration-200 z-50 w-52 ${
                                  activeTooltip === 'term' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                }`}>
                                  Terms at partner institutions don't always align with Waterloo's term schedule
                                  <div className="absolute top-full left-4 border-4 border-transparent border-t-gray-800"></div>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {options.map((option) => (
                              <div
                                key={option}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`${category}-${option}`}
                                  checked={
                                    filters?.[category]?.includes(option) ??
                                    false
                                  }
                                  onCheckedChange={(checked) =>
                                    handleFilterChange(
                                      category,
                                      option,
                                      checked
                                    )
                                  }
                                />
                                <Label
                                  htmlFor={`${category}-${option}`}
                                  className="text-xs font-normal leading-snug"
                                >
                                  {option}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                  )}
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
        </div>
      </div>
    </div>
  );
}
