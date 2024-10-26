import React, { useEffect, useMemo, useState } from "react";
import { useReactTable, getCoreRowModel, flexRender, getPaginationRowModel, getSortedRowModel, SortingState } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import { useGetCasesQuery } from "@api/verificationApi";
import { convertToIST } from "@utils/time";
import { toast } from "react-toastify";
import { Status } from "@constants/enum";

// Define the structure of each case item and the API response
type Case = {
  id: string;
  caseNumber: string;
  product: string;
  clientName: string;
  applicantName: string;
  status: Status;
  updatedAt: string;
};

const ViewCases: React.FC = () => {
  const navigate = useNavigate();

  // States for searching, sorting, and pagination
  const [searchInput, setSearchInput] = useState<string>("");
  const [debouncedSearchInput, setDebouncedSearchInput] = useState<string>(searchInput);
  const [searchColumn, setSearchColumn] = useState<string>("caseNumber");
  const [debouncedSearchColumn, setDebouncedSearchColumn] = useState<string>(searchColumn);
  const [statusInput, setStatusInput] = useState<number>(-1);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, _] = useState<number>(10);

  // Debouncing effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchInput(searchInput);
      setDebouncedSearchColumn(searchColumn);
      setPageIndex(0); // Reset to first page on search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput, searchColumn]);

  // Fetch cases with pagination, search, and sorting
  const { data, error, isLoading } = useGetCasesQuery({
    page: pageIndex + 1, // API is 1-based index, so add 1
    limit: pageSize,
    search: debouncedSearchInput,
    searchColumn: debouncedSearchColumn,
    status: statusInput,
    order: sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : undefined
  });

  // Display error toast
  useEffect(() => {
    if (error) {
      toast.error((error as { message: string }).message);
    }
  }, [error]);

  // Table column definitions
  const columns = useMemo(
    () => [
      { header: "Case Number", accessorKey: "caseNumber", enableSorting: false },
      { header: "Product", accessorKey: "product", enableSorting: false },
      { header: "Client", accessorKey: "clientName", enableSorting: false },
      { header: "Applicant Name", accessorKey: "applicantName", enableSorting: false },
      {
        header: "Status",
        accessorKey: "status",
        cell: (info: { getValue: () => Status }) => {
          const status = info.getValue();
          switch (status) {
            case Status.ASSIGN:
              return <div className="text-orange-500">Assign Verifications</div>;
            case Status.PENDING:
              return <div className="text-yellow-500">In Progress</div>;
            case Status.REVIEW:
              return <div className="text-blue-500">CRE Review</div>;
            case Status.REASSIGN:
              return <div className="text-red-500">Re Assign Verifications</div>;
            default:
              return <div className="text-green-500">Completed</div>;
          }
        },
        enableSorting: false
      },
      {
        header: "Updated At",
        accessorKey: "updatedAt",
        cell: (info: { getValue: () => string }) => convertToIST(info.getValue()),
        enableSorting: true
      },
      {
        header: "Actions",
        cell: ({ row }: { row: { original: Case } }) => (
          <button
            onClick={() => navigate(`/verification/case/${row.original.id}`)}
            className="px-4 py-1 text-white transition duration-300 bg-purple-600 rounded-md hover:bg-purple-800"
          >
            View
          </button>
        ),
        enableSorting: false
      }
    ],
    [navigate]
  );

  const table = useReactTable({
    data: data?.data.cases || [],
    columns,
    state: { sorting, pagination: { pageIndex, pageSize } },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: data?.meta.totalPages || 0
  });

  // Pagination settings
  const currentPage = table.getState().pagination.pageIndex;
  const totalPageCount = table.getPageCount();

  const visiblePages = useMemo(() => {
    let start = Math.max(currentPage - 1, 0);
    let end = Math.min(start + 3, totalPageCount);

    if (end === totalPageCount) {
      start = Math.max(end - 3, 0);
    }

    return Array.from({ length: end - start }, (_, i) => start + i);
  }, [currentPage, totalPageCount]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-2 mb-6 md:flex-row md:justify-between">
        <div className="flex items-center text-sm md:gap-4 md:justify-start md:text-base">
          <input
            id="searchInput"
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded-md"
            placeholder={`Search by ${searchColumn === "caseNumber" ? "Case Number" : "Name"}`}
          />
          <select
            value={searchColumn}
            onChange={(e) => setSearchColumn(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded-md"
            aria-label="Select column to search"
          >
            <option value="caseNumber">Case Number</option>
            <option value="applicantName">Applicant Name</option>
          </select>
        </div>
        <select
          value={statusInput}
          onChange={(e) => setStatusInput(Number(e.target.value))}
          className="px-2 py-1 border border-gray-300 rounded-md"
          aria-label="Select status to filter"
        >
          <option value="-1">All</option>
          <option value="0">Assign Verifications</option>
          <option value="1">In Progress</option>
          <option value="2">CRE Review</option>
          <option value="3">Completed</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-gray-100">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-2 font-medium text-left text-gray-600 hover:cursor-pointer"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() ? (header.column.getIsSorted() === "asc" ? " ↑" : " ↓") : ""}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, rowIndex) => (
              <tr key={row.id} className={`${rowIndex % 2 === 0 ? "bg-purple-50" : "bg-white"}`}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-1 text-left text-gray-700">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-center mt-4 space-x-2">
        <button
          onClick={() => table.getCanPreviousPage() && setPageIndex((prev) => prev - 1)}
          disabled={!table.getCanPreviousPage()}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            table.getCanPreviousPage() ? "text-gray-600 hover:text-purple-600" : "text-gray-300 cursor-not-allowed"
          }`}
          aria-label="Previous page"
        >
          Previous
        </button>
        {visiblePages.map((page) => (
          <button
            key={page}
            onClick={() => setPageIndex(page)}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              table.getState().pagination.pageIndex === page ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
            aria-label={`Go to page ${page + 1}`}
          >
            {page + 1}
          </button>
        ))}
        <button
          onClick={() => table.getCanNextPage() && setPageIndex((prev) => prev + 1)}
          disabled={!table.getCanNextPage()}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            table.getCanNextPage() ? "text-gray-600 hover:text-purple-600" : "text-gray-300 cursor-not-allowed"
          }`}
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ViewCases;
