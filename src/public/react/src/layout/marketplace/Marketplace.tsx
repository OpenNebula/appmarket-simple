import { CheckboxProvider } from "@/context/Context";
import Main from "./main/Main";

const MarketPlace = () => {
  return (
    <CheckboxProvider>
      <Main />
    </CheckboxProvider>
  );
};

export default MarketPlace;
