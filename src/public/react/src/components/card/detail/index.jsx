// React imports
import { useMemo } from 'react'

// MUI components
import {
  Box,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
  Tooltip,
  Card,
  CardContent,
  Typography,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
} from "@mui/material";

// Card styles
import styles from '@/components/card/detail/styles'
import clsx from 'clsx'
import { useTheme } from '@mui/material/styles';

// Marketplace components
import Tags from '@/components/tags'

// Import icons
import {
  Download as DownloadIcon,
  Copy as CopyIcon,
} from 'iconoir-react'

// Utilities
import Markdown from 'react-markdown'
import { split } from 'lodash'

/**
 * Render the appliance details.
 * @param {object} - Appliance to render. 
 * @returns {JSX.Element} The rendered ApplianceDetails component.
 */
const ApplianceDetails = ({ appliance, handleDownload, handleCopyTemplate }) => {

  // Get styles for the component
  const theme = useTheme();
  const detailsStyles = styles(theme)

  // Transform opennebula_version string into array
  const opennebulaVersions = useMemo(
    () => split(appliance?.opennebula_version || "", ",").filter(Boolean),
    [appliance?.opennebula_version]
  )

  // Transform hypervisors string into array
  const hypervisor = useMemo(
    () => split(appliance?.hypervisor || "", ",").filter(Boolean),
    [appliance?.hypervisor]
  ) 

  return (
    <Stack direction='column' sx={{ gap: '16px' }}>
      <Stack direction='row' sx={{ gap: '16px' }}>
        <Stack direction='column' sx={{ gap: '7px', flexGrow: 1 }} className={detailsStyles.containerDetails1}>
          <Stack direction="row" sx={{ gap: '15px' }}>
            <Box
              component='img'
              src={appliance.logo ? `/logos/${appliance.logo}` : '/assets/logo-appliance.svg'}                
              className={detailsStyles.logoAppliance}
            />
            <Stack direction='column' sx={{ gap: '4px'}}>
              <Typography variant='h5' className={detailsStyles.applianceTitle}>{appliance.name}</Typography>            
              <Markdown
                components={{
                  p: ({node, ...props}) => (
                    <Typography className={detailsStyles.applianceDescription} {...props}/>
                  ),
                  a: ({node, ...props}) => (
                    <a className={detailsStyles.applianceRef} {...props}/>
                  ),
                }}
              >
                {appliance.description}
              </Markdown>
            </Stack>
          </Stack>
          <Stack direction="column" sx={{ gap: '4px'}}>
            <Stack direction="row" justifyContent="space-between" className={detailsStyles.applianceAttributes}>
              <Typography className={detailsStyles.applianceAttributesTitle}>Tags</Typography>
              <Tags tags={appliance?.tags} hideOverflow={false}></Tags>
            </Stack>
            <Stack direction="row" justifyContent="space-between" className={detailsStyles.applianceAttributes}>
              <Typography className={detailsStyles.applianceAttributesTitle}>Hypervisors</Typography>
              <Tags tags={hypervisor} hideOverflow={false}></Tags>
            </Stack>
            <Stack direction="row" justifyContent="space-between" className={detailsStyles.applianceAttributes}>
              <Typography className={detailsStyles.applianceAttributesTitle}>Publisher</Typography>
              <Typography className={detailsStyles.applianceAttributesText}>{appliance?.publisher}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" className={detailsStyles.applianceAttributes}>
              <Typography className={detailsStyles.applianceAttributesTitle}>Appliance Version</Typography>
              <Typography className={detailsStyles.applianceAttributesText}>{appliance?.version}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" className={detailsStyles.applianceAttributes}>
              <Typography className={detailsStyles.applianceAttributesTitle}>Compatible Releases</Typography>
              <Tags tags={opennebulaVersions} hideOverflow={false}></Tags>
            </Stack>                                                
          </Stack>
        </Stack>
        <Stack direction='column' justifyContent='space-between' className={detailsStyles.containerDetails2}>
          <Stack direction='column' justifyContent='space-between' sx={{ gap: '11px' }}>
            <Typography className={detailsStyles.otherAttributeTitle}>FORMAT</Typography>
            <Typography className={detailsStyles.otherAttributeText}>{appliance?.format ? appliance.format : '-'}</Typography>
          </Stack>
          <Stack direction='column' justifyContent='space-between' sx={{ gap: '11px' }}>
            <Typography className={detailsStyles.otherAttributeTitle}>OS</Typography>
            <Typography className={detailsStyles.otherAttributeText}>{appliance?.['os-id']}</Typography>
          </Stack>
          <Stack direction='column' justifyContent='space-between' sx={{ gap: '11px' }}>
            <Typography className={detailsStyles.otherAttributeTitle}>OS Release</Typography>
            <Typography className={detailsStyles.otherAttributeText}>{appliance?.['os-release']}</Typography>
          </Stack>
          <Stack direction='column' justifyContent='space-between' sx={{ gap: '11px' }}>
            <Typography className={detailsStyles.otherAttributeTitle}>OS arch</Typography>
            <Typography className={detailsStyles.otherAttributeText}>{appliance?.['os-arch']}</Typography>
          </Stack>                                        
        </Stack>
      </Stack>
      <Stack direction='row' justifyContent='flex-end' sx={{ gap: '16px' }}>
        <Button variant="contained" endIcon={<DownloadIcon />} className={detailsStyles.filterButton} onClick={handleDownload}>        
          Download
        </Button>
        <Button variant="contained" endIcon={<CopyIcon />} className={detailsStyles.filterButton} onClick={handleCopyTemplate}>
          Copy Template
        </Button>        
      </Stack>
    </Stack>
  )
}

export default ApplianceDetails