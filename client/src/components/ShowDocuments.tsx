import React, { useState } from "react";
import CaseDetails from "./CaseDetails";
import { useSelector } from "react-redux";
import axios from "axios";
import { RootState } from "src/store";
import { toast } from "react-toastify";

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
  const [fetchedData, setFetchedData] = useState<{ [key: string]: any }>({});

  const handleCheck = async (url: string, docId: string) => {
    try {
      const params = new URLSearchParams();
      params.append("url", url);

      const response = await axios.post("https://rev-geo-c-567046386755.asia-south1.run.app/get_location_time_from_url", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });

      // Update state with fetched data for the specific document
      setFetchedData((prevData) => ({
        ...prevData,
        [docId]: response.data
      }));
    } catch (error) {
      toast.error("No GPS Data Found");
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-3 md:col-span-3">
      {canSeeCREDocuments && documents.some((doc) => doc.employee.role === "CRE") && (
        <div className="col-span-1">
          <p className="font-bold">CRE Documents</p>
          {documents
            .filter((doc) => doc.employee.role === "CRE")
            .map((doc) => (
              <div key={doc.id} className="flex flex-col space-y-2">
                <CaseDetails label="CRE Document" value={doc.name} url={doc.url} type="file" />
              </div>
            ))}
        </div>
      )}
      {role !== "OF" && documents.some((doc) => doc.employee.role === "OF") && (
        <div className="col-span-1">
          <p className="font-bold">OF Documents</p>
          {documents
            .filter((doc) => doc.employee.role === "OF")
            .map((doc) => (
              <div key={doc.id} className="flex flex-col space-y-2">
                <CaseDetails label="OF Document" value={doc.name} url={doc.url} type="file" />

                {/* Check if data is already fetched for this document */}
                {fetchedData[doc.id] ? (
                  <div className="p-2 border rounded bg-gray-100">
                    <p>
                      <strong>Address:</strong> {fetchedData[doc.id].address || "Not Available"}
                    </p>
                    <p>
                      <strong>Date & Time:</strong> {fetchedData[doc.id].datetime_original || "Not Available"}
                    </p>
                    <p>
                      <strong>Latitude:</strong> {fetchedData[doc.id].latitude || "Not Available"}
                    </p>
                    <p>
                      <strong>Longitude:</strong> {fetchedData[doc.id].longitude || "Not Available"}
                    </p>
                  </div>
                ) : (
                  <button onClick={() => handleCheck(doc.url, doc.id)} className="bg-blue-500 text-white px-2 py-1 rounded">
                    Check
                  </button>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ShowDocuments;
