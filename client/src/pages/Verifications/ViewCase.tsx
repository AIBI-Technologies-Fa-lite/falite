import React, { useEffect, useState } from "react";
import { useGetCaseByIdQuery, useCreateVerificationMutation, useCloseCaseMutation, useReopenVerificationMutation } from "@api/verificationApi";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import DisplayVerification from "@components/DisplayVerification";
import DisplayCase from "@components/DisplayCase";
import { Role, Status } from "@constants/enum";
import { useForm } from "react-hook-form";
import { useGetAllVtQuery } from "@api/vtApi";
import { useGetEmployeeByRoleQuery } from "@api/userApi";
import { Verification } from "src/types";
import { useReworkCaseMutation } from "@api/verificationApi";

interface VerificationType {
  id: number;
  name: string;
}

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
}

interface CaseData {
  id: number;
  caseNumber: string;
  status: Status;
  applicantName: string;
  coApplicantName?: string;
  businessName?: string;
  product: string;
  clientName: string;
  createdAt: string;
  employee: {
    firstName: string;
  };
  final: 1 | 0;
  verifications: Verification[];
}

const ViewCase: React.FC = () => {
  const role = useSelector((state: RootState) => state.auth.user?.role);
  const { id } = useParams<{ id: string | "" }>();
  const { data, error, isLoading, refetch } = useGetCaseByIdQuery({ id });
  const { data: vtData, error: vtError } = useGetAllVtQuery({});
  const { data: ofData, error: ofError } = useGetEmployeeByRoleQuery({ role: Role.OF });
  const [showModal, setShowModal] = useState(false);
  const [closeModal, setCloseModal] = useState(false);
  const [reopenModal, setReopenModal] = useState(false);
  const [reworkModal, setReworkModal] = useState(false);
  const [reopenId, setReopenId] = useState(null);
  const [fileNames, setFileNames] = useState<string[]>([]); // State to track file names

  const [createVerification, { isLoading: isCreating, error: createError }] = useCreateVerificationMutation();
  const [reopenVerification, { isLoading: isReopening, error: reopenError }] = useReopenVerificationMutation();
  const [closeCase, { isLoading: isClosing, error: closeError }] = useCloseCaseMutation();
  const [reworkCase] = useReworkCaseMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  useEffect(() => {
    if (error) toast.error("An error occurred while fetching the case.");
    if (vtError) toast.error("An error occurred while fetching verification types.");
    if (ofError) toast.error("An error occurred while fetching employees.");
    if (createError) toast.error("Failed to create verification.");
  }, [error, vtError, ofError, createError]);
  const onReopen = async (data: any) => {
    if (!reopenId) {
      toast.error("Case ID is missing.");
      return;
    }
    try {
      await reopenVerification({ ...data, id: reopenId }).unwrap();
      toast.success("Verification Reopened Successfully!");
      setReopenModal(false);
      reset();
      refetch();
    } catch (err) {
      toast.error("Failed to Close. Please try again.");
    }
  };
  const onRework = async (data: any) => {
    try {
      await reworkCase({ supervisorRemarks: data.supervisorRemarks, id });
      toast.success("Case Sent for Rework");
      setReworkModal(false);
      reset();
      refetch();
    } catch (err) {
      toast.error("Failed to send Case for Rework");
    }
  };
  const onClose = async (data: any) => {
    if (!id) {
      toast.error("Case ID is missing.");
      return;
    }
    try {
      await closeCase({ ...data, id }).unwrap();
      toast.success("Case Closed Successfully!");
      setCloseModal(false);
      reset();
      refetch();
    } catch (err) {
      toast.error("Failed to Close. Please try again.");
    }
  };
  const onSubmit = async (data: any) => {
    if (!id) {
      toast.error("Case ID is missing.");
      return;
    }

    const formData = new FormData();

    // Append non-file form fields to "verificationData" in FormData
    Object.keys(data).forEach((key) => {
      if (key !== "files") {
        const value = data[key];
        // Append as a number if the value is a number
        if (typeof value === "number") {
          formData.append(`verificationData[${key}]`, value.toString()); // Append numbers as strings for FormData
        } else if (typeof value === "string") {
          formData.append(`verificationData[${key}]`, value);
        }
      }
    });

    // Append caseId to the FormData
    formData.append("caseId", id);

    // Append each file to the "files" field in FormData
    if (data.files && data.files.length > 0) {
      Array.from(data.files as FileList).forEach((file) => {
        formData.append("files", file as Blob); // Typecast to Blob
      });
    }

    try {
      // Call the createVerification mutation with formData
      await createVerification(formData).unwrap();
      toast.success("Verification added successfully!");
      setShowModal(false);
      reset();
      refetch();
    } catch (err) {
      toast.error("Failed to add verification. Please try again.");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const names = files.map((file) => file.name);
    setFileNames(names);
  };

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
        <DisplayCase caseData={caseData} rework={setReworkModal} />
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-4">
          <hr className="md:col-span-3" />
          <p className="text-2xl font-bold text-gray-500 md:col-span-3">Verifications</p>
          <hr className="md:col-span-3" />
          {verifications.length ? (
            <div className="mb-6 md:col-span-3">
              {verifications.map((verification: Verification) => (
                <DisplayVerification key={verification.id} verification={verification} reopen={setReopenModal} setvid={setReopenId} />
              ))}
            </div>
          ) : (
            <div className="md:col-span-3">No Verification Found</div>
          )}
          <div className="flex gap-4">
            {role === "CRE" && caseData.status === "REVIEW" && (
              <div className="md:col-span-3 mt-8">
                <button
                  className="w-full px-4 py-2 text-xs text-white bg-green-600 rounded-lg hover:bg-green-400 md:w-auto mb-8"
                  onClick={() => setCloseModal(true)}
                >
                  Close Verification
                </button>
              </div>
            )}
            {role === "SUPERVISOR" && (caseData.status === "CANNOTVERIFY" || caseData.status === "REFER") && caseData.final === 0 && (
              <div className="md:col-span-3 mt-8">
                <button
                  className="w-full px-4 py-2 text-xs text-white bg-green-600 rounded-lg hover:bg-green-400 md:w-auto mb-8"
                  onClick={() => setCloseModal(true)}
                >
                  Mark As Completed
                </button>
              </div>
            )}
            {role === "CRE" && caseData.final !== 1 && id && (
              <div className="md:col-span-3 mt-8">
                <button
                  className="w-full px-4 py-2 text-xs text-white bg-purple-600 rounded-lg hover:bg-purple-400 md:w-auto mb-8"
                  onClick={() => setShowModal(true)}
                >
                  New Verification
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Modal for adding new verification */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Add New Verification</h2>
              <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 placeholder:text-gray-400">
                  <div className="flex flex-col col-span-1 gap-2">
                    <label>Verification Type {errors.verificationTypeId && <span className="text-red-500">*</span>}</label>
                    <select
                      className="p-2 border-gray-500 rounded-lg border-2"
                      {...register("verificationTypeId", { required: true })}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select VT
                      </option>
                      {vtData && vtData.data.verificationTypes && vtData.data.verificationTypes.length > 0 ? (
                        vtData.data.verificationTypes.map((vt: VerificationType) => (
                          <option key={vt.id} value={vt.id}>
                            {vt.name}
                          </option>
                        ))
                      ) : (
                        <option disabled>No Verification Types Available</option>
                      )}
                    </select>
                  </div>

                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label>Address {errors.address && <span className="text-red-500">*</span>}</label>
                    <input
                      type="text"
                      {...register("address", { required: true })}
                      className="p-2 border-gray-500 rounded-lg border-2"
                      placeholder="Address"
                    />
                  </div>

                  <div className="flex flex-col col-span-1 gap-2">
                    <label>Pincode {errors.pincode && <span className="text-red-500">*</span>}</label>
                    <input
                      type="number"
                      {...register("pincode", { required: true })}
                      className="p-2 border-gray-500 rounded-lg border-2"
                      placeholder="Pincode"
                    />
                  </div>

                  <div className="flex flex-col col-span-2 gap-2">
                    <label>File {errors.files && <span className="text-red-500">*</span>}</label>
                    <input
                      type="file"
                      multiple
                      accept="image/*,.pdf"
                      {...register("files")}
                      onChange={handleFileChange}
                      className="w-full overflow-clip rounded-lg border-2 border-gray-500 file:mr-4 file:cursor-pointer file:border-none file:bg-purple-100 file:px-4 file:py-2 file:font-medium"
                    />
                  </div>

                  <div className="flex flex-col gap-2 md:col-span-1">
                    <label>OF {errors.employeeId && <span className="text-red-500">*</span>}</label>
                    <select className="p-2 border-gray-500 rounded-lg border-2" {...register("employeeId", { required: true })} defaultValue="">
                      <option value="" disabled>
                        Select OF
                      </option>
                      {ofData && ofData.data.employees && ofData.data.employees.length > 0 ? (
                        ofData.data.employees.map((employee: Employee) => (
                          <option key={employee.id} value={employee.id}>
                            {employee.firstName} {employee.lastName}
                          </option>
                        ))
                      ) : (
                        <option disabled>No Employees Available</option>
                      )}
                    </select>
                  </div>

                  {/* Display selected file names beside the OF select */}
                  <div className="flex flex-col col-span-2 gap-2">
                    <label>Selected Files:</label>
                    <ul className="pl-4 text-xs list-disc text-gray-600">
                      {fileNames.length > 0 ? (
                        fileNames.map((name, index) => <li key={index}>{name}</li>)
                      ) : (
                        <p className="text-gray-400">No files selected</p>
                      )}
                    </ul>
                  </div>

                  <div className="flex flex-col gap-2 md:col-span-3">
                    <label>Remarks {errors.creRemarks && <span className="text-red-500">*</span>}</label>
                    <textarea
                      {...register("creRemarks", { required: true })}
                      className="p-2 border-gray-500 rounded-lg border-2"
                      placeholder="Notes"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-300 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-400" disabled={isCreating}>
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Modal for adding new verification */}
        {closeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Close Case</h2>
              <form className="" onSubmit={handleSubmit(onClose)}>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 placeholder:text-gray-400">
                  <div className="flex flex-col col-span-1 gap-2">
                    <label>Status{errors.status && <span className="text-red-500">*</span>}</label>
                    <select className="p-2 border-gray-500 rounded-lg border-2" {...register("status", { required: true })} defaultValue="">
                      <option value="" disabled>
                        Select Status
                      </option>
                      <option value={Status.POSITIVE}>POSITIVE</option>
                      <option value={Status.NEGATIVE}>NEGATIVE</option>
                      <option value={Status.CANNOTVERIFY}>CANNOT VERIFY</option>
                      <option value={Status.REFER}>REFER</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setCloseModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-300 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-400" disabled={isClosing}>
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* */}
        {reworkModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="p-6 bg-white rounded-lg shadow-lg md:w-[40%] w-[90%]">
              <h2 className="text-xl font-semibold mb-4">Rework Case</h2>
              <form className="" onSubmit={handleSubmit(onRework)}>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 placeholder:text-gray-400">
                  <div className="flex flex-col gap-2 md:col-span-3">
                    <label>Remarks {errors.supervisorRemarks && <span className="text-red-500">*</span>}</label>
                    <textarea
                      {...register("creRemarks", { required: true })}
                      className="p-2 border-gray-500 rounded-lg border-2"
                      placeholder="Notes"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setReworkModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-300 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-400" disabled={isClosing}>
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {reopenModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Close Case</h2>
              <form className="" onSubmit={handleSubmit(onReopen)}>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 placeholder:text-gray-400">
                  <div className="flex flex-col gap-2 md:col-span-1">
                    <label>OF {errors.empId && <span className="text-red-500">*</span>}</label>
                    <select className="p-2 border-gray-500 rounded-lg border-2" {...register("empId", { required: true })} defaultValue="">
                      <option value="" disabled>
                        Select OF
                      </option>
                      {ofData && ofData.data.employees && ofData.data.employees.length > 0 ? (
                        ofData.data.employees.map((employee: Employee) => (
                          <option key={employee.id} value={employee.id}>
                            {employee.firstName} {employee.lastName}
                          </option>
                        ))
                      ) : (
                        <option disabled>No Employees Available</option>
                      )}
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setReopenModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-300 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-400" disabled={isReopening}>
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default ViewCase;
