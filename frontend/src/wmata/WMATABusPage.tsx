import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import axios from "axios"; // Import axios library
import { DataTable } from "./DataTable"
import { Bus, columns } from "./Columns"
import BusMap from "./BusMap";

const WmataBusPage = () => {
    const [open, setOpen] = React.useState(false);
    const [selectedRoute, setSelectedRoute] = useState("");
    const [busStops, setBusStops] = useState<BusStops | null>(null);
    const [stopId, setStopId] = useState("");
    const [stopName, setStopName] = useState("");
    const [busData, setBusData] = useState({ Predictions: [] } as { Predictions: Bus[] });

    interface Route {
        RouteID: string;
        Name: string;
        LineDescription: string;
    }

    interface BusStop {
        "StopID": string,
        "Name": string,
        "Lon": number,
        "Lat": number,
        "Routes": []
    }

    interface BusStops {
        zeroDirDest?: string;
        oneDirDest?: string;
        Direction0?: { "TripHeadsign": string, "DirectionText": string, "DirectionNum": string, "Shape": [], "Stops": BusStop[] };
        Direction1?: { "TripHeadsign": string, "DirectionText": string, "DirectionNum": string, "Shape": [], "Stops": BusStop[] };
    }


    const [busRoutes, setBusRoutes] = useState<Route[]>([]);

    const fetchBusRoutes = async () => {
        try {
            const response = await axios.get("http://localhost:9998/wmata-bus-routes");
            console.log(response.data);
            if (response.data) {
                setBusRoutes(response.data.Routes);
            } else {
                console.error("No data found");
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchBusRoutes();
    }, []);

    const fetchBusStopsData = async (route: string) => {
        try {
            const response = await axios.get(`http://localhost:9998/wmata-bus-stops/${encodeURIComponent(route)}`);
            console.log(response.data);
            if (response.data) {
                setBusStops(response.data);
            } else {
                console.error("No data found");
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        console.log("Routes: " + busRoutes);
    }, [busRoutes]);

    useEffect(() => {
        console.log("Selected Route: " + selectedRoute);
    }, [selectedRoute]);

    useEffect(() => {
        console.log("Stop ID: " + stopId);
        console.log("STOPNAME: " + stopName);
    }, [stopId]);

    useEffect(() => {
        if (selectedRoute) {
            fetchBusStopsData(selectedRoute); // Fetch bus stops data when the selected route changes
        } else {
            setBusStops(null); // Reset busStops to null when no route is selected
        }
    }, [selectedRoute]);

    const fetchBusData = async () => {
        try {
            if (stopId === "") {
                return;
            }
            console.log("Fetching bus data for stop ID: " + stopId )
            const response = await axios.get(`http://localhost:9998/wmata-bus?stopId=${encodeURIComponent(stopId)}`);
            console.log("Bus Res:");
            console.log(response);
            setBusData(response.data);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchBusData();
        const interval = setInterval(fetchBusData, 30000); // Fetch data every 30 seconds

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, [stopId]);

    useEffect(() => {
        console.log("Bus Data:");
        console.log(busData);
    }, [busData]);

    return (
        <div className="container mx-auto py-10 flex gap-x-8 overflow-auto">
            <div className="w-3/12">
                <div className="grid grid-cols-1 gap-2">
                <h2 className="text-2xl font-bold text-center tracking-tight underline"> WMATA Bus Tracker </h2>
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-auto justify-between"
                            >
                                {selectedRoute
                                    ? busRoutes.find((route) => route.RouteID === selectedRoute)?.RouteID
                                    : "Select Route..."}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                            <Command>
                                <CommandInput placeholder="Search Route..." className="h-9" />
                                <CommandList>
                                    <CommandEmpty>No routes found.</CommandEmpty>
                                    <CommandGroup>
                                        {busRoutes.map((route) => (
                                            <CommandItem
                                                key={route.RouteID}
                                                value={route.RouteID}
                                                onSelect={(currentValue) => {
                                                    setSelectedRoute(currentValue === selectedRoute ? "" : currentValue);
                                                    setOpen(false);
                                                }}
                                            >
                                                {route.RouteID}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <Button onClick={fetchBusData}> Refresh </Button>
                </div>

                <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                        <AccordionTrigger>{busStops && busStops.Direction0 && busStops.Direction0.TripHeadsign ? busStops.Direction0.TripHeadsign : "Northbound"}</AccordionTrigger>
                        <AccordionContent>
                            <ScrollArea className="h-64 w-68 rounded-md border">
                                <div className="p-4">
                                    <h4 className="mb-4 text-sm font-medium leading-none">Stops</h4>
                                    {busStops && busStops.Direction0
                                        ? busStops.Direction0.Stops.map((stop) => (
                                            <React.Fragment key={stop.StopID}>
                                                <div
                                                    className="text-sm cursor-pointer"
                                                    onClick={() => {
                                                        setStopId(stop.StopID);
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
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                        <AccordionTrigger>{busStops && busStops.Direction1 && busStops.Direction1.TripHeadsign ? busStops.Direction1.TripHeadsign : "Southbound"}</AccordionTrigger>
                        <AccordionContent>
                            <ScrollArea className="h-64 w-68 rounded-md border">
                                <div className="p-4">
                                    <h4 className="mb-4 text-sm font-medium leading-none">Stops</h4>
                                    {busStops && busStops.Direction1
                                        ? busStops.Direction1.Stops.map((stop) => (
                                            <React.Fragment key={stop.StopID}>
                                                <div
                                                    className="text-sm cursor-pointer"
                                                    onClick={() => {
                                                        setStopId(stop.StopID);
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
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

            </div>
            <div className="w-9/12">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Stop: {stopName}!</h2>
                    <p className="text-muted-foreground">
                        Stop ID: {stopId}
                    </p>
                </div>
                <DataTable columns={columns} data={busData.Predictions} />


                <Tabs defaultValue="northbound">
                    <div className="flex justify-center">
                        <TabsList>
                            <TabsTrigger value="northbound">Northbound</TabsTrigger>
                            <TabsTrigger value="southbound">Southbound</TabsTrigger>

                        </TabsList>
                    </div>
                    <TabsContent value="northbound">
                        <h1 className="text-xl font-bold flex justify-center">
                            {busStops && busStops.zeroDirDest ? "To " + busStops.zeroDirDest : ""}
                        </h1>

                        {busStops && busStops.Direction0 && busStops.Direction0.Stops ? (
                            <BusMap stops={busStops.Direction0.Stops} />
                        ) : (
                            <p>No map data available.</p>
                        )}
                    </TabsContent>

                    <TabsContent value="southbound">
                        <h1 className="text-xl font-bold flex justify-center">
                            {busStops && busStops.oneDirDest ? "To " + busStops.oneDirDest : ""}
                        </h1>

                        {busStops && busStops.Direction1 && busStops.Direction1.Stops ? (
                            <BusMap stops={busStops.Direction1.Stops} />
                        ) : (
                            <p>No map data available.</p>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default WmataBusPage;
