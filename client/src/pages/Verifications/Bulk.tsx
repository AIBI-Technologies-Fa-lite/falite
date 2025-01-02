import { toast } from "react-toastify";
import { useBulkUploadMutation } from "@api/verificationApi";
import React, { useRef, useState } from "react";

type BulkProps = {};

const Bulk: React.FC<BulkProps> = () => {
  const [upload, { isLoading }] = useBulkUploadMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileSelected, setFileSelected] = useState<File | null>(null);

  // Handler for downloading the Excel file
  const handleDownload = () => {
    const blob = new Blob(
      [
        "\uFEFF", // UTF-8 BOM
        "case_number,product,applicant_name,client_name,verification_id,business_name,address,pincode,phone\n"
      ],
      { type: "text/csv;charset=utf-8;" }
    );

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "example.xlsx";
    a.click();

    window.URL.revokeObjectURL(url);
  };

  // Handler for uploading a file
  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileSelected(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!fileSelected) {
      toast.error("Please select a file first");
      return;
    }

    const formData = new FormData();
    try {
      formData.append("file", fileSelected);
      await upload(formData).unwrap();
      toast.success("File Uploaded Successfully");
      setFileSelected(null);
    } catch (err) {
      console.log(err);
      toast.error("Something Went wrong");
    }
  };

  return (
    <>
      <button
        type='button'
        onClick={handleDownload}
        className='text-purple-600 hover:text-purple-400 underline'
      >
        Download Excel File
      </button>
      <form
        className='bg-white p-6 rounded-lg shadow-lg w-full max-w-sm'
        onSubmit={handleSubmit}
      >
        <h2 className='text-lg font-bold mb-4 text-center'>Bulk Upload</h2>

        <button
          type='button'
          onClick={() => fileInputRef.current?.click()}
          className='w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-400 mb-4'
        >
          Upload File
        </button>

        <input
          ref={fileInputRef}
          type='file'
          accept='.csv, .xlsx'
          onChange={handleUpload}
          style={{ display: "none" }}
        />

        <button
          type='submit'
          className='w-full px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-400'
        >
          Submit
        </button>
      </form>
    </>
  );
};

export default Bulk;
