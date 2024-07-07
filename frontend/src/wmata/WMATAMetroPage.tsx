import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import * as React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { DataTable } from "./metro/DataTable"
import { columns } from "./metro/Columns"


import Image from "next/image"

import { AspectRatio } from "@/components/ui/aspect-ratio"


const WMATAMetroPage = () => {
  const [open, setOpen] = React.useState(false);
  const [selectedRoute, setSelectedRoute] = useState("");
  const [metroRoutes, setMetroRoutes] = useState<Route[]>([]);
  const [metroStops, setMetroStops] = useState<MetroStop[] | null>(null);
  const [stopName, setStopName] = useState("");
  const [stopCode, setStopCode] = useState("");
  const [metroData, setMetroData] = useState<any>([]);

  interface Route {
    LineCode: string,
    DisplayName: string,
    StartStationCode: string,
    EndStationCode: string,
    InternalDestination1: string,
    InternalDestination2: string
  }

  interface MetroStop {
    "Code": string,
    "Name": string,
    "StationTogether1": string,
    "StationTogether2": string,
    "LineCode1": string,
    "LineCode2": string,
    "LineCode3": string,
    "LineCode4": string,
    "Lat": number,
    "Lon": number,
    "Address": {
      "Street": string,
      "City": string,
      "State": string,
      "Zip": string,
    }
  }

  const fetchMetroRoutes = async () => {
    try {
      const response = await axios.get("http://localhost:9998/wmata-metro-routes");
      console.log(response.data);
      if (response.data && response.data.Lines) {
        setMetroRoutes(response.data.Lines);
      } else {
        console.error("No data found");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMetroRoutes();
  }, []);

  useEffect(() => {
    console.log(metroStops);
  }, [metroStops]);

  const fetchMetroStopsData = async (route: string) => {
    try {
      const response = await axios.get(`http://localhost:9998/wmata-metro-stops/${encodeURIComponent(route)}`);
      console.log(response.data);
      if (response.data) {
        setMetroStops(response.data.Stations);
      } else {
        console.error("No data found");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (selectedRoute) {
      fetchMetroStopsData(selectedRoute); // Fetch bus stops data when the selected route changes
    } else {
      setMetroStops(null); // Reset busStops to null when no route is selected
    }
  }, [selectedRoute]);

  const fetchMetroData = async () => {
    try {
      if (stopCode === "") {
        return;
      }
      console.log("Fetching bus data for stop ID: " + stopCode)
      const response = await axios.get(`http://localhost:9998/wmata-metro?stopCode=${encodeURIComponent(stopCode)}`);
      console.log("Bus Res:");
      console.log(response.data.Trains);
      setMetroData(response.data.Trains);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    console.log("Metro Data:");
    console.log(metroData);
  }, [metroData]);

  useEffect(() => {
    fetchMetroData();
    const interval = setInterval(fetchMetroData, 30000); // Fetch data every 30 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [stopCode]);

  return (
    <div className="container mx-auto py-10 flex gap-x-8 overflow-auto">
      <div className="w-3/12">
        <div className="grid grid-cols-1 gap-2">
          <h2 className="text-2xl font-bold text-center tracking-tight underline"> WMATA Metro Tracker </h2>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-auto justify-between"
              >
                {selectedRoute
                  ? metroRoutes.find((route) => route.LineCode === selectedRoute)?.DisplayName
                  : "Select Route..."}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search Route..." className="h-9" />
                <CommandList>
                  <CommandEmpty>No routes found.</CommandEmpty>
                  <CommandGroup>
                    {metroRoutes.map((route) => (
                      <CommandItem
                        key={route.LineCode}
                        value={route.LineCode}
                        onSelect={(currentValue) => {
                          setSelectedRoute(currentValue === selectedRoute ? "" : currentValue);
                          setOpen(false);
                        }}
                      >
                        {route.DisplayName}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <Button onClick={fetchMetroData}> Refresh </Button>
        </div>
        <ScrollArea className="mt-2 h-96 w-68 rounded-md border">
          <div className="p-4">
            <h4 className="mb-4 text-sm font-medium leading-none">Stops</h4>
            {metroStops
              ? metroStops.map((stop) => (
                <React.Fragment key={stop.Code}>
                  <div
                    className="text-sm cursor-pointer"
                    onClick={() => {
                      setStopCode(stop.Code);
                      setStopName(stop.Name);
                    }}
                  >
                    {stop.Name}
                  </div>
                  <Separator className="my-2" />
                </React.Fragment>
              ))
              : "Choose a route"
            }
          </div>
        </ScrollArea>
      </div>
      <div className="w-9/12">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Stop: {stopName}!</h2>
          <p className="text-muted-foreground">
            Stop Code: {stopCode}
          </p>
        </div>
        <DataTable columns={columns} data={metroData} />

      </div>

    </div>



  );
}

export default WMATAMetroPage;