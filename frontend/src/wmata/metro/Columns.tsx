"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Train = {
    "Car": string,
    "Destination": string,
    "DestinationCode": string,
    "DestinationName": string,
    "Group": string,
    "Line": string,
    "LocationCode": string,
    "LocationName": string,
    "Min": string
}

export const columns: ColumnDef<Train>[] = [
  {
    accessorKey: "Line",
    header: "Line",
  },
  {
    accessorKey: "DestinationName",
    header: "DestinationName",
  },
//   {
//     accessorKey: "presentableDistance",
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           Distance
//           <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       )
//     },
//     sortingFn: (a, b) => {
//       const aValue = a.getValue<string>('presentableDistance');
//       const bValue = b.getValue<string>('presentableDistance');

//       const parseDistanceAway = (value: string): number => {
//         if (value.includes("Stops Away")) {
//           const match = value.match(/(\d+) Stops Away/);
//           return match ? parseInt(match[1], 10) : 0; // Stops away are less than any number of miles
//         } else if (value.includes("miles")) {
//           const match = value.match(/([\d.]+) miles/);
//           return match ? parseFloat(match[1]) + 1000 : 1000; // Adding 1000 to distinguish miles from stops
//         }
//         return 1000; // Default to a high number if parsing fails
//       };

//       const parsedAValue = parseDistanceAway(aValue);
//       const parsedBValue = parseDistanceAway(bValue);

//       return parsedAValue - parsedBValue;
//     }
//   },
  {
    accessorKey: "Min",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Time Away
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "Car",
    header: "Cars",
  },
//   {
//     id: "actions",
//     cell: ({ row }) => {
//       const busRow = row.original

//       return (
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" className="h-2 w-4 p-0">
//               <span className="sr-only">Open menu</span>
//               <MoreHorizontal className="h-4 w-4" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuLabel>Actions</DropdownMenuLabel>
//             <DropdownMenuItem
//               onClick={() => navigator.clipboard.writeText("Next " + busRow.RouteID + " (Vehicle " + busRow.VehicleID + "): " + busRow.Minutes)}
//             >
//               Copy Next Bus Info
//             </DropdownMenuItem>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem>Share (TBD)</DropdownMenuItem>
//             <DropdownMenuItem>Favorite (TBD)</DropdownMenuItem>
//             <DropdownMenuItem>Copy Stop Id (TBD)</DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       )
//     },
//   },
]
