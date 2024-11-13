import React from "react";
import CaseDetails from "./CaseDetails";
import { convertToIST } from "@utils/time";
import { selectUser } from "@providers/authSlice";
import { useSelector } from "react-redux";
interface CaseData {
  caseNumber?: string;
  employee?: {
    firstName?: string;
  };
  status: string;
  applicantName?: string;
  coApplicantName?: string;
  businessName?: string;
  product?: string;
  clientName?: string;
  createdAt?: string;
  final: number;
}

interface DisplayCaseProps {
  caseData: CaseData;
  rework: any;
}

const DisplayCase: React.FC<DisplayCaseProps> = ({ caseData, rework }) => {
  const user = useSelector(selectUser);
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-4">
      <hr className="md:col-span-3" />
      <div className="flex justify-between">
        <p className="text-2xl font-bold text-gray-500 md:col-span-3">Case Details</p>
        {user?.role === "SUPERVISOR" && (caseData.status === "CANNOTVERIFY" || caseData.status === "REFER") && caseData.final === 0 && (
          <div
            className="md:px-4 md:py-2 p-2 text-xs text-white transition-all duration-100 bg-purple-600 rounded-lg hover:bg-purple-400 w-fit hover:cursor-pointer"
            onClick={() => {
              if (rework) rework(true);
            }}
          >
            Rework
          </div>
        )}
      </div>

      <hr className="md:col-span-3" />
      {caseData.caseNumber && <CaseDetails label="Case Number" value={caseData.caseNumber} />}
      {caseData.employee?.firstName && <CaseDetails label="CRE" value={caseData.employee.firstName} />}
      {caseData.applicantName && <CaseDetails label="Applicant Name" value={caseData.applicantName} />}
      {caseData.coApplicantName && <CaseDetails label="Co Applicant Name" value={caseData.coApplicantName} />}
      {caseData.businessName && <CaseDetails label="Business Name" value={caseData.businessName} />}
      {caseData.product && <CaseDetails label="Product" value={caseData.product} />}
      {caseData.clientName && <CaseDetails label="Client" value={caseData.clientName} />}
      {caseData.createdAt && <CaseDetails label="Created At" value={convertToIST(caseData.createdAt)} />}
    </div>
  );
};

export default DisplayCase;
