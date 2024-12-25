import AddEvent from "./components/AddEvent";
import Root from "./components/Root";
import Events from "./components/Events";
import Landing from "./components/Landing";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Details from "./components/Details";
import UnsubscribePage from "./components/Unsubscribe";
import Home from "./components/Home";
import { ContextProvider } from "./context/Context";
import MainLayout from "./components/Main";
import { ContextProvider2 } from "./context/Context2";

function App() {
  return (
    <BrowserRouter>
    <ContextProvider>
    <ContextProvider2>
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow overflow-auto">
          <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/loading" element={<Root />} />
          {/* <Route path="/manageEvents" element={<Events />} /> */}
          <Route path="/userRegistration" element={<Details />} />
          <Route path="/addEvent" element={<AddEvent />} />
          <Route path="/unsubscribe" element={<UnsubscribePage />} />
          <Route path="/main" element={<MainLayout />} />

          </Routes>
        </div>
        {/* Sticky Footer */}
        <div className="bg-gray-800 text-white text-center py-2 text-sm">
          © Copyright Folex 2024
        </div>
      </div>
      </ContextProvider2>
      </ContextProvider>
      
    </BrowserRouter>
  );
}

export default App;
