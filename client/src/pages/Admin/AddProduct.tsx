import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useCreateProductMutation } from "@api/setupApi";
const AddProduct = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const [createProduct, { isLoading }] = useCreateProductMutation();

  const onSubmit = async (data) => {
    try {
      await createProduct({ ...data }).unwrap();
      reset();
      toast.success("Product Added Succesfully");
    } catch (err: any) {
      toast.error("something went wrong");
    }
  };
  return (
    <form className='w-full' onSubmit={handleSubmit(onSubmit)}>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-3 placeholder:text-gray-400'>
        <div className='flex flex-col col-span-1 gap-2'>
          <label>
            Product Name{" "}
            {errors.name ? <span className='text-red-500'>*</span> : null}
          </label>
          <input
            type='text'
            {...register("name", { required: true })}
            className={`p-2 border-gray-500 rounded-lg border-2`}
            placeholder='Product Name'
          />
        </div>
      </div>

      <button
        type='submit'
        className='px-4 py-2 mt-6 text-white transition-all duration-100 bg-purple-600 rounded-lg hover:bg-purple-400 disabled:bg-purple-300'
        disabled={isLoading}
      >
        Add Product
      </button>
    </form>
  );
};

export default AddProduct;
