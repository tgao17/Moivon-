import { useEffect } from "react";

const useBackgroundImage = () => {
  useEffect(() => {
    document.querySelector("body").classList.add("backgroundImage");

    return () => {
      document.querySelector("body").classList.remove("backgroundImage");
    };
  }, []);
};

export { useBackgroundImage };
