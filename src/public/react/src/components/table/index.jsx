// React
import { useState } from "react"

// Material
import { Stack, Box, Typography } from "@mui/material"
import { useTheme } from "@mui/material/styles"

// Marketplace components
import TableList from "@/components/table/list"
import TableCard from "@/components/table/card"
import TableFooter from "@/components/table/footer"

// Component styles
import styles from "@/components/table/styles"

/**
 * Component to display the table of appliances in the main layout. The table will have card and list view.
 * @param {Array} - List of appliances.
 * @returns {JSX.Element} The rendered Table component.
 */
const Table = ({ appliances, view }) => {
  // Get styles for the component
  const theme = useTheme()
  const tableStyles = styles(theme)

  // Pagination state
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // Paginate appliances
  const paginatedAppliances = appliances.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage,
  )

  return (
    <>
      {appliances?.length === 0 ? (
        <Typography>No appliances found</Typography>
      ) : (
        <Stack direction="column" sx={{ marginBottom: "40px" }}>
          <Box className={tableStyles.pageSelector}>
            <TableFooter
              count={appliances.length}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={setPage}
              onRowsPerPageChange={(newSize) => {
                setRowsPerPage(newSize)
                setPage(0)
              }}
            />
          </Box>
          {view === "list" ? (
            <TableList appliances={paginatedAppliances} />
          ) : (
            <TableCard appliances={paginatedAppliances} />
          )}
        </Stack>
      )}
    </>
  )
}

export default Table
