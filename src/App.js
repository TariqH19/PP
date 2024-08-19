import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home";

import Advanced from "./pages/Advanced";
// import Nav from "./components/Nav";
// import Resources from "./pages/Resources";
import Standard from "./pages/Standard";
import Donate from "./pages/Donate";
import AuthCap from "./pages/AuthCap";
import Subs from "./pages/Subs";

const App = () => {
  return (
    <>
      {/* <Nav /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/advanced" element={<Advanced />} />
        <Route path="/standard" element={<Standard />} />
        <Route path="/authcap" element={<AuthCap />} />
        <Route path="/donate" element={<Donate />} />
        {/* <Route path="/resources" element={<Resources />} /> */}
        <Route path="/subs" element={<Subs />} />
      </Routes>
    </>
  );
};

export default App;
