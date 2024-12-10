import { useState } from "react";
import { useForm } from "react-hook-form";
import { PiEyeSlash, PiEyeLight } from "react-icons/pi";
import { Role } from "@constants/enum";
import Select, { MultiValue } from "react-select"; // Import MultiValue for react-select
import { useGetAllBranchesQuery } from "@api/branchApi";
import { useCreateEmployeeMutation } from "@api/userApi";
import { toast } from "react-toastify";

// Define the type for branch options
type BranchOption = {
  value: number;
  label: string;
};

const AddUsers = () => {
  const roles = Object.values(Role);
  const [hiddenPassword, setHiddenPassword] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // State to store the uploaded file
  const [selectedBranches, setSelectedBranches] = useState<BranchOption[]>([]); // State to manage selected branches

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  // Fetch branch options from the API using RTK Query
  const { data: branchData, isLoading } = useGetAllBranchesQuery({});

  // Use the mutation for creating an employee
  const [createEmployee, { isLoading: isCreating }] =
    useCreateEmployeeMutation();

  // Transform branch data into a format react-select expects
  if (!branchData?.data.branches) {
    return <div>Please Add Branches First</div>;
  }

  const branchOptions: BranchOption[] =
    branchData?.data.branches.map((branch: { id: number; name: string }) => ({
      value: branch.id,
      label: branch.name
    })) || [];

  // Function to handle the form submission
  const onSubmit = async (data: any) => {
    // Create a FormData object to handle file uploads
    const formData = new FormData();
    const dobIso = new Date(data.dob).toISOString();
    // Append all form fields
    formData.append("data[firstName]", data.firstName);
    formData.append("data[lastName]", data.lastName);
    formData.append("data[email]", data.email);
    formData.append("data[password]", data.password);
    formData.append("data[role]", data.role);
    formData.append("data[bloodGroup]", data.bloodGroup);
    formData.append("data[phone]", data.phone);
    formData.append("data[address]", data.address);
    formData.append("data[dob]", dobIso);
    formData.append("data[aadhar]", data.aadhar);
    formData.append("data[pan]", data.pan);

    // Append the selected branches
    selectedBranches.forEach((branch) =>
      formData.append("branchId[]", branch.value.toString())
    );

    // Append the uploaded file
    if (selectedFile) {
      formData.append("document", selectedFile);
    }

    // Use RTK mutation to create an employee
    try {
      await createEmployee(formData).unwrap();
      toast.success("User Created Successfully");
      reset(); // Reset form after successful submission
      setSelectedBranches([]); // Reset branches selection
    } catch (error: any) {
      toast.error(error.message);
      console.error("Error creating user:", error);
    }
  };

  // Handle branch selection changes
  const handleBranchChange = (selectedOptions: MultiValue<BranchOption>) => {
    setSelectedBranches(selectedOptions as BranchOption[]);
  };

  return (
    <form
      className='w-full'
      onSubmit={handleSubmit(onSubmit)}
      encType='multipart/form-data'
    >
      <div className='grid grid-cols-1 gap-6 md:grid-cols-3 placeholder:text-gray-400'>
        {/* First Name */}
        <div className='flex flex-col col-span-1 gap-2'>
          <label>
            First Name{" "}
            {errors.firstName ? <span className='text-red-500'>*</span> : null}
          </label>
          <input
            type='text'
            {...register("firstName", { required: true })}
            className={`p-2 border-gray-500 rounded-lg border-2`}
            placeholder='First Name'
          />
        </div>
        {/* Last Name */}
        <div className='flex flex-col col-span-1 gap-2'>
          <label>
            Last Name{" "}
            {errors.lastName ? <span className='text-red-500'>*</span> : null}
          </label>
          <input
            type='text'
            {...register("lastName", { required: true })}
            className={`p-2 border-gray-500 rounded-lg border-2`}
            placeholder='Last Name'
          />
        </div>
        {/*DOB*/}
        <div className='flex flex-col col-span-1 gap-2'>
          <label>
            DOB {errors.dob ? <span className='text-red-500'>*</span> : null}
          </label>
          <input
            type='date'
            {...register("dob", { required: true })}
            className={`p-2 border-gray-500 rounded-lg border-2`}
            placeholder='Last Name'
          />
        </div>
        {/* Email */}
        <div className='flex flex-col col-span-1 gap-2'>
          <label>
            Email{" "}
            {errors.email ? <span className='text-red-500'>*</span> : null}
          </label>
          <input
            type='email'
            {...register("email", {
              required: true,
              pattern: /^\S+@\S+$/i
            })}
            className={`p-2 border-gray-500 rounded-lg border-2`}
            placeholder='Email'
          />
        </div>
        {/* Role */}
        <div className='flex flex-col col-span-1 gap-2'>
          <label>
            Role {errors.role ? <span className='text-red-500'>*</span> : null}
          </label>
          <select
            {...register("role", { required: true })}
            className={`p-2 border-gray-500 rounded-lg border-2`}
          >
            {roles.map((role, idx) => (
              <option key={idx} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
        {/* Password */}
        <div className='relative flex flex-col col-span-1 gap-2'>
          <label>
            Password{" "}
            {errors.password ? <span className='text-red-500'>*</span> : null}
          </label>
          <input
            type={hiddenPassword ? "password" : "text"}
            {...register("password", {
              required: true
            })}
            className={`p-2 border-gray-500 rounded-lg border-2`}
            placeholder='Password'
          />
          <div className='absolute flex items-center transform-translate-y-1/2 right-3 top-[45px] '>
            {hiddenPassword ? (
              <PiEyeSlash
                className='text-gray-500 cursor-pointer'
                onClick={() => {
                  setHiddenPassword(!hiddenPassword);
                }}
              />
            ) : (
              <PiEyeLight
                className='text-gray-500 cursor-pointer'
                onClick={() => {
                  setHiddenPassword(!hiddenPassword);
                }}
              />
            )}
          </div>
        </div>
        {/* Aadhar */}
        <div className='flex flex-col col-span-1 gap-2'>
          <label>
            Aadhar Number
            {errors.aadhar ? <span className='text-red-500'>*</span> : null}
          </label>
          <input
            type='text'
            {...register("aadhar")}
            className={`p-2 border-gray-500 rounded-lg border-2`}
            placeholder='Aadhar Number'
          />
        </div>
        {/* Pan */}
        <div className='flex flex-col col-span-1 gap-2'>
          <label>
            PAN Number
            {errors.pan ? <span className='text-red-500'>*</span> : null}
          </label>
          <input
            type='text'
            {...register("pan")}
            className={`p-2 border-gray-500 rounded-lg border-2`}
            placeholder='PAN Number'
          />
        </div>
        {/* Blood Group */}
        <div className='flex flex-col col-span-1 gap-2'>
          <label>
            Blood Group{" "}
            {errors.bloodGroup ? <span className='text-red-500'>*</span> : null}
          </label>
          <input
            type='text'
            {...register("bloodGroup", { required: true })}
            className={`p-2 border-gray-500 rounded-lg border-2`}
            placeholder='Blood Group'
          />
        </div>
        {/* Phone Number */}
        <div className='flex flex-col col-span-1 gap-2'>
          <label>
            Mobile Number{" "}
            {errors.phone ? <span className='text-red-500'>*</span> : null}
          </label>
          <input
            type='tel'
            {...register("phone", { required: true, pattern: /^[0-9]{10}$/ })}
            className={`p-2 border-gray-500 rounded-lg border-2`}
            placeholder='Mobile Number'
          />
        </div>
        {/* File Upload */}
        <div className='flex flex-col col-span-1 gap-2'>
          <label>Upload Document</label>
          <input
            type='file'
            accept='img'
            {...register("document")}
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setSelectedFile(e.target.files[0]);
              }
            }}
            className='p-2 border-gray-500 rounded-lg border-2'
          />
        </div>
        {/* Address */}
        <div className='flex flex-col col-span-3 gap-2'>
          <label>
            Address{" "}
            {errors.address ? <span className='text-red-500'>*</span> : null}
          </label>
          <textarea
            {...register("address", { required: true })}
            className={`p-2 border-gray-500 rounded-lg border-2`}
            placeholder='Address'
          />
        </div>
      </div>

      {/* Branch Selection (as Tags) */}
      <div className='flex flex-col col-span-1 gap-2 mt-6'>
        <label>Branches</label>
        <Select
          isMulti
          name='branches'
          options={branchOptions} // Dynamically loaded options from the API
          className='basic-multi-select'
          classNamePrefix='select'
          value={selectedBranches}
          onChange={handleBranchChange} // Update state when branches are selected
          placeholder={isLoading ? "Loading branches..." : "Select branches..."} // Show loading indicator while fetching
        />
      </div>

      {/* Submit Button */}
      <button
        type='submit'
        className='px-4 py-2 mt-6 text-white transition-all duration-100 bg-purple-600 rounded-lg hover:bg-purple-800 disabled:bg-purple-400'
        disabled={isCreating}
      >
        {isCreating ? "Creating User..." : "Add User"}
      </button>
    </form>
  );
};

export default AddUsers;
