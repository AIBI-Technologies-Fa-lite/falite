import { useEffect, useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState
} from "@tanstack/react-table";
import { useGetBranchesQuery, useDeleteBranchMutation } from "@api/branchApi";
import { toast } from "react-toastify";
import { convertToIST } from "@utils/time";
import Pagination from "@components/Pagination";

const ViewBranches = () => {
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>(search);

  const [searchColumn, setSearchColumn] = useState<string>("");
  const [debouncedSearchColumn, setDebouncedSearchColumn] =
    useState<string>("");

  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const pageSize = 10; // Fixed page size

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);

  const [deleteBranch] = useDeleteBranchMutation();

  // Function to handle delete action
  const handleDeleteBranch = async () => {
    if (selectedBranchId) {
      try {
        await deleteBranch(selectedBranchId).unwrap();
        toast.success("Branch deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete the branch.");
      } finally {
        setIsModalOpen(false);
        setSelectedBranchId(null); // Reset after deletion
      }
    }
  };

  // Debouncing effect: Update debouncedSearchInput 1 second after the user stops typing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchColumn(searchColumn);
      setDebouncedSearch(search);
      setPageIndex(0); // Reset to first page on search
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [search, searchColumn]);

  const { data, isLoading } = useGetBranchesQuery({
    page: pageIndex + 1,
    limit: 10,
    search: debouncedSearch,
    searchColumn: debouncedSearchColumn,
    order: sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : undefined // Pass the sorting order
  });

  // Define table columns
  const columns = useMemo(
    () => [
      { header: "Branch Code", accessorKey: "code" },
      { header: "Branch Name", accessorKey: "name" },
      {
        header: "Created At",
        accessorKey: "createdAt",
        cell: (info: any) => convertToIST(info.getValue())
      },
      {
        header: "Actions",
        cell: ({ row }: { row: { original: { id: number } } }) => (
          <button
            onClick={() => {
              setSelectedBranchId(`${row.original.id}`); // Set the selected branch ID
              setIsModalOpen(true); // Open modal
            }}
            className='px-4 py-1 text-white transition duration-300 bg-red-600 rounded-md hover:bg-red-800'
          >
            Delete
          </button>
        )
      }
    ],
    []
  );

  // Create a React Table instance
  const table = useReactTable({
    data: data?.data.branches || [], // Safely access data or provide empty array
    columns,
    state: { sorting, pagination: { pageIndex, pageSize } },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true, // Enable manual pagination
    pageCount: data?.meta.pages || 1 // Dynamically get page count
  });

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div className='flex flex-col gap-2 mb-6 md:flex-row md:justify-between'>
        <div className='flex items-center text-sm md:gap-4 md:justify-start md:text-base'>
          <input
            id='searchInput'
            type='text'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='px-2 py-1 border border-gray-300 rounded-md'
            placeholder={`Search by ${
              searchColumn === "code" ? "Branch Code" : "Branch Name"
            }`}
          />
          <select
            value={searchColumn}
            onChange={(e) => setSearchColumn(e.target.value)}
            className='px-2 py-1 border border-gray-300 rounded-md'
            aria-label='Select column to search'
          >
            <option value='code'>Branch Code</option>
            <option value='name'>Branch Name</option>
          </select>
        </div>
      </div>

      <div className='overflow-x-auto'>
        <table className='min-w-full bg-white border border-gray-200'>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className='bg-gray-100'>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className='px-6 py-2 font-medium text-left text-gray-600 hover:cursor-pointer'
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {header.column.getIsSorted() === "asc"
                      ? " ↑"
                      : header.column.getIsSorted() === "desc"
                      ? " ↓"
                      : ""}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row, rowIndex) => (
                <tr
                  key={row.id}
                  className={`${
                    rowIndex % 2 === 0 ? "bg-purple-50" : "bg-white"
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className='px-6 py-1 text-left text-gray-700'
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className='px-6 py-3 text-center text-gray-500'
                >
                  No branches found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={table.getState().pagination.pageIndex}
        totalPageCount={table.getPageCount()}
        onPageChange={(page) => setPageIndex(page)}
        onNext={() => setPageIndex((prev) => prev + 1)}
        onPrevious={() => setPageIndex((prev) => prev - 1)}
        canPreviousPage={table.getCanPreviousPage()}
        canNextPage={table.getCanNextPage()}
      />

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white rounded-lg shadow-lg p-6 w-96'>
            <h2 className='text-lg font-semibold mb-4'>Delete Confirmation</h2>
            <p>Are you sure you want to delete this branch?</p>
            <div className='mt-4 flex justify-end space-x-2'>
              <button
                onClick={() => setIsModalOpen(false)}
                className='px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300'
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteBranch}
                className='px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-800'
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewBranches;
