import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useAppContext } from "@/context/useAppContext";

const FilterCheckbox = ({
  value,
  totalCount,
  group,
}) => {
  const { toggleCheckbox } = useAppContext();

  const label = (
    <>
      {value} <span style={{ color: "#acacac" }}>({totalCount})</span>
    </>
  );
  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Checkbox
            size="small"
            onChange={() => toggleCheckbox(group, value)}
          />
        }
        label={label}
      />
    </FormGroup>
  );
};

export default FilterCheckbox;
