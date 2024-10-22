import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useCreateVTMutation, CreateVT } from "@api/vtApi";
const AddVT = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CreateVT>();

  const [createBranch, { isLoading }] = useCreateVTMutation();

  const onSubmit = async (data: CreateVT) => {
    try {
      const verificationType = data;
      await createBranch({ verificationType }).unwrap();
      reset();
      toast.success("Verification Added Succesfully");
    } catch (err: any) {
      toast.error(err.data.message);
    }
  };
  return (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 placeholder:text-gray-400">
        <div className="flex flex-col col-span-1 gap-2">
          <label>Verification Name{errors.name ? <span className="text-red-500">*</span> : null}</label>
          <input
            type="text"
            {...register("name", { required: true })}
            className={`p-2 border-gray-500 rounded-lg border-2`}
            placeholder="Verification Name"
          />
        </div>
        <div className="flex flex-col col-span-1 gap-2">
          <label>Response Form Id {errors.formId ? <span className="text-red-500">*</span> : null}</label>
          <input
            type="text"
            {...register("formId", { required: true })}
            className={`p-2 border-gray-500 rounded-lg border-2`}
            placeholder="Response Form ID"
          />
        </div>
      </div>

      <button
        type="submit"
        className="px-4 py-2 mt-6 text-white transition-all duration-100 bg-purple-600 rounded-lg hover:bg-purple-400 disabled:bg-purple-300"
        disabled={isLoading}
      >
        Add Branch
      </button>
    </form>
  );
};

export default AddVT;
