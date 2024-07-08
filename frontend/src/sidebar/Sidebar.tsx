import { MoreVertical, ChevronLast, ChevronFirst } from "lucide-react";
import { createContext, useState } from "react";
import { LayoutDashboard, Settings } from "lucide-react";
import { SquareM, TramFront, BusFront, Bus } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
export const SidebarContext = createContext({ expanded: true });
import {
  Link,
  useLocation,
} from "react-router-dom";
import SidebarItem from "./SidebarItem";
import Logout from '../pages/Logout';

const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const isSettingsActive = () => {
    const paths = [
      "/settings",
      "/settings/profile",
      "/settings/account",
      "/settings/appearance",
      "/settings/notifications",
      "/settings/transit-systems",
    ];
    return paths.some((path) => isActive(path));
  };

  return (
    <nav className="h-full flex flex-col bg-card border-r shadow-sm text-lg">
      <div className="p-4 pb-2 flex justify-between items-center ">
        <div
          className={`font-bold text-3xl overflow-hidden transition-all ${expanded ? "w-40" : "w-0"
            }`}
        >
          GoUSA
        </div>
        <button
          onClick={() => setExpanded((curr) => !curr)}
          className="p-1.5 rounded-lg  hover:bg-gray-300 bg-gray-200 dark:bg-gray-200 text-foreground"
        >
          {expanded ? <ChevronFirst /> : <ChevronLast />}
        </button>
      </div>

      <SidebarContext.Provider value={{ expanded }}>
        <ul className="flex-1 px-3 text-nowrap">
          <Link to="/">
            <SidebarItem
              icon={<LayoutDashboard />}
              text="Home"
              active={isActive("/")}
              alert={false}
            />
          </Link>
          <Link to="/mta-bus">
            <SidebarItem
              icon={<BusFront />}
              text="MTA Bus"
              active={isActive("/mta-bus")}
              alert={false}
            />
          </Link>
          <Link to="/mta-subway">
            <SidebarItem
              icon={<TramFront />}
              text="MTA Subway"
              active={isActive("/mta-subway")}
              alert={false}
            />
          </Link>
          <Link to="/wmata-bus">
            <SidebarItem
              icon={<Bus />}
              text="WMATA Bus"
              active={isActive("/wmata-bus")}
              alert={false}
            />
          </Link>
          <Link to="/wmata-metro">
            <SidebarItem
              icon={<SquareM />}
              text="WMATA Metro"
              active={isActive("/wmata-metro")}
              alert={false}
            />
          </Link>
          <Link to="/settings/profile">
            <SidebarItem
              icon={<Settings />}
              text="Settings"
              active={isSettingsActive()}
              alert={false}
            />
          </Link>
        </ul>
        <Logout />
      </SidebarContext.Provider>

      <div className="border-t flex p-3">
        {/* <img
          src="https://ui-avatars.com/api/?background=CBC3E3&name=Transit-Time"
          alt=""
          className="w-10 h-10 rounded-md"
        /> */}
        <ModeToggle />
        <div
          className={`
                flex justify-between items-center 
                overflow-hidden transition-all ${expanded ? "w-32 ml-3" : "w-0"}
            `}
        >
          <div className="leading-4">
            <h4 className="font-semibold">Steven Tung</h4>
            <span className="text-xs text-gray-600"></span>
          </div>
          <MoreVertical size={20} />
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;