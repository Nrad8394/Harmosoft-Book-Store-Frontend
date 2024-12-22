import React from "react";

interface SchoolCardProps {
  school: {
    id: string;
    organization_name: string;
    location: string;
    level: string;
    curriculum: string;
    address: string;
    email: string;
    image: string | null;
  };
  onClick: (school: any) => void; // To handle school selection
}

const SchoolCard: React.FC<SchoolCardProps> = ({ school, onClick }) => {
  return (
    <div
      className="cursor-pointer p-4 bg-gray-50 hover:bg-gray-100 rounded-md shadow-md"
      onClick={() => onClick(school)}
    >
      {/* Display School Info */}
      <h3 className="text-sm font-semibold">{school.organization_name}</h3>
      <p className="text-xs text-gray-600">
        {school.level} | {school.curriculum}
      </p>
      <p className="text-xs text-gray-600">{school.location || school.address}</p>
      {school.image && (
        <div className="mt-2">
          <img src={school.image} alt={`${school.organization_name} logo`} className="h-10 w-10 rounded-full" />
        </div>
      )}
    </div>
  );
};

export default SchoolCard;
