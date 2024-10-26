import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useCreateVerificationMutation } from "@api/verificationApi";

interface AddVerificationProps {
  caseId: string;
  onSuccess: () => void;
}

const AddVerification: React.FC<AddVerificationProps> = ({ caseId, onSuccess }) => {
  const [fileNames, setFileNames] = useState<string[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();
  const { data: verificationTypesData } = useGetAllVerificationTypesQuery();
  const { data: ofData } = useGetUsersByRoleQuery();
  const [addVerification] = useCreateVerificationMutation();

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("caseId", caseId);
    Object.keys(data).forEach((key) => formData.append("verificationData[key]", data[key]));

    if (data.files && data.files.length > 0) {
      Array.from(data.files).forEach((file) => formData.append(`files`, file));
    }

    try {
      await addVerification(formData).unwrap();
      reset();
      setFileNames([]);
      toast.success("Verification Added successfully");
      onSuccess();
    } catch (err) {
      toast.error("Failed to add verification");
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFileNames(files.map((file) => file.name));
  };

  return (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 placeholder:text-gray-400">
        <div className="flex flex-col col-span-1 gap-2">
          <label>Verification Type {errors.verificationTypeId && <span className="text-red-500">*</span>}</label>
          <select className="p-2 border-gray-500 rounded-lg border-2" {...register("verificationTypeId", { required: true })} defaultValue="">
            <option value="" disabled>
              Select Verification Type
            </option>
            {verificationTypesData?.data.verificationTypes.map((vt) => (
              <option key={vt.id} value={vt.id}>
                {vt.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2 md:col-span-2">
          <label>Address {errors.address && <span className="text-red-500">*</span>}</label>
          <input type="text" {...register("address", { required: true })} className="p-2 border-gray-500 rounded-lg border-2" placeholder="Address" />
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

        <div className="flex flex-col col-span-1 gap-2">
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

        <div className="flex flex-col gap-2 md:col-span-2">
          <label>Remarks {errors.creRemarks && <span className="text-red-500">*</span>}</label>
          <textarea {...register("creRemarks", { required: true })} className="p-2 border-gray-500 rounded-lg border-2" placeholder="Notes" />
        </div>

        <div className="flex flex-col gap-2 md:col-span-2">
          <label>OF {errors.employeeId && <span className="text-red-500">*</span>}</label>
          <select className="p-2 border-gray-500 rounded-lg border-2" {...register("employeeId", { required: true })} defaultValue="">
            <option value="" disabled>
              Select OF
            </option>
            {ofData?.data.users.map((of) => (
              <option key={of.id} value={of.id}>
                {of.firstName} {of.lastName}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button type="submit" className="w-full px-4 py-2 mt-6 text-white bg-purple-600 rounded-lg hover:bg-purple-400 md:w-auto">
        Submit
      </button>
    </form>
  );
};

export default AddVerification;
