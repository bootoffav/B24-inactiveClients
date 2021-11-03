import { useState, useEffect } from "react";

function LoadingUserData() {
  const [output, SetOutput] = useState<string>("GET EVERYTHING READY");

  useEffect(() => {
    const timer = setInterval(() => SetOutput((state) => state + "."), 800);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero is-fullheight">
      <div className="hero-body">
        <div className="mx-auto is-size-1">{output}</div>
      </div>
    </section>
  );
}

export default LoadingUserData;
