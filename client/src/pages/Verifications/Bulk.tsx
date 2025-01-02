import { toast } from "react-toastify";

const Bulk = () => {
  // Handler for downloading the Excel file
  const handleDownload = () => {
    // Create a dummy Excel file with specific headers for demonstration purposes
    const blob = new Blob(
      [
        "\uFEFF", // UTF-8 BOM
        "case_number,product,applicant_name,client_name,verification_id,business_name,address,pincode,phone\n"
      ],
      { type: "text/csv;charset=utf-8;" }
    );

    // Create a link to download the file
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "example.xlsx"; // Name of the file
    a.click();

    // Clean up the URL object
    window.URL.revokeObjectURL(url);
  };

  // Handler for uploading a file
  const handleUpload = (event) => {
    const file = event.target.files[1];
    if (file) {
      toast.success("File Uploaded Successfully");
    } else {
      toast.error("Something went wrong");
    }
  };

  return (
    <div>
      <button
        onClick={handleDownload}
        className='px-4 py-2 text-xs text-white bg-purple-600 rounded-lg hover:bg-purple-400 md:w-auto mb-2'
      >
        Download Excel File
      </button>

      <input
        type='file'
        accept='.csv, .xlsx'
        onChange={handleUpload}
        style={{ marginLeft: "10px" }}
      />
    </div>
  );
};

export default Bulk;
