import { useEffect, useMemo, useState } from "react";
import { useReactTable, getCoreRowModel, flexRender, getPaginationRowModel, getSortedRowModel, SortingState } from "@tanstack/react-table";
import { useGetEmployeesQuery } from "@api/userApi";
import { Role } from "@constants/enum";
import { useNavigate } from "react-router-dom";
import { convertToIST } from "@utils/time";
import Pagination from "@components/Pagination";

const ViewUsers = () => {
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>(search);
  const [role, setRole] = useState<string>("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const pageSize = 10; // Fixed page size
  const roles = Object.values(Role);
  const navigate = useNavigate();

  // Debouncing effect: Update debouncedSearchInput 500ms after the user stops typing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPageIndex(0); // Reset to first page on search
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const { data, isLoading } = useGetEmployeesQuery({
    page: pageIndex + 1,
    limit: pageSize,
    search: debouncedSearch,
    role: role,
    order: sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : undefined // Pass the sorting order
  });

  // Define table columns
  const columns = useMemo(
    () => [
      { header: "Name", accessorFn: (row: any) => `${row.firstName} ${row.lastName}` },
      { header: "Role", accessorKey: "role" },
      { header: "Created At", accessorKey: "createdAt", cell: (info: any) => convertToIST(info.getValue()) },
      {
        header: "Actions",
        cell: ({ row }: { row: { original: { id: number } } }) => (
          <button
            onClick={() => navigate(`/user/${row.original.id}`)}
            className="px-4 py-1 text-white transition duration-300 bg-purple-600 rounded-md hover:bg-purple-800"
            aria-label={`View user ${row.original.id}`}
          >
            View
          </button>
        )
      }
    ],
    [navigate]
  );

  // Create a React Table instance
  const table = useReactTable({
    data: data?.data.employees || [], // Safely access data or provide empty array
    columns,
    state: { sorting, pagination: { pageIndex, pageSize } },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true, // Enable manual pagination
    pageCount: data?.meta?.pages || 1 // Dynamically get page count with fallback
  });

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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded-md"
            placeholder={`Search by First Name`}
            aria-label="Search by first name"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded-md"
            aria-label="Filter by role"
          >
            <option value="">All</option>
            {roles.map((role, idx) => (
              <option key={idx} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
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
                    aria-label={`Sort by ${header.column.id}`}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() === "asc" ? " ↑" : header.column.getIsSorted() === "desc" ? " ↓" : ""}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row, rowIndex) => (
                <tr key={row.id} className={`${rowIndex % 2 === 0 ? "bg-purple-50" : "bg-white"}`}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-1 text-left text-gray-700">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-3 text-center text-gray-500">
                  No users found
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
    </div>
  );
};

export default ViewUsers;
