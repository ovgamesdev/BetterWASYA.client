import { useState } from "react";
import { ChromePicker } from "react-color";
import useComponentVisible from "../../../hooks/useComponentVisible/index.tsx";

import "./picker.scss";

const ColorPicker = ({ value, onChange }) => {
  const [color, setColor] = useState({ hex: value });

  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);

  return (
    <div className="picker-wrapper" ref={ref}>
      <button className={`wrapper__button ${isComponentVisible ? "active" : ""}`} onClick={() => setIsComponentVisible(true)}>
        {color.hex}
        <div className="wrapper__button-preview" style={{ background: color.hex }} />
      </button>
      {isComponentVisible && (
        <div className="wrapper__picker">
          <ChromePicker
            disableAlpha={true}
            color={color}
            onChange={(v) => {
              setColor(v);
              onChange(v.hex);
            }}
            handleChangeComplete={(v) => {
              setColor(v);
              onChange(v.hex);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
