// MUI imports
import { 
  Button, 
  Typography,
} from '@mui/material'

// Context imports
import { useDrawer } from '@/context/drawer/DrawerContext'

// Icons
import { FilterList } from 'iconoir-react'

/**
 * Component to show a button to open the filters menu.
 * @returns {JSX.Element} The rendered Filter component.
 */
const Filter = () => {

  // Get hook to open the drawer
  const { openDrawer } = useDrawer();

  return (
    <>
      <Button
        variant='outlined'
        onClick={() => openDrawer()}
        startIcon={<FilterList />}
      >
        <Typography>Filter</Typography>
      </Button>

    </>
  )
}

export default Filter;