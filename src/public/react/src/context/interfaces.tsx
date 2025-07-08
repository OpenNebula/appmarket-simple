import { Appliance } from "@/interfaces/Appliances";
import { DateRange } from "@mui/x-date-pickers-pro";
import { Dayjs } from "dayjs";
import { ReactNode } from "react";

export type FilterCheckbox = {
  name: string;
  totalCount: number;
  value: boolean;
};

export interface CheckboxFilters {
  Hypervisors?: FilterCheckbox[];
  "OpenNebula Versions"?: FilterCheckbox[];
  Versions?: FilterCheckbox[];
  "OS Systems"?: FilterCheckbox[];
  Tags?: FilterCheckbox[];
  "Date Interval"?: DateRange<Dayjs>;
}

export interface CheckboxProviderProps {
  children: ReactNode;
}

export interface ContextType {
  appliances?: Appliance[];
  contextFilters: CheckboxFilters;
  setDateInterval: (date: DateRange<Dayjs>) => void;
  toggleCheckbox: (group: keyof CheckboxFilters, name: string) => void;
}
