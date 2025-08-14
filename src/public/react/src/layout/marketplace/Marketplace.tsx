// Import context providers
import { Providers } from "@/context/Providers";

// Import app components
import Main from "./main/Main";

/**
 * Main layour for marketplace.
 * @returns {JSX.Element} The rendered MarketPlace component.
 */
const MarketPlace = () => {
  return (
    <Providers>
      <Main />
    </Providers>
  );
};

export default MarketPlace;
