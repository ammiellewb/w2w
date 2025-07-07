import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AboutModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AboutModal({ open, onClose }: AboutModalProps) {
  if (!open) return null;
  return (
    <div
      className="cursor-auto fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/10"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative border border-gray-200 overflow-y-auto overflow-x-hidden max-h-[90vh] select-text"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label="Close"
          tabIndex={0}
        >
          <X size={22} />
        </Button>
        <h2 className="text-center text-xl font-bold text-gray-800 mb-2 break-words w-full whitespace-normal">
        🌎 What is Waterloo 2 World (W2W)? 
        </h2>
        <p className="text-center mb-4 text-gray-700 text-base break-words w-full whitespace-normal select-text">
          Waterloo 2 World helps UWaterloo students explore, compare, and share real
          experiences about international exchange programs — using live data pulled 
          directly from the official <a
          href="https://uwaterloo-horizons.symplicity.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline hover:text-blue-800 break-words whitespace-normal"
          >Waterloo Passport
          </a>. Find the right
          program, read honest reviews, and get ready for your adventure abroad.
        </p>
        <ul className="text-left list-disc pl-5 mb-4 text-gray-700 text-sm space-y-1 break-words w-full whitespace-normal select-text">
          <li>
            <span className="font-semibold">Interactive Map:</span> Discover
            exchange programs worldwide.
          </li>
          <li>
            <span className="font-semibold">Program Info:</span> See details
            like university, location, requirements, and more.
          </li>
          <li>
            <span className="font-semibold">Student Reviews:</span> Read and
            share real experiences and ratings.
          </li>
          <li>
            <span className="font-semibold">Sort & Filter:</span> Find programs
            by date, competitiveness, and more.
          </li>
          <li>
            <span className="font-semibold">Apply Easily:</span> Go straight to
            the application portal.
          </li>
          <li>
            <span className="font-semibold">Verified Comments:</span> Know which
            reviews are from real students.
          </li>
          <li>
            <span className="font-semibold">Helpful Resources:</span> Access key
            links and guides for your journey.
          </li>
        </ul>
        {/* competitiveness meaning table */}
        <div className="mb-4 w-full select-text">
          <h4 className="text-center font-semibold text-gray-700 mb-2 text-base break-words w-full whitespace-normal">
            What do the program colours mean?
          </h4>
          <table className="text-left w-full text-sm border border-gray-200 rounded mb-4">
            <tbody>
              <tr className="border border-gray-200">
                <td className="p-2 align-top w-8"><span className="inline-block w-4 h-4 rounded-full mr-2 bg-red-200"></span></td>
                <td className="p-2 align-top w-full whitespace-normal"><b>Lowest</b> - These schools are very popular and are in very high demand. <b>Less than half</b> of the students who list this school as their first choice are likely to be matched. <b>Do not</b> list this school as your second, third, or fourth choice.</td>
              </tr>
              <tr className="border border-gray-200">
                <td className="p-2 align-top w-8"><span className="inline-block w-4 h-4 rounded-full mr-2 bg-yellow-200"></span></td>
                <td className="p-2 align-top w-full whitespace-normal"><b>Low</b> - These schools are popular and students who list these schools as their first choice have a chance of getting matched. <b>Do not</b> list this school as your second, third or fourth choice.</td>
              </tr>
              <tr className="border border-gray-200">
                <td className="p-2 align-top w-8"><span className="inline-block w-4 h-4 rounded-full mr-2 bg-green-200"></span></td>
                <td className="p-2 align-top w-full whitespace-normal"><b>Moderate</b> - Students who list this school as their first choice have the highest likelihood of getting matched. You may get matched if you list this as your second, third or fourth choice.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mb-4 w-full">
          <h4 className="text-center font-semibold text-gray-700 mb-1 text-base break-words w-full whitespace-normal">
            How to get started:
          </h4>
          <ol className="list-decimal pl-5 text-gray-700 text-sm space-y-1 break-words w-full whitespace-normal text-left select-text">
            <li>Search or browse for a program using the map or search bar.</li>
            <li>Click a program to see details, reviews, and how to apply.</li>
            <li>Read what other students have shared.</li>
            <li>Leave your own review and rating after your exchange.</li>
            <li>Check out comments, resources, and links to help you prepare.</li>
          </ol>
        </div>
        <div className="mb-4 w-full select-text text-center">
          <h4 className="font-semibold text-gray-700 mb-1 text-base break-words w-full whitespace-normal">
            For more information:
          </h4>
          <span className="text-gray-700 text-sm">
            Speak with your{" "}
            <a
              href="https://uwaterloo.ca/student-success/students/study-abroad-and-exchanges/go-abroad/application-steps#reps"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline font-medium text-sm hover:text-blue-800 break-words whitespace-normal"
            >
              Faculty Exchange Representative
            </a>{" "}
            about your study plans.
          </span>
        </div>
        <div className="mb-4 w-full select-text text-center">
          <h4 className="font-semibold text-gray-700 mb-1 text-base break-words w-full whitespace-normal">
            Have a question?
          </h4>
          <span className="text-gray-700 text-sm">
            The Global Learning Coordinators can help!
          </span>
          <br />
          <span className="text-gray-700 text-sm">
            Email them at{" "}
            <a
              href="mailto:studyabroad@uwaterloo.ca"
              className="text-blue-600 underline font-medium text-sm hover:text-blue-800 break-words whitespace-normal"
            >
              studyabroad@uwaterloo.ca
            </a>
          </span>
        </div>
        <div className="mb-4 w-full select-text text-center">
          <h4 className="font-semibold text-gray-700 mb-1 text-base break-words w-full whitespace-normal">
            Support Available:
          </h4>
          <span className="text-gray-700 text-sm">
            <a
              href="https://uwaterloo-horizons.symplicity.com/outgoing/_dlcache_f59cc7302b4dbcbef1634e3d3eb0f29c_WellnessResourcesforExhcangeStudents.pdf?i=895fb6759e8f0b9a73cf6bb088b854de"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline font-medium text-sm hover:text-blue-800 break-words whitespace-normal"
            >
              Wellness Resources for Exchange Students (PDF)
            </a>
          </span>
        </div>
        
      </div>
    </div>
  );
}
