import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
// import Advanced from "./pages/Advanced";
// import Nav from "./components/Nav";
// import Resources from "./pages/Resources";
// import Standard from "./pages/Standard";
// import Subscription from "./pages/Subscription";

const App = () => {
  return (
    <>
      {/* <Nav /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/advanced" element={<Advanced />} /> */}
        {/* <Route path="/standard" element={<Standard />} /> */}
        {/* <Route path="/resources" element={<Resources />} /> */}
        {/* <Route path="/standard/subscription" element={<Subscription />} /> */}
      </Routes>
    </>
  );
};

export default App;
