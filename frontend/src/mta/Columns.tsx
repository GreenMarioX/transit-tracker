"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"


import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type additionalBusData = {
  stopsAway: number
  expectedArrival: Date
  aimedArrival: Date
  timeDiff: number
  passengerCount: number
  maxCapacity: number
  stroller: "Yes" | "No"
}
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Bus = {
  id: string
  route: string
  destination: string
  vehicle: number
  stroller: "Yes" | "No"
  presentableDistance: string
  timeAway: string
  other: additionalBusData
}

export const columns: ColumnDef<Bus>[] = [
    {
        accessorKey: "route",
        header: "Route",
        cell: ({ row }) => {
          const route = row.getValue<string>("route");
          const stopsAway = row.original.other.stopsAway;
          const aimedTime = row.original.other.aimedArrival.toLocaleTimeString();
          const expectedTime = row.original.other.expectedArrival.toLocaleTimeString();
          const status =  row.original.other.timeDiff > 0 ? `${ row.original.other.timeDiff} mins late` : `${Math.abs( row.original.other.timeDiff)} mins early`;
          const capacity = `${ row.original.other.passengerCount}/${ row.original.other.maxCapacity}`;
          const stroller = row.original.other.stroller;
          return(
            <HoverCard>
            <HoverCardTrigger>{route}</HoverCardTrigger>
              <HoverCardContent>
                Stops Away: {stopsAway}<br />
                Aimed Arrival: {aimedTime}<br />
                Expected Arrival: {expectedTime}<br />
                Status: {status}<br />
                Capacity: {capacity}<br />
                Strollers: {stroller}
              </HoverCardContent>
            </HoverCard>

          )
        }
    },
    {
        accessorKey: "destination",
        header: "Destination",
    },
    {
        accessorKey: "presentableDistance",
        header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Distance
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            )},
        sortingFn: (a, b) => {
            const aValue = a.getValue<string>('presentableDistance');
            const bValue = b.getValue<string>('presentableDistance');
      
            const parseDistanceAway = (value: string): number => {
                if (value.includes("Stops Away")) {
                    const match = value.match(/(\d+) Stops Away/);
                    return match ? parseInt(match[1], 10) : 0; // Stops away are less than any number of miles
                } else if (value.includes("miles")) {
                    const match = value.match(/([\d.]+) miles/);
                    return match ? parseFloat(match[1]) + 1000 : 1000; // Adding 1000 to distinguish miles from stops
                }
              return 1000; // Default to a high number if parsing fails
            };

            const parsedAValue = parseDistanceAway(aValue);
            const parsedBValue = parseDistanceAway(bValue);
      
            return parsedAValue - parsedBValue;
          }
    },
    {
        accessorKey: "timeAway",
        header: ({ column }) => {
        return (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Time Away
            <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        )},
        sortingFn: (a, b) => {
        const aValue = a.getValue<string>('timeAway');
        const bValue = b.getValue<string>('timeAway');
  
        const parseTimeAway = (value: string): number | string => {
          if (value === "At Terminal") return -Infinity; // Ensure "At Terminal" is always at the top or bottom
          const match = value.match(/(\d+) Minutes Away/);
          return match ? parseInt(match[1], 10) : value;
        };
  
        const parsedAValue = parseTimeAway(aValue);
        const parsedBValue = parseTimeAway(bValue);
  
        if (typeof parsedAValue === 'string') return 1;
        if (typeof parsedBValue === 'string') return -1;
  
        return parsedAValue - parsedBValue;
      }
  },
  {
    accessorKey: "vehicle",
    header: "Vehicle",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const busRow = row.original
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-2 w-4 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText("Next " + busRow.route + " (Vehicle " + busRow.vehicle + "): " + busRow.timeAway)}
            >
              Copy Next Bus Info
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Share (TBD)</DropdownMenuItem>
            <DropdownMenuItem>Favorite (TBD)</DropdownMenuItem>
            <DropdownMenuItem>Copy Stop Id (TBD)</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
