import React, { useEffect, useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState
} from "@tanstack/react-table";
import { useNavigate, useLocation } from "react-router-dom";
import { useGetAllVerificationsQuery } from "@api/verificationApi";
import { convertToIST } from "@utils/time";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "src/store"; // Assuming you have a RootState type for your redux state
import { Role } from "@constants/enum";
const ViewVerifications: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = useSelector((state: RootState) => state.auth.user?.role as Role);

  // Map pathnames to status values
  const statusMap: Record<string, number> = {
    "/verification/pending": 1,
    "/verification/new": 0,
    "/verification/completed": 3
  };

  const [searchInput, setSearchInput] = useState<string>("");
  const [debouncedSearchInput, setDebouncedSearchInput] =
    useState<string>(searchInput);
  const [searchColumn, setSearchColumn] = useState<string>("clientName");
  const [debouncedSearchColumn, setDebouncedSearchColumn] =
    useState<string>("");
  const [statusInput, setStatusInput] = useState<number>(-1); // Default to -1 (All)
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, _] = useState<number>(10);

  useEffect(() => {
    // Set statusInput based on the current pathname
    const newStatus = statusMap[location.pathname] ?? -1; // Default to -1 if no match
    setStatusInput(newStatus);
  }, [location.pathname]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchInput(searchInput);
      setDebouncedSearchColumn(searchColumn);
      setPageIndex(0);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput, searchColumn]);

  const { data, error, isLoading } = useGetAllVerificationsQuery({
    page: pageIndex + 1,
    limit: pageSize,
    search: debouncedSearchInput,
    searchColumn: debouncedSearchColumn,
    status: statusInput,
    sort: sorting.length > 0 ? sorting[0].id : undefined,
    order: sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : undefined
  });

  useEffect(() => {
    if (error) {
      toast.error("An error occurred while fetching verifications.");
    }
  }, [error]);

  const columns = useMemo(() => {
    const commonColumns = [
      { header: "ID", accessorKey: "id", enableSorting: true },
      {
        header: "Product",
        accessorFn: (row: any) => row.case.product,
        enableSorting: false
      },
      {
        header: "Client",
        accessorFn: (row: any) => row.case.clientName,
        enableSorting: false
      },
      {
        header: "Type",
        accessorFn: (row: any) => row.verificationType.name,
        enableSorting: false
      },
      { header: "Pincode", accessorKey: "pincode", enableSorting: true },
      {
        header: "TAT",
        accessorKey: "tat",
        cell: ({ row }) => (
          <div
            className={`${
              row.original.tat.status === 1
                ? "text-orange-500"
                : row.original.tat.status === 2
                ? "text-red-500"
                : "text-green-500"
            }`}
          >
            {`${row.original.tat.time} hr`}
          </div>
        ),
        enableSorting: false
      },
      {
        header: "Assigned At",
        accessorKey: "createdAt",
        cell: (info) => convertToIST(info.getValue()),
        enableSorting: true
      },
      {
        header: "Actions",
        cell: ({ row }) => (
          <button
            onClick={() => navigate(`/verification/${row.original.id}`)}
            className='px-4 py-1 text-white transition duration-300 bg-purple-600 rounded-md hover:bg-purple-800'
          >
            View
          </button>
        ),
        enableSorting: false
      }
    ];

    if (["ADMIN", "CRE", "SUPERVISOR"].includes(role)) {
      commonColumns.splice(5, 0, {
        header: "OF",
        accessorFn: (row) => `${row.of.firstName} ${row.of.lastName}`,
        enableSorting: false
      });
    }

    if (["ADMIN", "OF", "SUPERVISOR"].includes(role)) {
      commonColumns.splice(4, 0, {
        header: "CRE",
        accessorFn: (row) =>
          `${row.case.employee.firstName} ${row.case.employee.lastName}`,
        enableSorting: false
      });
    }

    return commonColumns;
  }, [navigate, role]);

  const table = useReactTable({
    data: data?.data.verifications || [],
    columns,
    state: { sorting, pagination: { pageIndex, pageSize } },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: data?.meta.pages || 0
  });

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
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className='px-2 py-1 border border-gray-300 rounded-md'
            placeholder={`Search by ${
              searchColumn === "caseNumber" ? "Case Number" : "Name"
            }`}
          />
          <select
            value={searchColumn}
            onChange={(e) => setSearchColumn(e.target.value)}
            className='px-2 py-1 border border-gray-300 rounded-md'
            aria-label='Select column to search'
          >
            <option value='clientName'>Client</option>
            <option value='creName'>CRE</option>
            {[Role.ADMIN, Role.SUPERVISOR].includes(role) ? (
              <option value='ofName'>OF</option>
            ) : null}
            <option value='id'>ID</option>
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
                      : null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, rowIndex) => (
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='flex items-center justify-center mt-4 space-x-2'>
        <button
          onClick={() =>
            table.getCanPreviousPage() && setPageIndex((prev) => prev - 1)
          }
          disabled={!table.getCanPreviousPage()}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            table.getCanPreviousPage()
              ? "text-gray-600 hover:text-purple-600"
              : "text-gray-300 cursor-not-allowed"
          }`}
          aria-label='Previous page'
        >
          Previous
        </button>
        {visiblePages.map((page) => (
          <button
            key={page}
            onClick={() => setPageIndex(page)}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              table.getState().pagination.pageIndex === page
                ? "bg-purple-600 text-white"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
            aria-label={`Go to page ${page + 1}`}
          >
            {page + 1}
          </button>
        ))}
        <button
          onClick={() =>
            table.getCanNextPage() && setPageIndex((prev) => prev + 1)
          }
          disabled={!table.getCanNextPage()}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            table.getCanNextPage()
              ? "text-gray-600 hover:text-purple-600"
              : "text-gray-300 cursor-not-allowed"
          }`}
          aria-label='Next page'
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ViewVerifications;
