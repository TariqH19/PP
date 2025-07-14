import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Coffee from "./pages/Coffee";
import Filecomp from "./pages/Filecomp";
import Emails from "./pages/Email";
import Finance from "./pages/Finance";

const App = () => {
  return (
    <>
      {/* <Nav /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/emails" element={<Emails />} />
        <Route path="/finance" element={<Finance />} />
        <Route path="/coffee" element={<Coffee />} />
        <Route path="/file-compare" element={<Filecomp />} />
      </Routes>
    </>
  );
};

export default App;
