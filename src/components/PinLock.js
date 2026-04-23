import React, { useEffect, useState, useRef } from "react";

const PIN_HASH = process.env.REACT_APP_PIN || "2580";

const PinLock = () => {
  const [pinEntry, setPinEntry] = useState("");
  const [unlocked, setUnlocked] = useState(
    sessionStorage.getItem("tracker_unlocked") === "1",
  );
  const [error, setError] = useState("");
  const [entering, setEntering] = useState(false);
  const [shake, setShake] = useState(false);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (unlocked) sessionStorage.setItem("tracker_unlocked", "1");
  }, [unlocked]);

  // play entry animation after mount
  useEffect(() => {
    const t = setTimeout(() => setEntering(true), 20);
    return () => clearTimeout(t);
  }, []);

  function triggerError(msg = "Incorrect PIN") {
    setError(msg);
    setShake(true);
    // briefly animate
    setTimeout(() => setShake(false), 600);
  }

  function pinPress(digit) {
    if (unlocked) return;
    const next = (pinEntry + digit).slice(0, 8);
    setPinEntry(next);
    setError("");
    if (next.length >= PIN_HASH.length) {
      if (next === PIN_HASH) {
        setUnlocked(true);
        setError("");
      } else {
        triggerError("Incorrect PIN");
        setPinEntry("");
      }
    }
  }

  function pinBackspace() {
    setPinEntry((p) => p.slice(0, -1));
    setError("");
  }

  function pinClear() {
    setPinEntry("");
    setError("");
  }

  if (unlocked) return null;

  return (
    <div
      id="pin-overlay"
      ref={overlayRef}
      className={`${entering ? "enter" : ""} ${shake ? "shake" : ""}`}>
      <h2>
        🇮🇪 <span>→</span> 🇨🇦
      </h2>
      <div id="pin-dots" aria-hidden={false}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={"pin-dot " + (i < pinEntry.length ? "filled" : "")}
            id={`d${i}`}
          />
        ))}
      </div>
      <div
        id="pin-error"
        role="status"
        aria-live="assertive"
        className={shake ? "visible" : ""}>
        {error}
      </div>
      <div id="pin-pad">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <button
            key={n}
            className="pin-btn"
            onClick={() => pinPress(String(n))}>
            {n}
          </button>
        ))}
        <button
          className="pin-btn"
          onClick={pinClear}
          id="pin-clear-btn"
          aria-label="Clear PIN"
          style={{ fontSize: "0.8rem", letterSpacing: "0.05em" }}>
          CLR
        </button>
        <button className="pin-btn" onClick={() => pinPress("0")}>
          0
        </button>
        <button
          className="pin-btn"
          onClick={pinBackspace}
          aria-label="Backspace">
          ⌫
        </button>
      </div>
    </div>
  );
};

export default PinLock;
