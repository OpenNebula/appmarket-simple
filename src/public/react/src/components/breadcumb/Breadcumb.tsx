import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import { NavLink } from "react-router-dom";

interface BreadcumbInterface {
  name: string | undefined;
}

const Breadcumb = ({ name }: BreadcumbInterface) => {
  return (
    <Breadcrumbs sx={{ mb: 4 }} aria-label="breadcrumb">
    <Link
      component={NavLink}
      to="/"
      underline="hover"
      color="inherit"
      sx={{ textDecoration: 'none' }}
    >
      Home
    </Link>

      <Typography sx={{ color: "text.primary" }}>
        <b>Appliance selected:</b> {name}
      </Typography>
    </Breadcrumbs>
  );
};

export default Breadcumb;
