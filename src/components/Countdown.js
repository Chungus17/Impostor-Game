import React, { useEffect, useState } from "react";

const Countdown = ({ onComplete }) => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => setCount((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      onComplete(); // trigger once countdown ends
    }
  }, [count, onComplete]);

  return (
    <div className="countdown">
      <h1>{count > 0 ? count : "Game Starting!"}</h1>
    </div>
  );
};

export default Countdown;
