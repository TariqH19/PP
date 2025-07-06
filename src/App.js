import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
// import Nav from "./components/Nav";
import Filecomp from "./pages/Filecomp";
import Emails from "./pages/Email";

const App = () => {
  return (
    <>
      {/* <Nav /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/emails" element={<Emails />} />
        {/* <Route path="/applepay" element={<Applepay />} /> */}
        <Route path="/file-compare" element={<Filecomp />} />
      </Routes>
    </>
  );
};

export default App;
