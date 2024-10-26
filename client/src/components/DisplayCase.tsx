import React from "react";
import CaseDetails from "./CaseDetails";
import { convertToIST } from "@utils/time";

interface CaseData {
  caseNumber?: string;
  employee?: {
    firstName?: string;
  };
  applicantName?: string;
  coApplicantName?: string;
  businessName?: string;
  product?: string;
  clientName?: string;
  createdAt?: string;
}

interface DisplayCaseProps {
  caseData: CaseData;
}

const DisplayCase: React.FC<DisplayCaseProps> = ({ caseData }) => {
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-4">
      <hr className="md:col-span-3" />
      <p className="text-2xl font-bold text-gray-500 md:col-span-3">Case Details</p>
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
