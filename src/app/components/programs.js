"use client"
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const exchangePrograms = [
    {
      id: 1,
      name: "Chung-Ang University Exchange Program",
      university: "Chung-Ang University (CAU)",
      location: "Seoul, South Korea",
      likeliness: "Moderate",
      spotsAvailable: "2",
      isNew: true,
    },
    {
      id: 2,
      name: "Indian Institute of Technology, Delhi Exchange Program",
      university: "IIT Delhi",
      location: "Delhi, India",
      likeliness: "Low",
      spotsAvailable: "2",
      isNew: false,
    },
    {
      id: 3,
      name: "Akita International University Exchange Program",
      university: "Akita International University",
      location: "Akita, Japan",
      likeliness: "Lowest",
      spotsAvailable: "2",
      isNew: false,
    },
  ]

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

export default function Programs(){
    const [selectedProgram, setSelectedProgram] = useState(null)

    return (
        <div className="flex-1 overflow-y-auto">
            {exchangePrograms.map((program) => (
                <Card
                    key={program.id}
                    className={`p-0 m-3 cursor-pointer transition-all hover:shadow-md ${getColor(program.likeliness)} ${
                  selectedProgram === program.id ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={()=>setSelectedProgram(program.id)}
                >
                    <CardContent className="p-4">
                        <div className="flex items-center mb-1">
                            <h3 className="font-medium text-sm underline mr-2">{program.name}</h3>
                            {program.isNew && <Badge className="mb-2 bg-green-600 text-white align-left">*NEW*</Badge>}
                        </div>
                        <div className="flex justify-between items-start mb-2">
                            <div className="text-sm font-medium">{program.university}</div>
                            <div className="text-sm font-medium text-right">{program.location}</div>
                        </div>
                        <div className="text-sm text-gray-600">
                            <span className="font-medium">Likeliness - {program.likeliness}</span>
                            <br />
                            <span>Approx {program.spotsAvailable} spots available</span>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}