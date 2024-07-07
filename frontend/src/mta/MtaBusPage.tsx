
import BusMap from './BusMap';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Bus, columns } from "./Columns"
import { DataTable } from "./DataTable"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import * as React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

const MtaBusPage = () => {
  const [open, setOpen] = React.useState(false)
  const [backendData, setBackendData] = useState<{ MonitoredStopVisit?: any } | null>(null);
  const [stopId, setStopId] = useState("")
  const [data, setData] = useState<Bus[]>([])
  const [busStops, setBusStops] = useState<BusStops | null>(null);
  const [selectedRoute, setSelectedRoute] = useState(""); // State to store the selected route
  const [selectedBorough, setSelectedBorough] = useState("");
  const [selectedStopName, setSelectedStopName] = useState(""); // State to store the selected stop name
  const [busRoutes, setBusRoutes] = useState<{
    manhattanReg: any;
    queensReg: any;
    bronxReg: any;
    brooklynReg: any;
    statenislandReg: any;
    xExp: any;
    queensExp: any;
    bronxExp: any;
    brooklynExp: any;
    statenislandExp: any;
    shuttles: any;
  } | null>(null);
  const [routesByBoro, setRoutesByBoro] = useState<Route[]>([]);

  interface BusStop {
    id: string;
    name: string;
  }

  interface BusStops {
    zeroDirDest?: string;
    oneDirDest?: string;
    zeroDirStopsData?: BusStop[];
    oneDirStopsData?: BusStop[];
  }

  interface Route {
    id: string;
    shortName: string;
  }

  function findValueByKey(data: any, key: any) {
    for (const prop in data) {
      if (prop === key) {
        return data[prop];
      }
    }
    return [];
  }

  useEffect(() => {
    const routesList = findValueByKey(busRoutes, selectedBorough)
    setRoutesByBoro(routesList)
  }, [selectedBorough])

  const fetchBusRoutes = async () => {
    const [nyctResponse, bcResponse] = await Promise.all([
      axios.get('http://localhost:9998/bus-routes/nyct-routes'),
      axios.get('http://localhost:9998/bus-routes/bc-routes')
    ]);

    const nyctData = nyctResponse.data;
    const bcData = bcResponse.data;

    const combinedData = {
      manhattanReg: nyctData.manhattanReg.concat(bcData.manhattanReg),
      queensReg: nyctData.queensReg.concat(bcData.queensReg),
      bronxReg: nyctData.bronxReg.concat(bcData.bronxReg),
      brooklynReg: nyctData.brooklynReg.concat(bcData.brooklynReg),
      statenislandReg: nyctData.statenislandReg.concat(bcData.statenislandReg),
      xExp: nyctData.xExp.concat(bcData.xExp),
      queensExp: nyctData.queensExp.concat(bcData.queensExp),
      bronxExp: nyctData.bronxExp.concat(bcData.bronxExp),
      brooklynExp: nyctData.brooklynExp.concat(bcData.brooklynExp),
      statenislandExp: nyctData.statenislandExp.concat(bcData.statenislandExp),
      shuttles: nyctData.shuttles.concat(bcData.shuttles)
    };


    Object.keys(combinedData).forEach(key => {
      combinedData[key].sort((a: { shortName: string }, b: { shortName: string }) => {
        // Extract the numerical part of shortName for comparison
        const numA = parseInt(a.shortName.replace(/\D/g, ''), 10);
        const numB = parseInt(b.shortName.replace(/\D/g, ''), 10);
        return numA - numB;
      });
    });
    return combinedData
  };

  useEffect(() => {
    const getBusRoutes = async () => {
      const allBusRoutes = await fetchBusRoutes();
      setBusRoutes(allBusRoutes);
    };
    getBusRoutes();
  }, []);

  const fetchBusStopsData = async (route: string) => {
    try {
      const response = await axios.get(`http://localhost:9998/bus-stops/${encodeURIComponent(route)}`);
      if (response.data) {
        setBusStops(response.data);
      } else {
        console.error(`Empty response received for route: ${route}`);
        setBusStops(null); // Reset busStops to null on empty response
      }
    } catch (error) {
      console.error('Error fetching bus stops data:', error);
      setBusStops(null); // Reset busStops to null on error
    }
  };

  useEffect(() => {
    if (selectedRoute) {
      fetchBusStopsData(selectedRoute); // Fetch bus stops data when the selected route changes
    } else {
      setBusStops(null); // Reset busStops to null when no route is selected
    }
  }, [selectedRoute]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:9998/bus?stopId=${encodeURIComponent(stopId)}`);
      setBackendData(response.data);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Fetch data every 30 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [stopId]);

  function extractSixDigitNumber(inputString: string) {
    // Match any sequence of 6 digits
    const regex = /\d{6}/;
    // Extract the first match (assuming there's only one 6-digit number)
    const match = inputString.match(regex);
    // Return the matched number or null if no match found
    return match ? match[0] : null;
  }

  const calculateTimeDiff = (expectedArrival: Date, aimedArrival: Date): number => {
    return Math.round((expectedArrival.getTime() - aimedArrival.getTime()) / (1000 * 60));
  };

  async function getData(data: any): Promise<Bus[]> {
    const formattedData: Bus[] = [];
    const currentTime = Date.now();

    data.forEach((item: any) => {
      const expectedArrivalTime = new Date(item.ExpectedArrivalTime).getTime();
      const timeAwayInMinutes = Math.ceil((expectedArrivalTime - currentTime) / (1000 * 60));
      const timeAway = isNaN(timeAwayInMinutes) ? "Scheduled At Terminal" : `${timeAwayInMinutes} Minutes Away`;
      formattedData.push({
        id: item.VehicleRef,
        route: item.PublishedLineName,
        destination: item.DestinationName,
        vehicle: item.VehicleNumber,
        stroller: item.StrollerVehicle == true ? "Yes" : "No",
        presentableDistance: item.PresentableDistance,
        timeAway: timeAway,
        other: {
          stopsAway: item.StopsFromCall,
          expectedArrival: new Date(item.ExpectedArrivalTime),
          aimedArrival: new Date(item.AimedArrivalTime),
          timeDiff: calculateTimeDiff(new Date(item.ExpectedArrivalTime), new Date(item.AimedArrivalTime)),
          passengerCount: item.EstimatedPassengerCount ?? 0,
          maxCapacity: item.EstimatedPassengerCapacity ?? 0,
          stroller: item.StrollerVehicle == true ? "Yes" : "No"
        }
      })
    })
    return formattedData
  }

  useEffect(() => {
    const fetchData = async () => {
      if (backendData && backendData.MonitoredStopVisit) {
        const result = await getData(backendData.MonitoredStopVisit);
        setData(result);
      }
    };
    fetchData();
  }, [backendData]);

  return (

    <div className="container mx-auto py-10 flex gap-x-8 overflow-auto">
      <div className="w-3/12">

        <div className="grid grid-rows-3 gap-2">
          <h2 className="text-2xl font-bold text-center tracking-tight underline"> MTA Bus Tracker </h2>

          <Select onValueChange={setSelectedBorough}>
            <SelectTrigger className="w-auto">
              <SelectValue placeholder="Select Borough" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manhattanReg">[REGULAR] MANHATTAN</SelectItem>
              <SelectItem value="bronxReg">[REGULAR] THE BRONX</SelectItem>
              <SelectItem value="brooklynReg">[REGULAR] BROOKLYN</SelectItem>
              <SelectItem value="queensReg">[REGULAR] QUEENS</SelectItem>
              <SelectItem value="statenislandReg">[REGULAR] STATEN ISLAND</SelectItem>
              <SelectItem value="xExp">[EXPRESS] CITY WIDE</SelectItem>
              <SelectItem value="bronxExp">[EXPRESS] THE BRONX</SelectItem>
              <SelectItem value="brooklynExp">[EXPRESS] BROOKLYN</SelectItem>
              <SelectItem value="queensExp">[EXPRESS] QUEENS</SelectItem>
              <SelectItem value="statenislandExp">[EXPRESS] STATEN ISLAND</SelectItem>
              <SelectItem value="shuttles">[SUBWAY] SHUTTLES</SelectItem>
            </SelectContent>
          </Select>

          <div className="grid grid-cols-2 gap-2">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-auto justify-between"
                  disabled={!selectedBorough}
                >
                  {selectedRoute
                    ? routesByBoro.find((route) => route.id === selectedRoute)?.shortName
                    : "Select Route..."}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search Route..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>No routes found.</CommandEmpty>
                    <CommandGroup>
                      {routesByBoro.map((route) => (
                        <CommandItem
                          key={route.id}
                          value={route.id}
                          onSelect={(currentValue) => {
                            setSelectedRoute(currentValue === selectedRoute ? "" : currentValue)
                            setOpen(false)
                          }}
                        >
                          {route.shortName}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <Button onClick={fetchData}>Refresh</Button>
          </div>
        </div>

        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>{busStops && busStops.zeroDirDest ? busStops.zeroDirDest : "Northbound"}</AccordionTrigger>
            <AccordionContent>
              <ScrollArea className="h-64 w-68 rounded-md border">
                <div className="p-4">
                  <h4 className="mb-4 text-sm font-medium leading-none">Stops</h4>
                  {busStops && busStops.zeroDirStopsData
                    ? busStops.zeroDirStopsData.map((stop) => (
                      <React.Fragment key={stop.id}>
                        <div
                          className="text-sm cursor-pointer"
                          onClick={() => {
                            const extractedId = extractSixDigitNumber(stop.id);
                            if (extractedId) {
                              setStopId(extractedId);
                              setSelectedStopName(stop.name)
                            }
                          }}
                        >
                          {stop.name}
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
            <AccordionTrigger>{busStops && busStops.oneDirDest ? busStops.oneDirDest : "Southbound"}</AccordionTrigger>
            <AccordionContent>
              <ScrollArea className="h-64 w-68 rounded-md border">
                <div className="p-4">
                  <h4 className="mb-4 text-sm font-medium leading-none">Stops</h4>
                  {busStops && busStops.oneDirStopsData
                    ? busStops.oneDirStopsData.map((stop) => (
                      <React.Fragment key={stop.id}>
                        <div
                          className="text-sm cursor-pointer"
                          onClick={() => {
                            const extractedId = extractSixDigitNumber(stop.id);
                            if (extractedId) {
                              setStopId(extractedId);
                              setSelectedStopName(stop.name)
                            }
                          }}

                        >
                          {stop.name}
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



      <div className="w-9/12 overflow-scroll">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Stop: {selectedStopName}!</h2>
          <p className="text-muted-foreground">
            Stop ID: {stopId}
          </p>
        </div>
        <DataTable columns={columns} data={data} />


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

            {busStops && busStops.zeroDirStopsData ? (
              <BusMap stops={busStops.zeroDirStopsData} />
            ) : (
              <p>No map data available.</p>
            )}
          </TabsContent>

          <TabsContent value="southbound">
            <h1 className="text-xl font-bold flex justify-center">
              {busStops && busStops.oneDirDest ? "To " + busStops.oneDirDest : ""}
            </h1>

            {busStops && busStops.oneDirStopsData ? (
              <BusMap stops={busStops.oneDirStopsData} />
            ) : (
              <p>No map data available.</p>
            )}
          </TabsContent>
        </Tabs>
      </div>



    </div>
  )
};

export default MtaBusPage;
