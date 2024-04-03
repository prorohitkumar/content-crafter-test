import { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";

const override = {
  display: "block",
  margin: "25% 40%",
  borderWidth: "5px",
  borderColor: "red yellow green blue",
};
const Spinner = () => {
    let [loading, setLoading] = useState(true);
    let [color, setColor] = useState("#00FF00");
  
    return (
      <div className="sweet-loading">
  
        <ClipLoader
          color={color}
          loading={loading}
          cssOverride={override}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  }

export default Spinner;
