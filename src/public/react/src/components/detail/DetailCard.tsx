import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Appliance } from "@/interfaces/Appliances";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Linkify from "../linkify/Linkify";
import { IconButton, Tooltip } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useState } from "react";
import { parseToOpenNebulaFormat } from "@/utils/parser";

interface DetailCardProps {
  appliance: Appliance;
}

const DetailCard = ({ appliance }: DetailCardProps) => {
  const [copyTooltip, setCopyTooltip] = useState<string>("Copy template");

  const download: string =
    typeof appliance.links?.download.href === "string"
      ? appliance.links?.download.href
      : "";

  const handleCopiedTooltip = () => {
    setCopyTooltip("Copied");

    setTimeout(() => {
      setCopyTooltip("Copy template");
    }, 1000);
  };

  return (
    <Card
      sx={{
        position: "relative",
        minWidth: 275,
        mb: 5,
        display: "flex",
        gap: "50px",
        justifyContent: "center",
        alignItems: "start",
        p: 4,
        flexWrap: "wrap",
      }}
    >
      <img
        src={`/logos/${appliance.logo}`}
        style={{ height: "200px" }}
      ></img>

      <CardContent sx={{ flex: 1 }}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            mb: 4,
            columnGap: "150px",
            rowGap: 4,
          }}
        >
          <Box>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Hypervisors
            </Typography>
            <Stack direction="row" spacing={1}>
              <Chip label={appliance.hypervisor} />
            </Stack>
          </Box>

          <Box>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Tags
            </Typography>
            <Stack direction="row" spacing={1}>
              {appliance.tags?.map((tag) => {
                return <Chip label={tag} />;
              })}
            </Stack>
          </Box>
        </Box>

        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          Description
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          <Linkify text={appliance.description} />
        </Typography>

        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          Publisher
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          {appliance.publisher}
        </Typography>

        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          Version
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          {appliance.version}
        </Typography>

        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          OpenNebula versions
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          {appliance.opennebula_version}
        </Typography>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Format
            </Typography>
            <Typography variant="body1">{appliance.format}</Typography>
          </div>

          <div>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              OSid
            </Typography>
            <Typography variant="body1">{appliance["os-id"]}</Typography>
          </div>

          <div>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              OSrelease
            </Typography>
            <Typography variant="body1">{appliance["os-release"]}</Typography>
          </div>

          <div>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              OSarch
            </Typography>
            <Typography variant="body1">{appliance["os-arch"]}</Typography>
          </div>
        </div>
      </CardContent>

      <CardActions sx={{ position: "absolute", top: "32px", right: "32px" }}>
        <Tooltip title={copyTooltip}>
          <IconButton
            color="info"
            aria-label="delete"
            size="large"
            onClick={() => {
              handleCopiedTooltip();
              if (appliance.opennebula_template)
                navigator.clipboard.writeText(parseToOpenNebulaFormat(JSON.parse(appliance.opennebula_template)));
            }}
          >
            <ContentCopyIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Download">
          <IconButton
            color="info"
            aria-label="delete"
            size="large"
            onClick={() => window.open(download, "_self")}
          >
            <FileDownloadIcon />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

export default DetailCard;
