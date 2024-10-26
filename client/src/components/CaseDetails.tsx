import React from "react";

interface CaseDetailsProps {
  label: string;
  value: string;
  type?: "file" | "";
  url?: string;
}

const CaseDetails: React.FC<CaseDetailsProps> = ({ label, value, type = "", url = "" }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-1">
      {type === "file" ? (
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:underline">
          {value}
        </a>
      ) : (
        <>
          <span className="font-bold">{label}</span>
          <span className="text-gray-600">{value}</span>
        </>
      )}
    </div>
  );
};

export default CaseDetails;
