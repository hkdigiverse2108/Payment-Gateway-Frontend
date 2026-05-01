import { useEffect, useState } from "react";

type LoaderProps = {
  loading: boolean;
  delay?: number;
};

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
    <div className={`fixed left-0 top-0 z-999999 flex h-screen w-screen items-center justify-center bg-white/70 dark:bg-black/70 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${loading ? "opacity-100" : "opacity-0"}`}>
      <div className="circles-loader">
        {[...Array(3)].map((_, i) => (
          <div className="circle" key={i} />
        ))}
      </div>
    </div>
  );
};

export default Loader;
