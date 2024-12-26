import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useCreateClientMutation } from "@api/setupApi";
const AddClient = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const [createClient, { isLoading }] = useCreateClientMutation();

  const onSubmit = async (data) => {
    try {
      await createClient({ ...data }).unwrap();
      reset();
      toast.success("Client Added Succesfully");
    } catch (err: any) {
      toast.error("something went wrong");
    }
  };
  return (
    <form className='w-full' onSubmit={handleSubmit(onSubmit)}>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-3 placeholder:text-gray-400'>
        <div className='flex flex-col col-span-1 gap-2'>
          <label>
            Client Name{" "}
            {errors.name ? <span className='text-red-500'>*</span> : null}
          </label>
          <input
            type='text'
            {...register("name", { required: true })}
            className={`p-2 border-gray-500 rounded-lg border-2`}
            placeholder='Client Name'
          />
        </div>
        <div className='flex flex-col col-span-1 gap-2'>
          <label>
            Client Code{" "}
            {errors.code ? <span className='text-red-500'>*</span> : null}
          </label>
          <input
            type='text'
            {...register("code", { required: true })}
            className={`p-2 border-gray-500 rounded-lg border-2`}
            placeholder='Client Code'
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

export default AddClient;
