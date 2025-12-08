import React from "react";
import "./index.css";
import ReactDOM from "react-dom/client";
import Navigation from "./Navigation.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NotFound from "./NotFound.tsx";
import Detail from "./Detail.tsx";
import App from "./App.tsx";
import Favorite from "./Favorite.tsx";
import Filter from "./Filter.tsx";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigation />}>
          <Route path="/" element={<App />} />
          <Route path="/home" element={<App />} />

          <Route path="/detail/:id" element={<Detail />} />
          <Route path="/favorites" element={<Favorite />} />
          <Route path="/filter" element={<Filter />} />

          {/* //Kalo path yang dicari ga ada diatas */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
