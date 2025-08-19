// MUI imports
import { Stack, IconButton, Typography, Select, MenuItem } from "@mui/material"

// Icons
import { NavArrowLeft, NavArrowRight, NavArrowDown } from 'iconoir-react'

// Card styles
import styles from '@/components/table/footer/styles'
import { useTheme } from '@mui/material/styles';


/**
 * Render the footer table.
 * @param {Array} - List of appliances.
 * @returns {JSX.Element} The rendered TableList component.
 */
const TableFooter = ({ count, page, rowsPerPage, onPageChange, onRowsPerPageChange }) => {

  // Get styles for the component
  const theme = useTheme();
  const footerStyles = styles(theme)

  // Calculate total of pages
  const totalPages = Math.ceil(count / rowsPerPage)

  // Handle go to the previous page
  const handleBack = () => {
    if (page > 0) onPageChange(page - 1)
  }

  // Handle go to the next page
  const handleNext = () => {
    if (page < totalPages - 1) onPageChange(page + 1)
  }

  // Use Nav Arrow Down instead the default one
  const CustomArrowIcon = (props) => (
    <NavArrowDown
      {...props}
      style={{
        position: "absolute",
        right: 8,
        top: "50%",
        transform: "translateY(-50%)",
        pointerEvents: "none",
      }}
    />
  )

  return (
    <Stack direction="row" justifyContent="center" alignItems="center" className={footerStyles.footerContainer}>
    
      <Stack direction="row" alignItems="center">

        <IconButton onClick={handleBack} disabled={page === 0} className={footerStyles.footerIcons}>
          <NavArrowLeft />
        </IconButton>
        <Typography className={footerStyles.pagesText}>{`${page + 1} of ${totalPages} pages`}</Typography>
        <IconButton onClick={handleNext} disabled={page >= totalPages - 1} className={footerStyles.footerIcons}>
          <NavArrowRight />
        </IconButton>
        
      </Stack>

      <Stack direction="row" alignItems="center" sx={{ gap: '8px' }}>
        
        <Typography className={footerStyles.resultsText}>Results per page</Typography>
        <Select
          value={rowsPerPage}
          onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
          size="small"
          IconComponent={CustomArrowIcon}
          className={footerStyles.sizePageText}
        >
          {[5, 10, 25, 50].map((num) => (
            <MenuItem key={num} value={num}>{num}</MenuItem>
          ))}
        </Select>
        
      </Stack>

    </Stack>
  )
}

export default TableFooter