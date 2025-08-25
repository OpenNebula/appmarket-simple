// React
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"

// Marketplace
import App from "@/App"
import Dashboard from "@/layout/dashboard"
import Detail from "@/layout/detail"
import config from "@config"

// Styles
import "./index.css"

// Set the browser tab title from config
document.title = config.title

createRoot(document.getElementById("app")).render(
  <BrowserRouter>
    <Routes>
      <Route element={<App />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/appliance/:id" element={<Detail />} />
      </Route>
    </Routes>
  </BrowserRouter>,
)
