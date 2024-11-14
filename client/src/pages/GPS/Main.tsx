import React, { useRef, useEffect, useState, useMemo } from "react";
import { useReactTable, getCoreRowModel, getFilteredRowModel, flexRender, ColumnDef } from "@tanstack/react-table";
import { SlSpeedometer } from "react-icons/sl";
import { PiMapPinArea } from "react-icons/pi";
import mapboxgl from "src/config/mapbox";

// Define the types for the data structures
interface Location {
  latitude: number;
  longitude: number;
  updatedAt: string;
}

interface Verification {
  destination: Location;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  location: Location;
  checkins: number;
  distance: string;
  verifications: Verification[];
}

interface MainProps {
  users: User[];
}

const Main: React.FC<MainProps> = ({ users }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const clearMarkers = () => {
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
  };

  const addMarkers = (
    locations: { longitude: number; latitude: number; name: string; updatedAt: string; checkins?: number; distance?: string }[],
    isDestination = false
  ) => {
    locations.forEach((location) => {
      const marker = new mapboxgl.Marker({ color: isDestination ? "red" : "blue" })
        .setLngLat([location.longitude, location.latitude]) // Coordinates fixed to [longitude, latitude]
        .addTo(map.current!);

      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
      }).setHTML(`
        <div>
          <strong>${location.name}</strong><br/>
          ${
            isDestination
              ? `Check-in Time: ${new Date(location.updatedAt).toLocaleString()}`
              : `Check-ins: ${location.checkins}<br/>Distance: ${location.distance}<br/>Last Seen: ${new Date(location.updatedAt).toLocaleString()}`
          }
        </div>
      `);

      marker.getElement().addEventListener("mouseenter", () => {
        popup.setLngLat([location.longitude, location.latitude]).addTo(map.current!);
      });

      marker.getElement().addEventListener("mouseleave", () => {
        popup.remove();
      });

      markersRef.current.push(marker);
    });
  };

  useEffect(() => {
    if (!map.current) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          map.current = new mapboxgl.Map({
            container: mapContainer.current!,
            style: "mapbox://styles/aibitech-24/clzb52o2w006k01r32orn42wc",
            center: [position.coords.longitude, position.coords.latitude],
            zoom: 12
          });

          map.current.on("load", () => {
            // Initialize markers for all users' origins after the map is fully loaded
            addMarkers(
              users.map((user) => ({
                ...user.location,
                name: `${user.firstName} ${user.lastName}`,
                checkins: user.checkins,
                distance: user.distance,
                updatedAt: user.location.updatedAt
              }))
            );
          });
        },
        (error) => {
          console.error("Error fetching location", error);
        },
        { enableHighAccuracy: true }
      );
    } else {
      clearMarkers();

      if (selectedUserId !== null) {
        const selectedUser = users.find((user) => user.id === selectedUserId);
        if (selectedUser) {
          addMarkers(
            selectedUser.verifications.map((verification) => ({
              ...verification.destination,
              name: `${selectedUser.firstName} ${selectedUser.lastName}`,
              updatedAt: verification.destination.updatedAt
            })),
            true
          );
        }
      } else {
        addMarkers(
          users.map((user) => ({
            ...user.location,
            name: `${user.firstName} ${user.lastName}`,
            checkins: user.checkins,
            distance: user.distance,
            updatedAt: user.location.updatedAt
          }))
        );
      }
    }
  }, [users, selectedUserId]);

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        header: "Employee",
        accessorKey: "name",
        cell: ({ row }) => (
          <div className="flex items-center space-x-3">
            <div>
              <div className="font-medium">
                {row.original.firstName} {row.original.lastName}
              </div>
            </div>
          </div>
        ),
        filterFn: "includesString"
      }
    ],
    []
  );

  const filteredUsers = useMemo(() => {
    if (!globalFilter) return users;
    return users.filter((user) => `${user.firstName} ${user.lastName}`.toLowerCase().includes(globalFilter.toLowerCase()));
  }, [users, globalFilter]);

  const table = useReactTable({
    data: filteredUsers,
    columns,
    state: {
      globalFilter
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel()
  });

  const rows = table.getRowModel().rows;

  const toggleAccordion = (rowId: string) => {
    setExpandedRowId(expandedRowId === rowId ? null : rowId);
  };

  return (
    <div className="flex flex-col gap-2 pb-2 md:flex-row">
      <div className="flex flex-col w-full p-2 md:p-4 bg-white rounded-lg shadow-lg md:w-1/4 md:h-[500px] h-[150px] text-sm md:text-base overflow-y-scroll scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-slate-700 scrollbar-track-slate-300">
        <input
          type="text"
          placeholder="Search by name"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="p-2 mb-2 border border-gray-300 rounded-md"
        />
        <button
          onClick={() => {
            setSelectedUserId(null);
            setExpandedRowId(null);
          }}
          className="w-full px-4 py-2 mb-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-700"
        >
          Show All Origins
        </button>

        <div className="space-y-2 md:space-y-4">
          {rows.map((row) => (
            <div key={row.id} className="p-3 bg-gray-100 rounded-lg shadow cursor-pointer" onClick={() => toggleAccordion(row.id)}>
              <div className="accordion-header">
                {row.getVisibleCells().map((cell) => (
                  <div key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</div>
                ))}
              </div>
              {expandedRowId === row.id && (
                <div className="flex justify-between mt-2 md:mt-4">
                  <p className="flex items-center gap-2">
                    <SlSpeedometer className="text-xl text-green-500" />
                    {row.original.distance}
                  </p>
                  <button
                    className="flex items-center gap-2 px-2 py-1 text-white bg-purple-500 rounded-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedUserId(row.original.id);
                      setExpandedRowId(row.id);
                    }}
                    disabled={!row.original.checkins}
                  >
                    <PiMapPinArea className="text-xl" />
                    {row.original.checkins}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right panel with map */}
      <div className="relative w-full md:w-3/4">
        <div ref={mapContainer} className="w-full h-[500px] map-container" />
      </div>
    </div>
  );
};

export default Main;
