import React from "react";
import CaseDetails from "./CaseDetails";
import { useSelector } from "react-redux";
import { RootState } from "src/store";

interface Document {
  id: string;
  name: string;
  url: string;
  employee: {
    role: "CRE" | "OF" | string;
  };
}

interface ShowDocumentsProps {
  canSeeCREDocuments: boolean;
  documents: Document[];
}

const ShowDocuments: React.FC<ShowDocumentsProps> = ({ canSeeCREDocuments, documents }) => {
  const role = useSelector((state: RootState) => state.auth.user?.role);
  return (
    <div className="grid gap-4 md:grid-cols-3 md:col-span-3">
      {canSeeCREDocuments && documents.some((doc) => doc.employee.role === "CRE") && (
        <div className="col-span-1">
          <p className="font-bold">CRE Documents</p>
          {documents
            .filter((doc) => doc.employee.role === "CRE")
            .map((doc) => (
              <CaseDetails key={doc.id} label="CRE Document" value={doc.name} url={doc.url} type="file" />
            ))}
        </div>
      )}
      {role !== "OF" && documents.some((doc) => doc.employee.role === "OF") && (
        <div className="col-span-1">
          <p className="font-bold">OF Documents</p>
          {documents
            .filter((doc) => doc.employee.role === "OF")
            .map((doc) => (
              <CaseDetails key={doc.id} label="OF Document" value={doc.name} url={doc.url} type="file" />
            ))}
        </div>
      )}
    </div>
  );
};

export default ShowDocuments;
