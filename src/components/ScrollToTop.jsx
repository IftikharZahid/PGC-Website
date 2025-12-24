import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // Use 'instant' to avoid scrolling animation on page load, or 'smooth' if preferred
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
