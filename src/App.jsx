import { GlobalPopupProvider } from "./Pages/GlobalFunctions/GlobalPopup/GlobalPopupContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from "./Pages/Home/MainPage";

function App() {
  return (
    <GlobalPopupProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainPage />} />
          <Route path="/home" element={<MainPage />} />
        </Routes>
      </BrowserRouter>
    </GlobalPopupProvider>
  );
}

export default App;
