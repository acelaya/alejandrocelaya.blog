import { useEffect, useRef } from 'react';

export const CarbonAds = () => {
  const ref = useRef<HTMLDivElement>();

  useEffect(() => {
    const script = document.createElement('script');

    script.src = `https://cdn.carbonads.com/carbon.js?serve=${process.env.CARBON_SERVE}&placement=${process.env.CARBON_PLACEMENT}`;
    script.async = true;
    script.id = '_carbonads_js';

    ref.current?.appendChild(script);

    return () => ref.current?.removeChild(script);
  }, [])

  return <div className="carbonads-container" ref={ref} />;
};
