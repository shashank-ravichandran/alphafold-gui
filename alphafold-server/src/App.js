import "./App.css";
import { MainPage } from "./Components/MainPage.js";
import { Header } from "./Components/Header";
import "./styles.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      {/* <div className="bgImage" /> */}
      <Header />
      <Routes>
        <Route path="/alphafold-server" element={<MainPage />} />
        <Route path="/" element={<Navigate to={"/alphafold-server"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
