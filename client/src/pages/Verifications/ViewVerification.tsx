import { useEffect, useState } from "react";
import { RootState } from "src/store";
import { useGetVerificationByIdQuery, useSendOfResponseMutation, useSubmitVerificationMutation } from "@api/verificationApi";
import { useGetEmployeeByRoleQuery } from "@api/userApi";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CaseDetails from "@components/CaseDetails";
import { convertToIST } from "@utils/time";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import ShowDocuments from "@components/ShowDocuments";
import { Role, Status } from "@constants/enum";

const RejectModal = ({ isOpen, onClose, onSubmit, rejectReason, setRejectReason }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
        <h3 className="mb-4 text-xl font-bold">Reject Case</h3>
        <textarea
          className="w-full p-2 border border-gray-300 rounded-lg"
          placeholder="Provide a reason for rejection..."
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          required
        />
        <div className="flex justify-end gap-4 mt-4">
          <button className="px-4 py-2 text-white bg-red-500 rounded-lg" onClick={onSubmit}>
            Submit
          </button>
          <button className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const ReassignModal = ({ isOpen, onClose, onSubmit, ofData, reErrors, reRegister }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
        <h3 className="mb-4 text-xl font-bold">Reassign Verification</h3>
        <form onSubmit={onSubmit}>
          <div className="flex flex-col gap-2">
            <label>OF {reErrors.emp && <span className="text-red-500">*</span>}</label>
            <select className="p-2 border-gray-500 rounded-lg border-2" {...reRegister("emp", { required: true })} defaultValue="">
              <option value="" disabled>
                Select OF
              </option>
              {ofData?.data?.users.map((of) => (
                <option key={of.id} value={of.id}>
                  {of.firstName} {of.lastName}
                </option>
              ))}
            </select>
            {reErrors.emp && <span className="text-red-500">OF selection is required.</span>}
          </div>
          <div className="flex justify-end gap-4 mt-4">
            <button type="submit" className="px-4 py-2 text-white bg-purple-500 rounded-lg">
              Submit
            </button>
            <button type="button" className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ViewVerification = () => {
  const { data: ofData } = useGetEmployeeByRoleQuery({ role: Role.OF });
  const navigate = useNavigate();
  const { id } = useParams();
  const role = useSelector((state: RootState) => state.auth.user?.role);

  const { data, error, isLoading, refetch } = useGetVerificationByIdQuery({ id });
  const [ofResponse] = useSendOfResponseMutation();
  const [submitResponse] = useSubmitVerificationMutation();

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [reassignModal, setReassignModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [fileNames, setFileNames] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();
  const {
    register: reRegister,
    handleSubmit: reHandleSubmit,
    formState: { errors: reErrors },
    reset: reReset
  } = useForm();

  useEffect(() => {
    if (error) {
      toast.error("An error occurred while fetching the case.");
    }
  }, [error]);

  const handleAcceptClick = async () => {
    try {
      await ofResponse({ id }).unwrap();
      refetch();
      toast.success("Case accepted successfully.");
    } catch (err) {
      toast.error("An error occurred while accepting the case.");
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection.");
      return;
    }
    try {
      await ofResponse({ id, reject: true, remarks: rejectReason }).unwrap();
      toast.success("Case rejected successfully.");
      setIsRejectModalOpen(false);
      navigate("/verification");
    } catch (err) {
      toast.error("An error occurred while rejecting the case.");
    }
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || []);
    const names = files.map((file: any) => file.name);
    setFileNames(names);
  };

  const onSubmit = async (data) => {
    try {
      const submitData = new FormData();

      // Append files to FormData
      if (data.files && data.files.length > 0) {
        Array.from(data.files).forEach((file) => {
          if (file instanceof Blob || file instanceof File) {
            submitData.append("files", file);
          }
        });
      }

      // Add other required fields
      submitData.append("feRemarks", data.remarks);
      submitData.append("status", data.status);
      submitData.append("id", id as string);

      // Get geolocation data and then call the mutation
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          submitData.append("location[lat]", position.coords.latitude.toString());
          submitData.append("location[long]", position.coords.longitude.toString());

          try {
            // Call mutation with formData and id
            await submitResponse(submitData).unwrap();
            toast.success("Case submitted successfully.");
            navigate("/verification");

            reset();
            setFileNames([]);
          } catch (err) {
            console.error("Submit error:", err);
            toast.error("Failed to update verification");
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast.error("Unable to retrieve location. Please try again.");
        }
      );
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Failed to update verification");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading...</p>
      </div>
    );
  }

  if (!data && error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>An error occurred while loading the data.</p>
      </div>
    );
  }

  if (!data) return null;

  const { verification } = data.data;
  const caseData = verification?.case;
  const canSeeCREDocuments = role !== "OF" || (role === "OF" && verification.final === 0);

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Verification Details and Actions */}
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-4">
        {/* Details Display */}
        <hr className="md:col-span-3" />
        <div className="flex flex-col justify-between gap-2 md:col-span-3 md:flex-row">
          <p className="text-2xl font-bold text-gray-500 md:col-span-3">Verification Details</p>
          {role === "OF" && verification.status === Status.PENDING ? (
            <div className="flex gap-4">
              <button className="px-2 py-1 text-white bg-green-500 rounded-lg" onClick={handleAcceptClick}>
                Accept
              </button>
              <button className="px-2 py-1 text-white bg-red-500 rounded-lg" onClick={() => setIsRejectModalOpen(true)}>
                Reject
              </button>
            </div>
          ) : (
            role !== "OF" && (
              <p
                className={`font-bold ${
                  verification.status === Status.PENDING
                    ? "text-orange-500"
                    : verification.status === Status.REJECTED
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                {verification.status === Status.PENDING
                  ? "Pending"
                  : verification.status === Status.REJECTED
                  ? "Rejected"
                  : verification.status === Status.ONGOING
                  ? "Ongoing"
                  : "Complete"}
              </p>
            )
          )}
        </div>
        <hr className="md:col-span-3" />

        {/* Case Data Details */}
        {caseData?.employee?.firstName && <CaseDetails label="CRE" value={caseData.employee.firstName} />}
        {caseData?.applicantName && <CaseDetails label="Applicant Name" value={caseData.applicantName} />}
        {caseData?.coApplicantName && <CaseDetails label="Co Applicant Name" value={caseData.coApplicantName} />}
        {caseData?.businessName && <CaseDetails label="Business Name" value={caseData.businessName} />}
        {caseData?.product && <CaseDetails label="Product" value={caseData.product} />}
        {caseData?.clientName && <CaseDetails label="Client" value={caseData.clientName} />}

        <CaseDetails label="Verification Type" value={verification.verificationType.name} />
        <CaseDetails label="OF" value={`${verification.of.firstName} ${verification.of.lastName}`} />
        <CaseDetails label="Address" value={verification.address} />
        <CaseDetails label="Pincode" value={verification.pincode} />
        <CaseDetails label="CRE Remarks" value={verification.creRemarks} />
        {verification.feRemarks && <CaseDetails label="OF Remarks" value={verification.feRemarks} />}
        <CaseDetails label="Assigned At" value={convertToIST(verification.createdAt)} />
        {verification.createdAt !== verification.updatedAt && <CaseDetails label="Updated At" value={convertToIST(verification.updatedAt)} />}

        {/* Documents Display */}
        {verification.documents.length > 0 && <ShowDocuments canSeeCREDocuments={canSeeCREDocuments} documents={verification.documents} />}
      </div>

      {/* Submission Form */}
      {verification.status === Status.ONGOING && role === "OF" && (
        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 placeholder:text-gray-400">
            {/* File Upload */}
            <div className="flex flex-col col-span-1 gap-2">
              <label>File {errors.files && <span className="text-red-500">*</span>}</label>
              <input
                type="file"
                multiple
                accept="image/*,.pdf"
                {...register("files", {
                  validate: (files) => files.length <= 6 || "You can only upload up to 6 files."
                })}
                onChange={handleFileChange}
                className="w-full overflow-clip rounded-lg border-2 border-gray-500 file:mr-4 file:cursor-pointer file:border-none file:bg-purple-100 file:px-4 file:py-2 file:font-medium disabled:cursor-not-allowed disabled:opacity-75"
              />
              {errors.files && <span className="text-red-500">{errors.files.message?.toString()}</span>}
            </div>

            {/* Uploaded File List */}
            <div className="flex flex-col col-span-1 gap-2">
              <label>Uploaded Files:</label>
              <ul className="pl-4 text-xs list-disc">
                {fileNames.map((name, index) => (
                  <li key={index} className="text-gray-600">
                    {name}
                  </li>
                ))}
              </ul>
            </div>

            {/* Status Selection */}
            <div className="flex flex-col col-span-1 gap-2">
              <label>Status {errors.status && <span className="text-red-500">*</span>}</label>
              <select {...register("status", { required: true })} className="p-2 border-gray-500 rounded-lg border-2">
                <option value={Status.POSITIVE}>POSITIVE</option>
                <option value={Status.NEGATIVE}>NEGATIVE</option>
                <option value={Status.CANNOTVERIFY}>CANNOT VERIFY</option>
                <option value={Status.REFER}>REFER</option>
              </select>
            </div>

            {/* Remarks Field */}
            <div className="flex flex-col gap-2 md:col-span-2">
              <label>Remarks {errors.remarks && <span className="text-red-500">*</span>}</label>
              <textarea {...register("remarks", { required: true })} className="p-2 border-gray-500 rounded-lg border-2" placeholder="Notes" />
              {errors.remarks && <span className="text-red-500">Remarks are required.</span>}
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 mt-6 mb-6 text-white transition-all duration-100 bg-purple-600 rounded-lg hover:bg-purple-400 md:w-auto"
          >
            Submit
          </button>
        </form>
      )}

      {/* Modals for Reject and Reassign */}
      <RejectModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onSubmit={handleRejectSubmit}
        rejectReason={rejectReason}
        setRejectReason={setRejectReason}
      />

      <ReassignModal
        isOpen={reassignModal}
        onClose={() => setReassignModal(false)}
        onSubmit={reHandleSubmit((data) => {
          console.log(data); // Implement actual reassign logic here
        })}
        ofData={ofData}
        reErrors={reErrors}
        reRegister={reRegister}
      />
    </div>
  );
};

export default ViewVerification;
