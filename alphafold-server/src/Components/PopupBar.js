import { useState } from "react";

export const Popupbar = () => {
  const [popup, setPopup] = useState({
    size: "0px",
  });

  function showPopUp() {
    popup.size === "0px"
      ? setPopup({
          size: "250px",
        })
      : setPopup({
          size: "0px",
        });
  }

  return (
    <div
      style={{
        position: "absolute",
        right: "10px",
      }}
      className="popupbar"
    >
      <h2>
        <i
          className="bi bi-three-dots-vertical"
          style={{ float: "right" }}
          onClick={() => showPopUp()}
        ></i>
        <div
          style={{
            width: popup.size,
            height: popup.size,
            backgroundColor: "white",
            borderRadius: "20px",
          }}
          id="popup-menu"
        ></div>
      </h2>
    </div>
  );
};
