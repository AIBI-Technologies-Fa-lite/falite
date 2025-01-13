import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useCreateBranchMutation, CreateBranch } from "@api/branchApi";
const AddBranch = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CreateBranch>();

  const [createBranch, { isLoading }] = useCreateBranchMutation();

  const onSubmit = async (data: CreateBranch) => {
    try {
      const branch = data;
      await createBranch({ branch }).unwrap();
      reset();
      toast.success("Branch Added Succesfully");
    } catch (err: any) {
      toast.error(err.data.message);
    }
  };
  return (
    <form className='w-full' onSubmit={handleSubmit(onSubmit)}>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-3 placeholder:text-gray-400'>
        <div className='flex flex-col col-span-1 gap-2'>
          <label>
            Branch Name{" "}
            {errors.name ? <span className='text-red-500'>*</span> : null}
          </label>
          <input
            type='text'
            {...register("name", { required: true })}
            className={`p-2 border-gray-500 rounded-lg border-2`}
            placeholder='Branch Name'
          />
        </div>
        <div className='flex flex-col col-span-1 gap-2'>
          <label>
            Branch Code{" "}
            {errors.code ? <span className='text-red-500'>*</span> : null}
          </label>
          <input
            type='text'
            {...register("code", { required: true })}
            className={`p-2 border-gray-500 rounded-lg border-2`}
            placeholder='Branch Code'
          />
        </div>
      </div>

      <button
        type='submit'
        className='px-4 py-2 mt-6 text-white transition-all duration-100 bg-purple-600 rounded-lg hover:bg-purple-400 disabled:bg-purple-300'
        disabled={isLoading}
      >
        Add Branch
      </button>
    </form>
  );
};

export default AddBranch;
