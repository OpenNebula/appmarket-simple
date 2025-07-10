import { Appliance } from "@/interfaces/Appliances";
import { useState, useEffect, useCallback } from "react";
import { DateRange } from "@mui/x-date-pickers-pro";
import { Dayjs } from "dayjs";
import {
  CheckboxFilters,
  CheckboxProviderProps,
  FilterCheckbox,
} from "./interfaces";
import { filtersDictionary } from "@/context/filterUtils";
import { AppContext } from "@/context/AppContext";

import config from "@config";

export const CheckboxProvider = ({ children }: CheckboxProviderProps) => {

  let filters = {};

  const [appliances, setAppliances] = useState<Appliance[] | undefined>(
    undefined,
  );
  const [contextFilters, setContextFilters] =
    useState<CheckboxFilters>(filters);

  Object.entries(config.filters).map(([filterName, isFilterActive]) => {
    if (isFilterActive && filterName !== "Date Interval") {
      filters = { ...filters, [filterName]: [] };
    } else if (isFilterActive && filterName === "Date Interval") {
      filters = { ...filters, [filterName]: [null, null] };
    }
  });

  /**
   * Load the appliance from the API
   */
  useEffect(() => {
    fetch('/appliance', {
        method: 'GET',
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

  /**
   * Load data from appliances to use in the filters
   */
  const loadFilters = useCallback(
    (filter: keyof CheckboxFilters): Map<string, FilterCheckbox> => {
      const filterMap = new Map<string, FilterCheckbox>();

      appliances?.forEach((appliance: Appliance) => {

        // Date interval no load data from appliances
        if (filter === "Date Interval") return;
        
        const key: keyof Appliance = filtersDictionary[filter].name;
        let filterValues;

        // Filter for OpenNebula versions
        if (key === "opennebula_version") {
          filterValues = appliance[key]?.split(",");
        } else {
          filterValues = appliance[key];
        }

        if (Array.isArray(filterValues)) {
          filterValues.forEach((filter) => {
            const trimmed = filter.trim();
            if (!filterMap.has(trimmed)) {
              filterMap.set(trimmed, {
                name: trimmed,
                totalCount: 1,
                value: false,
              });
            } else {
              const item = filterMap.get(trimmed);
              if (item) item.totalCount += 1;
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
            const item = filterMap.get(filterValues);
            if (item) item.totalCount += 1;
          }
        }
      });

      return filterMap;
    },
    [appliances]
  );


  /**
   * Create filters with the data from the appliances
   */
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
  }, [appliances, loadFilters]);

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

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};