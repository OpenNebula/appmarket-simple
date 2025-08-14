// React imports
import { useState } from "react";

// MUI components
import {
  Box,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
  Tooltip,
  Snackbar,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  IconButton,
} from "@mui/material";

// Icons
import { MoreVert, Download, Copy } from 'iconoir-react';

// Card styles
import styles from '@/components/card/styles'
import clsx from 'clsx'
import { useTheme } from '@mui/material/styles';

// Marketplace components
import Tags from '@/components/tags'

// Utilities
import { format } from 'date-fns';
import { parseToOpenNebulaFormat } from "@/utils/parser";
import { useSnackbar } from "@/context/SnackbarProvider";


/**
 * Render the appliance data in a card.
 * @param {object} - Appliance to render. 
 * @returns {JSX.Element} The rendered ApplianceCard component.
 */
const ApplianceCard = ({ appliance }) => {

  // Get styles for the component
  const theme = useTheme();
  const cardStyles = styles(theme)

  // Card menu controls
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClickMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // Hook to display message
  const { showMessage } = useSnackbar();

  // Fromat creation date  
  const creationDate = format(new Date(appliance?.creation_time * 1000), 'dd MMM yyyy');

  // Get the download link for the appliance
  const downloadLink = typeof appliance?.links?.download.href === "string" ? appliance?.links?.download.href : undefined;

  // Get template in OpenNebula format
  const openNebulaTemplate = parseToOpenNebulaFormat(JSON.parse(appliance?.opennebula_template))

  // Handle the download action
  const handleDownload = () => {

    // Open new tab and download
    window.open(downloadLink, "_blank"); 

    // Close menu
    handleCloseMenu();
  }


  // Handle the copy template action
  const handleCopyTemplate = () => {

    // Copy to clipboard
    navigator.clipboard.writeText(openNebulaTemplate)

    // Show copy message
    showMessage('Template copied to clipboard!')

    // Close menu
    handleCloseMenu();
  }

  return appliance ? (
    <Card>
      <CardContent>

        <Stack direction='column' useFlexGap spacing={'32px'}  divider={<Divider orientation="horizontal" flexItem />}>
          <Stack direction='column' useFlexGap spacing={'16px'}>
            <Stack direction='row' useFlexGap spacing={'15px'}>
              <Box
                component='img'
                src={appliance.logo ? `/logos/${appliance.logo}` : '/assets/logo-appliance.svg'}                
                className={cardStyles.imageContainer}
              />
              <Stack direction='column'>
                  <Typography className={clsx(cardStyles.textContainer, cardStyles.titleApp)}>{appliance.name}</Typography>
                  <Typography className={cardStyles.descriptionApp}>{appliance.short_description}</Typography>
              </Stack>
              <Box sx={{marginLeft: 'auto'}}>
                <IconButton         
                  aria-controls={open ? 'basic-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClickMenu}
                  className={cardStyles.menuIcon}
                >
                  <MoreVert />
                </IconButton>
                <Menu              
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleCloseMenu}
                  slotProps={{
                    list: {
                      'aria-labelledby': 'basic-button',
                    },
                  }}
                >
                  <Tooltip
                    title={downloadLink ? '' : 'No download available'}
                    disableInteractive
                  >
                    <span>  {/* Wrapping in span so Tooltip works when MenuItem is disabled */}
                      <MenuItem onClick={handleDownload} disabled={!downloadLink} className={cardStyles.menuOption}>
                        <ListItemIcon>
                          <Download/>
                        </ListItemIcon>
                        <Typography className={cardStyles.menuOptionText}>Download</Typography>
                      </MenuItem>
                    </span>
                  </Tooltip>
                  <MenuItem onClick={handleCopyTemplate} className={cardStyles.menuOption}>
                    <ListItemIcon>
                      <Copy/>
                    </ListItemIcon>
                    <Typography className={cardStyles.menuOptionText}>Copy Template</Typography>
                  </MenuItem>
                </Menu>
              </Box>
            </Stack>
            <Stack>
              <Tags tags={appliance?.tags}></Tags>
            </Stack>
          </Stack>

          <Stack direction='column' useFlexGap spacing={'8px'}>
            <Stack direction='row' sx={{ justifyContent: 'space-between' }}>
              <Typography className={cardStyles.attributesTitle}>HYPERVISOR</Typography>
              <Typography className={cardStyles.attributesValue}>{appliance?.hypervisor}</Typography>
            </Stack>
            <Stack direction='row' sx={{ justifyContent: 'space-between' }}>
              <Typography className={cardStyles.attributesTitle}>VERSION</Typography>
              <Typography className={cardStyles.attributesValue}>{appliance?.version}</Typography>
            </Stack>
            <Stack direction='row' sx={{ justifyContent: 'space-between' }}>
              <Typography className={cardStyles.attributesTitle}>CREATED</Typography>
              <Typography className={cardStyles.attributesValue}>{creationDate}</Typography>
            </Stack>
          </Stack>
        </Stack>

      </CardContent>
    </Card>
  ) : null;
}

export default ApplianceCard;
