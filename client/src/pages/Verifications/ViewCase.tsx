import React, { useEffect, useState } from "react";
import { useGetCaseByIdQuery } from "@api/verificationApi";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import DisplayVerification from "@components/DisplayVerification";
import DisplayCase from "@components/DisplayCase";
import AddVerification from "@components/AddVerification";

interface Verification {
  id: string;
  verificationType: {
    name: string;
  };
  status: number;
  of: {
    firstName: string;
    lastName: string;
    role: string;
  };
  address: string;
  pincode: string;
  creRemarks: string;
  feRemarks?: string;
  createdAt: string;
  updatedAt: string;
  documents: {
    id: string;
    name: string;
    url: string;
    employee: {
      role: string;
    };
  }[];
}

interface CaseData {
  id: number;
  caseNumber: string;
  status: number;
  applicantName: string;
  coApplicantName?: string;
  businessName?: string;
  product: string;
  clientName: string;
  createdAt: string;
  employee: {
    firstName: string;
  };
  verifications: Verification[];
}

const ViewCase: React.FC = () => {
  const role = useSelector((state: RootState) => state.auth.user?.role);
  const { id } = useParams<{ id: string | "" }>();
  const { data, error, isLoading } = useGetCaseByIdQuery({ id });
  const [showAddVerification, setShowAddVerification] = useState(false);

  useEffect(() => {
    if (error) {
      toast.error("An error occurred while fetching the case.");
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    toast.error("Something Went Wrong");
    return null;
  }

  if (data) {
    const caseData: CaseData = data.data.case;
    const verifications = caseData.verifications;

    return (
      <div className="flex flex-col w-full gap-6">
        <DisplayCase caseData={caseData} />
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-4">
          <hr className="md:col-span-3" />
          <p className="text-2xl font-bold text-gray-500 md:col-span-3">Verifications</p>
          <hr className="md:col-span-3" />
          {verifications.length ? (
            <div className="mb-6 md:col-span-3">
              {verifications.map((verification: Verification) => (
                <DisplayVerification key={verification.id} verification={verification} />
              ))}
            </div>
          ) : (
            <div className="md:col-span-3">No Verification Found</div>
          )}

          {role === "CRE" && caseData.status !== 3 && id && (
            <div className="md:col-span-3">
              {!showAddVerification ? (
                <button
                  className="w-full px-4 py-2 text-xs text-white bg-purple-600 rounded-lg hover:bg-purple-400 md:w-auto"
                  onClick={() => setShowAddVerification(true)}
                >
                  New Verification
                </button>
              ) : (
                <AddVerification caseId={id} onSuccess={() => setShowAddVerification(false)} />
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default ViewCase;
