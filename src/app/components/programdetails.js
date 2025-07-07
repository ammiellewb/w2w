import React, { useState, useEffect } from "react";
import supabase from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Rating from "@mui/material/Rating";
import {
  ExternalLink,
  Link as LucideLink,
  ChevronDown,
  ChevronUp,
  X as LucideX,
  Star,
} from "lucide-react";
import NextLink from "next/link";
import CommentsSection from "./commentssections";

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

export default function ProgramDetails({ program, onClose }) {
  const [detailedProgram, setDetailedProgram] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showLinks, setShowLinks] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [averageRating, setAverageRating] = useState(null);
  const [ratingCount, setRatingCount] = useState(0);
  console.log(averageRating);

  useEffect(() => {
    if (program && program.program_id) {
      fetchDetailedProgram();
      fetchAverageRating();
    }
  }, [program]);

  async function fetchDetailedProgram() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("exchange_programs")
        .select("*")
        .eq("program_id", program.program_id)
        .single();

      if (error) {
        console.error("Error fetching detailed program:", error);
        setDetailedProgram(program); // Fallback to passed program data
      } else {
        setDetailedProgram(data);
      }
    } catch (err) {
      console.error("Error fetching detailed program:", err);
      setDetailedProgram(program); // Fallback to passed program data
    } finally {
      setLoading(false);
    }
  }

  async function fetchAverageRating() {
    try {
      const { data, error } = await supabase
        .from("program_ratings")
        .select("avg_rating, rating_count")
        .eq("program_id", program.program_id)
        .single();

      console.log(data);

      if (error) {
        console.error("Error fetching ratings:", error);
      }

      if (data.avg_rating > 0) {
        setAverageRating(data.avg_rating);
        setRatingCount(data.rating_count);
      } else {
        setAverageRating(null);
        setRatingCount(0);
      }
    } catch (err) {
      setAverageRating(null);
      setRatingCount(0);
    }
  }

  if (!program) {
    return (
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          background: "rgba(255, 255, 255, 0.9)",
          padding: "8px 12px",
          borderRadius: "4px",
          fontSize: "12px",
          zIndex: 1000,
        }}
      >
        <div>Select a program to view details</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          background: "rgba(255, 255, 255, 0.9)",
          padding: "8px 12px",
          borderRadius: "4px",
          fontSize: "12px",
          zIndex: 1000,
        }}
      >
        <div>Loading program details...</div>
      </div>
    );
  }

  const programData = detailedProgram || program;
  const relevantLinks = programData.relevant_links;

  return (
    <div className="h-full overflow-y-auto p-4 bg-transparent">
      <Card className="mb-4">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-1 text-gray-500 hover:text-gray-700 h-6.5 w-6.5 p-0"
            aria-label="Close"
          >
            <LucideX className="h-6 w-6" size={16} />
          </Button>
          <div className="flex items-start gap-0 justify-between">
            <CardTitle className="text-lg underline">
              {programData.name}
            </CardTitle>
            <div className="flex flex-col items-end gap-2 ml-6 pr-3">
              <Button
                asChild
                className="bg-blue-600 hover:bg-blue-700 text-white text-base font-bold h-6.5"
              >
                <NextLink
                  href={
                    programData.url ||
                    `https://uwaterloo-horizons.symplicity.com/?s=programs&mode=form&id=${programData.program_id}`
                  }
                  // {programData.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  APPLY <ExternalLink size={22} />
                </NextLink>
              </Button>
              {averageRating && (
                <div className="flex flex-col items-center mt-2">
                  <span className="text-sm text-gray-700 font-bold mb-1">
                    Reviews
                  </span>
                  <Rating
                    value={averageRating}
                    readOnly
                    icon={<Star size={22} fill="#facc15" stroke="#facc15" />}
                    emptyIcon={
                      <Star size={22} fill="#e5e7eb" stroke="#e5e7eb" />
                    }
                  />
                  <span className="text-xs text-gray-700 mt-1">
                    {averageRating.toFixed(2)} / 5
                  </span>
                  <span className="text-xs text-gray-500">
                    (from {ratingCount} student{ratingCount === 1 ? "" : "s"})
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-gray-700">University</h4>
                <p className="text-sm">{programData.university}</p>
              </div>
              {programData.is_new && (
                  <Badge className="bg-green-600 text-white text-base font-medium h-6.5">
                    *NEW*
                  </Badge>
              )}
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-700">Location</h4>
              <p className="text-sm">{programData.location}</p>
            </div>

            <div>
              <div
                className="flex items-center gap-2 cursor-pointer select-none"
                onClick={() => setShowDetails((v) => !v)}
              >
                <h4 className="font-bold text-sm text-gray-700">
                  Program Details
                </h4>
                {showDetails ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </div>
              {showDetails && (
                <div className="space-y-1 flex flex-col gap-1 mt-1">
                  <h4 className="font-medium text-sm text-gray-700">
                    Competitiveness
                  </h4>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={`${getColor(
                        programData.likeliness
                      )} text-gray-800`}
                    >
                      {programData.likeliness}
                    </Badge>
                    {programData.spots_available > 0 && (
                      <div>
                        <p className="text-sm">
                          ≈ {programData.spots_available} spot
                          {programData.spots_available === 1 ? "" : "s"}{" "}
                          available
                        </p>
                      </div>
                    )}
                  </div>

                  {programData.type && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-700">
                        Type
                      </h4>
                      <Badge key={programData.type} variant="outline">
                        {programData.type}
                      </Badge>
                      <p className="text-sm text-gray-600">{}</p>
                    </div>
                  )}

                  {programData.duration && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-700">
                        Duration
                      </h4>
                      <p className="text-sm text-gray-600">
                        {programData.duration}
                      </p>
                    </div>
                  )}

                  {programData.faculties &&
                    programData.faculties.length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm text-gray-700">
                          Faculties
                        </h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {programData.faculties.map((faculty) => (
                            <Badge key={faculty} variant="outline">
                              {faculty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                  {programData.languages &&
                    programData.languages.length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm text-gray-700">
                          Languages
                        </h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {programData.languages.map((lang) => (
                            <Badge key={lang} variant="outline">
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                  {programData.academic_level &&
                    programData.academic_level.length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm text-gray-700">
                          Academic Level
                        </h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {programData.academic_level.map((level) => (
                            <Badge key={level} variant="outline">
                              {level}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                  {programData.requirements && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-700">
                        Requirements
                      </h4>
                      <p className="text-sm text-gray-600">
                        {programData.requirements}
                      </p>
                    </div>
                  )}

                  {programData.programs_available &&
                    programData.programs_available.length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm text-gray-700">
                          Programs Available
                        </h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {programData.programs_available.map((lang) => (
                            <Badge key={lang} variant="outline">
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* TO-DO */}
                  {programData.cost && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700">
                        Cost
                      </h4>
                      <p className="text-sm">{programData.cost}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <CommentsSection
              programId={programData.program_id}
              showComments={showComments}
              setShowComments={setShowComments}
              onNewReview={fetchAverageRating}
            />

            {relevantLinks && relevantLinks.length > 0 && (
              <div>
                <div
                  className="flex items-center gap-2 cursor-pointer select-none"
                  onClick={() => setShowLinks((v) => !v)}
                >
                  <h4 className="font-bold text-sm text-gray-700">
                    Relevant Links
                  </h4>
                  {showLinks ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                  <span className="text-xs text-gray-500">
                    ({relevantLinks.length})
                  </span>
                </div>
                {showLinks && (
                  <div className="space-y-1 flex flex-col gap-1 mt-1">
                    {relevantLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-1 max-w-[300px]"
                      >
                        <span className="truncate whitespace-nowrap max-w-[300px] overflow-hidden block">
                          {link.replace(/^https?:\/\//, "").replace("www.", "")}
                        </span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
