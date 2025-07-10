import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Appliance } from "@/interfaces/Appliances";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import "./Card.scss";
import { Link } from "react-router-dom";
import { Tooltip } from "@mui/material";
import { useState } from "react";
import TagsPopover from "@/components/tags-popover/TagsPopover";
import { parseToOpenNebulaFormat } from "@/utils/parser";

interface BasicCardProps {
  appliance: Appliance;
}

function BasicCard({ appliance }: BasicCardProps) {
  const [copyTooltip, setCopyTooltip] = useState<string>("Copy template");

  const date = new Date(
    appliance?.creation_time ? appliance?.creation_time * 1000 : 1000,
  );

  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

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

  const visibleTags = appliance.tags?.slice(0, 3).map((tag) => {
    return <Chip key={`${appliance._id.$oid}-${tag}`} label={tag} />;
  });

  const restTags = appliance.tags?.slice(3);

  return appliance ? (
    <Card
      className="card-appliance"
      sx={{
        minWidth: 275,
        minHeight: "434px;",
        maxHeight: "434px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <CardContent>
        <div style={{ textAlign: "center" }}>
          <img
            style={{
              width: "120px",
              height: "120px",
              objectFit: "contain", // keeps aspect ratio, adds padding if needed
            }}
            src={appliance.logo ? `/logos/${appliance.logo}` : '/assets/logo-appliance.svg'}
            alt=""
          />
        </div>

        <Typography
          gutterBottom
          sx={{ color: "text.secondary", fontSize: 14, my: 2 }}
        >
          Created {day} {month} of {year}
        </Typography>

        <Typography variant="h5" component="div" sx={{ mb: 2 }}>
          {appliance.name}
        </Typography>

        <Stack
          sx={{ display: "flex", flexWrap: "wrap", gap: "10px", mb: 3 }}
          direction="row"
        >
          {visibleTags}
          {restTags && restTags.length > 0 ? (
            <TagsPopover
              tags={restTags}
              applianceId={appliance._id.$oid}
            ></TagsPopover>
          ) : null}
        </Stack>

        <Typography
          variant="body2"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: "2",
            WebkitBoxOrient: "vertical",
          }}
        >
          {appliance.short_description}
        </Typography>
      </CardContent>

      <section className="appliance-card-hover">
        <div className="appliance-card-hover__content">
          <div>
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              Hypervisor
            </Typography>
            <Typography variant="body2">{appliance.hypervisor}</Typography>
          </div>

          <div>
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              Version
            </Typography>
            <Typography variant="body2">{appliance.version}</Typography>
          </div>
        </div>

        <div className="appliance-card-hover__buttons">
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

          <IconButton
            sx={{ ml: "auto" }}
            color="secondary"
            aria-label="delete"
            size="large"
            component={Link}
            to={`/detail/${appliance._id.$oid}`}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </div>
      </section>
    </Card>
  ) : null;
}

export default BasicCard;
