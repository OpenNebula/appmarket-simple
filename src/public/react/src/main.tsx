import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "@/App";
import MarketPlace from "@/layout/marketplace/Marketplace";
import Detail from "@/layout/detail/Detail";
import config from "@config";

// Set the browser tab title from config
document.title = config.title;

createRoot(document.getElementById("app")!).render(
  <BrowserRouter>
    <Routes>
      <Route element={<App />}>
        <Route path="/" element={<MarketPlace />} />
        <Route path="/detail/:id" element={<Detail />} />
      </Route>
    </Routes>
  </BrowserRouter>,
);
