import React from "react";
import CaseDetails from "./CaseDetails";
import { convertToIST } from "@utils/time";
import ShowDocuments from "./ShowDocuments";
import { Status } from "@constants/enum";
import { Verification } from "src/types";

interface DisplayVerificationProps {
  verification: Verification;
  reopen?: any;
  setvid?: any;
}

const DisplayVerification: React.FC<DisplayVerificationProps> = ({
  verification,
  reopen,
  setvid
}) => {
  return (
    <div className='grid gap-4 mt-6 md:col-span-3 md:grid-cols-3'>
      <div className='flex items-center justify-between border-t-2 border-b-2 border-purple-100 md:col-span-3'>
        <p className='font-bold'>{verification.verificationType.name}</p>

        <p
          className={`font-bold ${
            verification.status === Status.PENDING
              ? "text-orange-500"
              : verification.status === Status.ONGOING
              ? "text-blue-500"
              : verification.status === Status.REJECTED
              ? "text-red-500"
              : verification.status === Status.CANNOTVERIFY
              ? "text-orange-500"
              : verification.status === Status.NEGATIVE
              ? "text-red-500"
              : verification.status === Status.REFER ||
                verification.status === Status.UNTRACEBLE
              ? "text-orange-500"
              : "text-green-500"
          }`}
        >
          {verification.status === Status.PENDING
            ? "Pending"
            : verification.status === Status.ONGOING
            ? "Ongoing"
            : verification.status === Status.REJECTED
            ? "Rejected"
            : verification.status === Status.CANNOTVERIFY
            ? "Cannot Verify"
            : verification.status === Status.NEGATIVE
            ? "Negative"
            : verification.status === Status.REFER
            ? "Refer"
            : verification.status === Status.UNTRACEBLE
            ? "Untraceble"
            : "Completed"}
        </p>

        <div
          className='md:px-4 md:py-2 p-2 text-xs text-white transition-all duration-100 bg-purple-600 rounded-lg hover:bg-purple-400 w-fit hover:cursor-pointer'
          onClick={() => {
            if (reopen) reopen(true);
            if (setvid) setvid(verification.id);
          }}
        >
          Reopen
        </div>
      </div>
      <CaseDetails
        label='OF'
        value={`${verification.of.firstName} ${verification.of.lastName}`}
      />
      <CaseDetails label='Address' value={verification.address} />
      <CaseDetails label='Pincode' value={verification.pincode} />
      <CaseDetails label='CRE Remarks' value={verification.creRemarks} />
      {verification.phone != 0 && (
        <CaseDetails label='Phone Number' value={verification.phone} />
      )}
      {verification.lat && (
        <CaseDetails label='Phone Number' value={verification.lat} />
      )}
      {verification.long && (
        <CaseDetails label='Phone Number' value={verification.long} />
      )}
      {verification.feRemarks && (
        <CaseDetails label='OF Remarks' value={verification.feRemarks} />
      )}
      <CaseDetails
        label='Assigned At'
        value={convertToIST(verification.createdAt)}
      />
      {verification.createdAt !== verification.updatedAt && (
        <CaseDetails
          label='Updated At'
          value={convertToIST(verification.updatedAt)}
        />
      )}
      {verification.documents && verification.documents.length > 0 && (
        <ShowDocuments
          canSeeCREDocuments={true}
          documents={verification.documents}
        />
      )}
    </div>
  );
};

export default DisplayVerification;
