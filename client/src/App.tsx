import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import ChatModule from "./modules/chatModule/Index";
import BuilderModule from "./modules/builderModule/Index";
import Home from "./modules/Home";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/builder/*" element={<BuilderModule />} />
          <Route path="/chat/*" element={<ChatModule />} />
          <Route path="/my-space/*" element={<ChatModule />} />
          <Route path="/" element={<Home />} />
        </Routes>

      </BrowserRouter>
    </ThemeProvider>
  );
}