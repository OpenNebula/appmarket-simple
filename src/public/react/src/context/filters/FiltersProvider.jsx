// React imports
import { useState, useCallback, useEffect } from "react"

// Import context
import { FiltersContext } from '@/context/filters/FiltersContext'

// Marketplace configuration
import config from "@config"

// Utilities
import { countBy, flatMap, uniq } from 'lodash'

/**
 * 
 * Provides a context to store the filters and its values.
 * 
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The part of the React component tree that should have access to the filters context.
 * @returns {JSX.Element} The provider component that wraps its children with filters context.
 */
export const FiltersProvider = ({ children, appliances }) => {

  // Store the defined filter with their possible values
  const [filters, setFilters] = useState();

  // Store the elected filters and their values
  const [selectedFilters, setSelectedFilters] = useState({})

  // Modify the value selected in a specific filter
  const setFilterValue = (key, values) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [key]: values,
    }))
  }

  // Create an array of the filters with their values
  useEffect(() => {

    // Exit if not appliances
    if (!appliances || appliances.length === 0) return;

    // Create filters with values
    const generatedFilters = config.filters.map((filter) => {
      
      // Collect all values
      const allValues = filter.type === 'date' ? undefined : flatMap(appliances, (appliance) => {

        // Get value for the key in that appliance
        const val = appliance[filter.key]

        // Exit if not value
        if (!val) return []        

        // Return array with the values
        return Array.isArray(val)
          ? val.map((v) => v.trim())
          : val.split?.(",").map((v) => v.trim()) || [val.trim()];
      })

      // Return filter object
      return {
        key: filter.key,
        label: filter.label,
        type: filter.type,
        values: filter.type !== 'date' && uniq(allValues),
        total: countBy(allValues),
      };
    });

    // Modify filters
    setFilters(generatedFilters);

  }, [appliances]);





  return (
    <FiltersContext.Provider value={{ filters, selectedFilters, setFilterValue }}>
      {children}
    </FiltersContext.Provider>
  );
};