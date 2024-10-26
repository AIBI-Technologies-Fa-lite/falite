import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react"; // Import useState hook
import { useGetEmployeeByIdQuery, useDeleteEmployeeMutation } from "@api/userApi";
import { convertToIST, formatDateToDDMMYYYY } from "@utils/time";
import { Role } from "@constants/enum";
import { toast } from "react-toastify";

// Define User type
type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  bloodGroup: string;
  dob: string;
  address: string;
  role: Role;
  createdAt: string;
  document: string;
  phone: string;
  branches: [{ name: string }];
};

type Props = {
  label: string;
  value: string;
};

const UserDetails = (props: Props) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-1">
      <span className="font-bold">{props.label}</span>
      <span className="text-gray-600">{props.value}</span>
    </div>
  );
};

const renderDocument = (documentUrl: string) => {
  const extension = documentUrl.split(".").pop()?.toLowerCase();

  if (["jpg", "jpeg", "png", "gif", "svg"].includes(extension!)) {
    // Render image if it's an image file
    return <img className="w-full" src={documentUrl} alt="User Document" />;
  } else if (extension === "pdf") {
    // Render PDF using iframe
    return <iframe className="w-full h-[90%] " src={documentUrl} title="PDF Document"></iframe>;
  } else {
    // If file type is unsupported
    return <p className="flex h-full w-full justify-center items-center font-bold text-white text-3xl">Unsupported document type</p>;
  }
};

const DocumentOverlay = ({ documentUrl, onClose }: { documentUrl: string; onClose: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="relative p-4 rounded shadow-lg w-full h-full">
        <button
          className="absolute top-2 right-2 text-white bg-red-600 hover:bg-red-800 font-bold rounded-full p-2 w-8 h-8 flex items-center justify-center text-xl"
          onClick={onClose}
        >
          &times;
        </button>

        {renderDocument(documentUrl)}
      </div>
    </div>
  );
};

const UserInfo = ({ user }: { user: User }) => {
  const [showOverlay, setShowOverlay] = useState(false);
  return (
    <>
      {user.firstName && <UserDetails label="First Name" value={user.firstName} />}
      {user.lastName && <UserDetails label="Last Name" value={user.lastName} />}
      {user.role && <UserDetails label="Role" value={user.role} />}
      {user.email && <UserDetails label="Email" value={user.email} />}
      {user.phone && <UserDetails label="Mobile No" value={user.phone} />}
      {user.dob && <UserDetails label="Date of Birth" value={formatDateToDDMMYYYY(user.dob)} />}
      {user.bloodGroup && <UserDetails label="Blood Group" value={user.bloodGroup} />}
      {user.address && <UserDetails label="Address" value={user.address} />}
      {user.createdAt && <UserDetails label="Created At" value={convertToIST(user.createdAt)} />}
      {user.branches.length ? (
        <div className="grid grid-cols-2 md:grid-cols-1">
          <span className="font-bold">Branches</span>
          <ul>
            {user.branches.map((branch) => (
              <li className="text-gray-600">{branch.name}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {user.document && (
        <div className="col-span-1 flex flex-col items-start justify-center">
          <button
            className="px-2 py-[2px] text-white text-sm transition duration-300 bg-blue-600 rounded-md hover:bg-blue-800"
            onClick={() => setShowOverlay(true)}
          >
            View Document
          </button>
        </div>
      )}
      {showOverlay && user.document && (
        <DocumentOverlay documentUrl={`http://localhost:3001/${user.document.replace("src/", "")}`} onClose={() => setShowOverlay(false)} />
      )}
    </>
  );
};

const ViewUser = () => {
  const { id } = useParams();
  const { data, error, isLoading } = useGetEmployeeByIdQuery({ id });
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal
  const [deleteEmployee] = useDeleteEmployeeMutation(); // Delete mutation hook

  const navigate = useNavigate();

  const handleDeleteBranch = async () => {
    try {
      //@ts-ignore
      await deleteEmployee({ id }).unwrap();
      setIsModalOpen(false);
      toast.success("User Sucessfully Deleted");
      navigate("/user");
    } catch (error) {
      toast.error("Cannot Delete User");
    }
  };

  // Handle loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Handle error state
  if (error) {
    return <div>Error loading user details</div>;
  }

  const user: User | undefined = data?.data?.user;
  if (!user) {
    return <div>No user found</div>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-4">
        <hr className="md:col-span-3" />
        <div className="flex items-center justify-between md:col-span-3">
          <p className="text-2xl font-bold text-gray-500 md:col-span-3">User Details</p>
          {user.role === "ADMIN" ? null : (
            <div>
              <button
                className="px-2 py-[2px] text-white text-sm transition duration-300 bg-red-500 rounded-md hover:bg-red-800"
                onClick={() => setIsModalOpen(true)}
              >
                Delete
              </button>
            </div>
          )}
        </div>
        <hr className="md:col-span-3" />
        <UserInfo user={user} />
      </div>

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-semibold mb-4">Delete Confirmation</h2>
            <p>Are you sure you want to delete this branch?</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300">
                Cancel
              </button>
              <button onClick={handleDeleteBranch} className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-800">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewUser;
