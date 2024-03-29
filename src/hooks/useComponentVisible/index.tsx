import { useState, useEffect, useRef } from "react";

const useComponentVisible = (initialIsVisible = false, onChangeVisible: (is: boolean) => {}) => {
  const [isComponentVisible, setIsComponentVisible] = useState(initialIsVisible);
  const ref = useRef(null);

  const handleHideDropdown = (event: KeyboardEvent) => event.key === "Escape" && setIsComponentVisible(false);
  const handleClickOutside = (event: MouseEvent) => ref.current && !ref.current.contains(event.target) && setIsComponentVisible(false);

  useEffect(() => {
    onChangeVisible && onChangeVisible(isComponentVisible);
  }, [isComponentVisible, onChangeVisible]);

  useEffect(() => {
    document.addEventListener("keydown", handleHideDropdown, true);
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("keydown", handleHideDropdown, true);
      document.removeEventListener("click", handleClickOutside, true);
    };
  });

  return { ref, isComponentVisible, setIsComponentVisible };
};

export default useComponentVisible;
