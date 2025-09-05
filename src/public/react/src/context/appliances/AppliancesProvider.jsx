// React imports
import { useState, useMemo } from "react"

// Import context
import { AppliancesContext } from "@/context/appliances/AppliancesContext"

// Utilities
import _ from "lodash"
import dayjs from "dayjs"

/**
 *
 * Provides a context that stores the appliances.
 *
 * Wrap your app with this provider to enable access or filter the appliances.
 *
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The part of the React component tree that should have access to the appliances context.
 * @returns {JSX.Element} The provider component that wraps its children with appliances.
 */
export const AppliancesProvider = ({ children, appliances }) => {
  // States for filters
  const [filters, setFilters] = useState({})
  const [sortKey, setSortKey] = useState(null)
  const [sortOrder, setSortOrder] = useState("asc")

  // Filter and sort appliances using Lodash
  const filteredAppliances = useMemo(() => {
    let result = _.cloneDeep(appliances)

    // Apply filters
    Object.keys(filters).forEach((key) => {
      // Get filter values
      const filterValue = filters[key]

      // Skip falsy filters (null/undefined) and empty arrays
      if (
        filterValue == null ||
        (Array.isArray(filterValue) && filterValue.length === 0)
      ) {
        return
      }

      // Date range object
      if (
        typeof filterValue === "object" &&
        !Array.isArray(filterValue) &&
        ("start" in filterValue || "end" in filterValue)
      ) {
        const startUnix = filterValue.start
          ? dayjs(filterValue.start).startOf("day").unix()
          : null
        const endUnix = filterValue.end
          ? dayjs(filterValue.end).endOf("day").unix()
          : null

        result = _.filter(result, (item) => {
          const ts = Number(item[key])
          if (!Number.isFinite(ts)) return false
          if (startUnix != null && ts < startUnix) return false
          if (endUnix != null && ts > endUnix) return false
          return true
        })

        return
      }

      // Array of strings (multi-select)
      if (Array.isArray(filterValue)) {
        result = _.filter(result, (item) => {
          const itemVal = _.toLower(String(item[key] ?? ""))
          return filterValue.some((val) =>
            itemVal.includes(_.toLower(String(val))),
          )
        })
        return
      }

      // Single string
      const f = _.toLower(String(filterValue))
      result = _.filter(result, (item) =>
        _.toLower(String(item[key] ?? "")).includes(f),
      )
    })

    // Apply sorting
    if (sortKey) {
      result = _.orderBy(
        result,
        [
          (item) => {
            const value = item[sortKey]
            // Only transform if it's a string
            return typeof value === "string" ? value.toLowerCase() : value
          },
        ],
        [sortOrder],
      )
    }

    return result
  }, [appliances, filters, sortKey, sortOrder])

  // Functions to set and clear fiter
  const setFilter = (key, value) =>
    setFilters((prev) => ({
      ...prev,
      [key]: value, // can be array|string|{start,end}|null
    }))

  const clearFilter = (key) =>
    setFilters((prev) => {
      const copy = { ...prev }
      delete copy[key]
      return copy
    })

  // Set sorting
  const setSorting = (key, order = "asc") => {
    setSortKey(key)
    setSortOrder(order)
  }

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
  )
}
