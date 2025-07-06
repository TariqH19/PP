import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home";

import Advanced from "./pages/Advanced";
import ApplePayPHP from "./pages/ApplePayPHP";
import AdvancedPHP from "./pages/AdvancedPHP";
// import Nav from "./components/Nav";
import Filecomp from "./pages/Filecomp";
import Standard from "./pages/Standard";
import Donate from "./pages/Donate";
import Googlepay from "./pages/Googlepay";
import GooglepayPHP from "./pages/GooglepayPHP";
import Applepay from "./pages/ApplePay";
import AuthCap from "./pages/AuthCap";
import Subs from "./pages/Subs";
import Emails from "./pages/Email";

const App = () => {
  return (
    <>
      {/* <Nav /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/emails" element={<Emails />} />
        <Route path="/advanced" element={<Advanced />} />
        <Route path="/standard" element={<Standard />} />
        <Route path="/googlepay" element={<Googlepay />} />
        <Route path="/applepay" element={<Applepay />} />
        <Route path="/advancedphp" element={<AdvancedPHP />} />
        <Route path="/googlepayphp" element={<GooglepayPHP />} />
        <Route path="/applepayphp" element={<ApplePayPHP />} />
        <Route path="/authcap" element={<AuthCap />} />
        <Route path="/donate" element={<Donate />} />
        {/* <Route path="/applepay" element={<Applepay />} /> */}
        <Route path="/file-compare" element={<Filecomp />} />
        <Route path="/subs" element={<Subs />} />
      </Routes>
    </>
  );
};

export default App;
