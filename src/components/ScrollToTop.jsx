import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Without this, React Router keeps the previous page's scroll position
// when navigating — so clicking a link from the bottom of one page
// lands you at the bottom of the next page too. This resets it.
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;