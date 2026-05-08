import { useEffect, useState } from "react";
import type { LoaderProps } from "../Types";

const Loader = ({ loading, delay = 200 }: LoaderProps) => {
  const [shouldRender, setShouldRender] = useState<boolean>(loading);
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [loading, delay]);
  if (!shouldRender && !loading) return null;
  return (
    <div className={`${loading ? "opacity-100" : "opacity-0"}`}>
      <div className="circles-loader">
        {[...Array(3)].map((_, i) => (
          <div className="circle" key={i} />
        ))}
      </div>
    </div>
  );
};
export default Loader;