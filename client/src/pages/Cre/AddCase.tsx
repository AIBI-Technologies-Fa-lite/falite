import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useCreateCaseMutation } from "@api/verificationApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface CaseFormData {
  applicantName: string;
  caseNumber: string;
  product: string;
  clientName: string;
  businessName?: string;
  coApplicantName?: string;
}

interface Field {
  name: keyof CaseFormData;
  label: string;
  required?: boolean;
}

const AddCase = () => {
  const [visibleFields, setVisibleFields] = useState<(keyof CaseFormData)[]>([]);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CaseFormData>();

  const [addCase] = useCreateCaseMutation();

  const onSubmit: SubmitHandler<CaseFormData> = async (data) => {
    const caseData = Object.fromEntries(Object.entries(data).filter(([_, value]) => value !== ""));

    try {
      const response = await addCase(caseData as CaseFormData).unwrap();
      reset();
      toast.success("Case added successfully!");
      navigate(`/cases/${response.data.case.id}`);
    } catch (err: any) {
      toast.error(err.data?.message || "An error occurred");
    }
  };

  const handleFieldSelection = (field: keyof CaseFormData) => {
    setVisibleFields((prevFields) => (prevFields.includes(field) ? prevFields.filter((item) => item !== field) : [...prevFields, field]));
  };

  const requiredFields: Field[] = [
    { name: "applicantName", label: "Applicant Name", required: true },
    { name: "caseNumber", label: "Case Number", required: true },
    { name: "product", label: "Product", required: true },
    { name: "clientName", label: "Client", required: true }
  ];

  const optionalFields: Field[] = [
    { name: "businessName", label: "Business Name" },
    { name: "coApplicantName", label: "Co Applicant Name" }
  ];

  return (
    <>
      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 placeholder:text-gray-400">
          {requiredFields.map((field) => (
            <div key={field.name} className="flex flex-col col-span-1 gap-2">
              <label>
                {field.label} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register(field.name, { required: field.required })}
                className={`p-2 border-gray-500 rounded-lg border-2`}
                placeholder={field.label}
              />
              {errors[field.name] && <span className="text-red-500">This field is required</span>}
            </div>
          ))}
          <div className="col-span-1 mb-4 md:col-span-2 lg:col-span-3">
            <label>Select Optional Fields to Display:</label>
            <div className="grid grid-cols-1 gap-2 mt-2 md:grid-cols-2 lg:grid-cols-3">
              {optionalFields.map((field) => (
                <div key={field.name} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={field.name}
                    checked={visibleFields.includes(field.name)}
                    onChange={() => handleFieldSelection(field.name)}
                    className="w-4 h-4"
                  />
                  <label htmlFor={field.name}>{field.label}</label>
                </div>
              ))}
            </div>
          </div>
          {optionalFields.map(
            (field) =>
              visibleFields.includes(field.name) && (
                <div key={field.name} className="flex flex-col col-span-1 gap-2">
                  <label>{field.label}</label>
                  <input type="text" {...register(field.name)} className={`p-2 border-gray-500 rounded-lg border-2`} placeholder={field.label} />
                </div>
              )
          )}
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 mt-6 text-white transition-all duration-100 bg-purple-600 rounded-lg hover:bg-purple-400 md:w-auto"
        >
          Submit
        </button>
      </form>
    </>
  );
};

export default AddCase;
