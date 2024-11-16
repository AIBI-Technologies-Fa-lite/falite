import React, { useEffect, useMemo, useState } from "react";
import { useReactTable, getCoreRowModel, flexRender, getPaginationRowModel, getSortedRowModel, SortingState } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import { useGetBillingQuery } from "@api/verificationApi";
import { convertToIST } from "@utils/time";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "src/store"; // Assuming you have a RootState type for your redux state
import { Role } from "@constants/enum";
import { Status } from "@constants/enum";
const Billing: React.FC = () => {
  const navigate = useNavigate();
  const role = useSelector((state: RootState) => state.auth.user?.role as Role);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, _] = useState<number>(10);

  const { data, error, isLoading } = useGetBillingQuery({});
  useEffect(() => {
    if (error) {
      toast.error("An error occurred while fetching verifications.");
    }
  }, [error]);

  const columns = useMemo(() => {
    const commonColumns = [
      { header: "ID", accessorKey: "id", enableSorting: true },
      { header: "Product", accessorFn: (row: any) => row.case.product, enableSorting: false },
      { header: "Client", accessorFn: (row: any) => row.case.clientName, enableSorting: false },
      { header: "Type", accessorFn: (row: any) => row.verificationType.name, enableSorting: false },
      {
        header: "Status",
        accessorKey: "status",
        cell: (info) => {
          const status = info.getValue();
          if (status === Status.PENDING) return <div className="text-orange-500">Pending</div>;
          if (status === Status.ONGOING) return <div className="text-yellow-500">In Progress</div>;
          if (status === Status.REASSIGN) return <div className="text-red-500">Reassign</div>;
          return <div className="text-green-500">Completed</div>;
        },
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
            className="px-4 py-1 text-white transition duration-300 bg-purple-600 rounded-md hover:bg-purple-800"
          >
            View
          </button>
        ),
        enableSorting: false
      }
    ];

    if (["ADMIN", "CRE", "SUPERVISOR", "ACCOUNTS"].includes(role)) {
      commonColumns.splice(5, 0, {
        header: "OF",
        accessorFn: (row) => `${row.of.firstName} ${row.of.lastName}`,
        enableSorting: false
      });
    }

    if (["ADMIN", "OF", "SUPERVISOR", "ACCOUNTS"].includes(role)) {
      commonColumns.splice(4, 0, {
        header: "CRE",
        accessorFn: (row) => `${row.case.employee.firstName} ${row.case.employee.lastName}`,
        enableSorting: false
      });
    }

    return commonColumns;
  }, [navigate, role]);

  // Update `pageCount` in `useReactTable`
  const table = useReactTable({
    data: data?.data.verifications || [],
    columns,
    state: { sorting, pagination: { pageIndex, pageSize } },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: data?.meta.pages || 0 // Default to 1 if no pages data to avoid issues
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
      <div className="flex items-center justify-center h-64">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
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
                    {header.column.getIsSorted() === "asc" ? " ↑" : header.column.getIsSorted() === "desc" ? " ↓" : null}
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

export default Billing;
