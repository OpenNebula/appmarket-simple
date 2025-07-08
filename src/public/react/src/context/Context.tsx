import { Appliance } from "@/interfaces/Appliances";
import { createContext, useContext, useState, useEffect } from "react";
import { DateRange } from "@mui/x-date-pickers-pro";
import { Dayjs } from "dayjs";
import {
  CheckboxFilters,
  CheckboxProviderProps,
  ContextType,
  FilterCheckbox,
} from "./interfaces";

// @ts-ignore
import config from "@config";

const Context = createContext<ContextType | null>(null);

const filtersDictionary = {
  Hypervisors: { name: "hypervisor", type: "checkbox" },
  "OpenNebula Versions": { name: "opennebula_version", type: "checkbox" },
  Versions: { name: "version", type: "checkbox" },
  "OS Systems": { name: "os-id", type: "checkbox" },
  Tags: { name: "tags", type: "checkbox" },
  DateInterval: { name: "tags", type: "date" },
};

export const CheckboxProvider = ({ children }: CheckboxProviderProps) => {
  let filters = {};

  Object.entries(config.filters).map(([filterName, isFilterActive]) => {
    if (isFilterActive && filterName !== "Date Interval") {
      filters = { ...filters, [filterName]: [] };
    } else if (isFilterActive && filterName === "Date Interval") {
      filters = { ...filters, [filterName]: [null, null] };
    }
  });

  const [appliances, setAppliances] = useState<Appliance[] | undefined>(
    undefined,
  );
  const [contextFilters, setContextFilters] =
    useState<CheckboxFilters>(filters);

  const loadFilters = (
    filter: keyof CheckboxFilters,
  ): Map<string, FilterCheckbox> => {
    const filterMap = new Map<string, FilterCheckbox>();

    appliances?.forEach((appliance: Appliance) => {
      if (filter === "Date Interval") return;

      const key: keyof Appliance = filtersDictionary[filter].name;
      let filterValues;

      if (key === "opennebula_version") {
        filterValues = appliance[key]?.split(",");
      } else {
        filterValues = appliance[key];
      }

      if (Array.isArray(filterValues)) {
        filterValues.forEach((filter) => {
          if (!filterMap.has(filter.trim())) {
            filterMap.set(filter.trim(), {
              name: filter.trim(),
              totalCount: 1,
              value: false,
            });
          } else {
            const editMapCount = filterMap.get(filter.trim());
            if (editMapCount) editMapCount.totalCount += 1;
          }
        });
      } else if (typeof filterValues === "string") {
        if (!filterMap.has(filterValues)) {
          filterMap.set(filterValues, {
            name: filterValues,
            totalCount: 1,
            value: false,
          });
        } else {
          const editMapCount = filterMap.get(filterValues);
          if (editMapCount) editMapCount.totalCount += 1;
        }
      }
    });
    return filterMap;
  };

  useEffect(() => {
    fetch('/appliance', {
        method: 'GET', // Or 'POST' if you're sending data
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      })
    .then(res => {
      res.json().then((data) => {
        setAppliances(data.appliances);
      });
    })
  }, [])

  useEffect(() => {
    Object.entries(config.filters).map(([key, value]) => {
      if (value && key !== "Date Interval") {
        const mapFilters = loadFilters(key as keyof CheckboxFilters);
        setContextFilters((prev) => ({
          ...prev,
          [key]: Array.from(mapFilters.values()).sort((a, b) =>
            a.name.localeCompare(b.name),
          ),
        }));
      }
    });
  }, [appliances]);

  const toggleCheckbox = (group: keyof CheckboxFilters, name: string) => {
    setContextFilters((prevState) => ({
      ...prevState,
      [group]: Array.isArray(prevState[group])
        ? (prevState[group] as FilterCheckbox[]).map((item) =>
            item.name === name ? { ...item, value: !item.value } : item,
          )
        : prevState[group],
    }));
  };

  const setDateInterval = (date: DateRange<Dayjs>) => {
    setContextFilters((prevState) => ({
      ...prevState,
      "Date Interval": date,
    }));
  };

  const values = {
    appliances,
    contextFilters,
    setDateInterval,
    toggleCheckbox,
  };

  return <Context.Provider value={values}>{children}</Context.Provider>;
};

// Hook para acceder al contexto
export const useAppContext = (): ContextType => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useAppContext must be used within a CheckboxProvider");
  }
  return context;
};
