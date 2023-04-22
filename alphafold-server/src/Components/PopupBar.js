import { useState } from "react";

export const Popupbar = () => {
  const [popup, setPopup] = useState({
    size: "0px",
    showLinks: false,
  });

  const toggleFunc = () => {
    setPopup({
      size: "240px",
    });
    setTimeout(() => setPopup({ size:"240px", showLinks: true }), 200);
  };

  function showPopUp() {
    popup.size === "0px"
      ? toggleFunc()
      : setPopup({
          size: "0px",
          showLinks: false,
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
          style={{ float: "right", position: "relative", zIndex: "999" }}
          onClick={() => showPopUp()}
        ></i>
        <div
          style={{
            width: popup.size,
            height: popup.size,
          }}
          id="popup-menu"
        >
          {popup.showLinks ? (
            <p style={{ lineHeight: "37px" }} className="popup-links">
              <br />
              <a href="https://www.sp2tx.com">SP2TX</a>
              <br />
              <a href="https://www.sp2tx.com">Documentation</a>
              <br />
              <a href="https://www.sp2tx.com">Tutorial</a>
              <br />
              <a href="https://www.sp2tx.com">Example</a>
              <br />
              <a href="https://www.sp2tx.com">FAQ</a>
            </p>
          ) : null}
        </div>
      </h2>
    </div>
  );
};
