import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Appliance } from "@/interfaces/Appliances";
import { Box, IconButton, Tooltip } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Link } from "react-router-dom";
import { useState } from "react";
import { parseToOpenNebulaFormat } from "@/utils/parser";

export interface AppliancesTableInterface {
  appliancesFiltered: Appliance[] | undefined;
}

const createData = (
  name: string | undefined,
  hypervisor: string | undefined,
  short_description: string | undefined,
  os_id: string | undefined,
  version: string | undefined,
  button: unknown,
) => {
  return { name, hypervisor, short_description, os_id, version, button };
};

const AppliancesTable = ({ appliancesFiltered }: AppliancesTableInterface) => {
  const [copyTooltip, setCopyTooltip] = useState<string>("Copy template");

  const handleCopiedTooltip = () => {
    setCopyTooltip("Copied");

    setTimeout(() => {
      setCopyTooltip("Copy template");
    }, 1000);
  };

  const rows = appliancesFiltered?.map((appliance) => {
    const download: string =
      typeof appliance.links?.download.href === "string"
        ? appliance.links?.download.href
        : "";

    const button = () => (
      <Box sx={{ display: "flex", gap: 1 }}>
        <Tooltip title={copyTooltip}>
          <IconButton
            color="info"
            aria-label="delete"
            size="small"
            onClick={() => {
              handleCopiedTooltip();
              if (appliance.opennebula_template) 
                navigator.clipboard.writeText(
                    parseToOpenNebulaFormat(
                      JSON.parse(appliance.opennebula_template),
                    ),
                  );
            }}
          >
            <ContentCopyIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Download">
          <IconButton
            color="info"
            aria-label="delete"
            size="small"
            onClick={() => window.open(download, "_self")}
          >
            <FileDownloadIcon />
          </IconButton>
        </Tooltip>

        <IconButton
          sx={{ ml: "auto" }}
          color="secondary"
          aria-label="delete"
          size="small"
          component={Link}
          to={`/detail/${appliance._id.$oid}`}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>
    );

    return createData(
      appliance.name,
      appliance.hypervisor,
      appliance.short_description,
      appliance["os-id"],
      appliance.version,
      button,
    );
  });
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Hypervisor</TableCell>
            <TableCell>Short description</TableCell>
            <TableCell>OS</TableCell>
            <TableCell>Version</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows?.map((row: unknown) => (
            <TableRow
              key={row.name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell>{row.hypervisor}</TableCell>
              <TableCell>{row.short_description}</TableCell>
              <TableCell>{row.os_id}</TableCell>
              <TableCell>{row.version}</TableCell>
              <TableCell>{row.button()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AppliancesTable;
