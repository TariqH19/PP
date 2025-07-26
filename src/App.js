import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Filecomp from "./pages/Filecomp";
import Emails from "./pages/Email";
import Prompts from "./pages/Prompts";
import Data from "./pages/Data";

const App = () => {
  return (
    <>
      {/* <Nav /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/data" element={<Data />} />
        <Route path="/prompts" element={<Prompts />} />
        <Route path="/emails" element={<Emails />} />
        <Route path="/file-compare" element={<Filecomp />} />
      </Routes>
    </>
  );
};

export default App;
