import { Chip, IconButton, Popover, Stack } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useState } from "react";

interface TagsPopoverInterface {
  tags: string[];
  applianceId: string;
}

const TagsPopover = ({ tags, applianceId }: TagsPopoverInterface) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <>
      <IconButton
        color="primary"
        aria-label="delete"
        size="small"
        onClick={handleClick}
      >
        <MoreHorizIcon />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Stack
          sx={{ display: "flex", flexWrap: "wrap", gap: "10px", p: 2 }}
          direction="row"
        >
          {tags.map((tag) => {
            return <Chip key={`${applianceId}-${tag}`} label={tag} />;
          })}
        </Stack>
      </Popover>
    </>
  );
};

export default TagsPopover;
