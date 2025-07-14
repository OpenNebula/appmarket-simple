import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const BasicAccordion = ({
  name,
  defaultExpanded,
  children,
}: {
  name: string;
  defaultExpanded: boolean;
  children: React.ReactNode;
}) => {
  return (
    <Accordion
      disableGutters
      sx={{ backgroundColor: "transparent", boxShadow: "none" }}
      defaultExpanded={defaultExpanded}
    >
      <AccordionSummary
        sx={{ m: 0, p: 0 }}
        expandIcon={<ArrowDropDownIcon />}
        aria-controls="panel2-content"
        id="panel2-header"
      >
        <Typography component="span" sx={{ fontWeight: "bold" }}>
          {name}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ pl: 0, pt: 0 }}>{children}</AccordionDetails>
    </Accordion>
  );
};

export default BasicAccordion;
