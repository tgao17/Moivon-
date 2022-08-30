import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollTop({ children }) {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    // scroll to top except when you click the back button
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}

export default ScrollTop;
