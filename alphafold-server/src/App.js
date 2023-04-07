import "./App.css";
import { MainPage } from "./Components/MainPage.js";
import { Header } from "./Components/Header";
import "./styles.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="bgImage" />
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
