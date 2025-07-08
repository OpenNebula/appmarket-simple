import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { CheckboxFilters, useAppContext } from "@/context/Context";

interface FilterCheckboxInterface {
  group: keyof CheckboxFilters;
  totalCount: number;
  value: string;
}

const FilterCheckbox = ({
  value,
  totalCount,
  group,
}: FilterCheckboxInterface) => {
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
