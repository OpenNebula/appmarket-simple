// React imports
import { useState, useMemo } from 'react';

// Import context
import { AppliancesContext } from '@/context/appliances/AppliancesContext';

// Utilities
import _ from 'lodash';

/**
 * 
 * Provides a context that stores the appliances.
 *
 * Wrap your app with this provider to enable access or filter the appliances.
 * 
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The part of the React component tree that should have access to the snackbar context.
 * @returns {JSX.Element} The provider component that wraps its children with appliances.
 */
export const AppliancesProvider = ({ children, appliances }) => {

  // States for filters
  const [filters, setFilters] = useState({});
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  // Filter and sort appliances using Lodash
  const filteredAppliances = useMemo(() => {
    let result = _.cloneDeep(appliances);

    // Apply filters
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        result = _.filter(result, (item) =>
          _.includes(_.toLower(String(item[key])), _.toLower(String(filters[key])))
        );
      }
    });

    // Apply sorting
    if (sortKey) {
      result = _.orderBy(
        result, 
        [(item) => {
          const value = item[sortKey];
          // Only transform if it's a string
          return typeof value === 'string' ? value.toLowerCase() : value;
        }], 
        [sortOrder]);
    }

    return result;
  }, [appliances, filters, sortKey, sortOrder]);

  // Function to set and clear fiter
  const setFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));
  const clearFilter = (key) =>
    setFilters((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });

  // Set sorting
  const setSorting = (key, order = 'asc') => {
    setSortKey(key);
    setSortOrder(order);
  };

  return (
    <AppliancesContext.Provider
      value={{
        appliances: filteredAppliances,
        setFilter,
        clearFilter,
        setSorting,
        allAppliances: appliances,
      }}
    >
      {children}
    </AppliancesContext.Provider>
  );
};
