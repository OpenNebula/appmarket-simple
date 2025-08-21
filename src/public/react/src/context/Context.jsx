
import { useState, useEffect, useCallback } from "react";

import { filtersDictionary } from "@/context/filterUtils";
import { AppContext } from "@/context/AppContext";

import config from "@config";

export const CheckboxProvider = ({ children }) => {

  let filters = {};

  const [appliances, setAppliances] = useState(
    undefined,
  );
  const [contextFilters, setContextFilters] =
    useState(filters);

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
    (filter) => {
      const filterMap = new Map();

      appliances?.forEach((appliance) => {

        // Date interval no load data from appliances
        if (filter === "Date Interval") return;
        
        const key = filtersDictionary[filter].name;
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
        const mapFilters = loadFilters(key);
        setContextFilters((prev) => ({
          ...prev,
          [key]: Array.from(mapFilters.values()).sort((a, b) =>
            a.name.localeCompare(b.name),
          ),
        }));
      }
    });
  }, [appliances, loadFilters]);

  const toggleCheckbox = (group, name) => {
    setContextFilters((prevState) => ({
      ...prevState,
      [group]: Array.isArray(prevState[group])
        ? (prevState[group]).map((item) =>
            item.name === name ? { ...item, value: !item.value } : item,
          )
        : prevState[group],
    }));
  };

  const setDateInterval = (date) => {
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