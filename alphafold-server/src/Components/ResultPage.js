import pv from "bio-pv";
import { useEffect } from "react";

export const ResultPage = () => {
  var options = {
    antialias: true,
    quality: "medium",
  };

  function loadViewer() {
    var isEmpty = document.getElementById("viewer").innerHTML === "";
    if (isEmpty) {
      var viewer = pv.Viewer(document.getElementById("viewer"), options);
      fetch("http://localhost:3001/")
        .then((res) => res.text())
        .then((result) => {
          let structure = pv.io.pdb(result);
          viewer.cartoon("protein", structure, {
            color: pv.color.ssSuccession(),
          });
          viewer.centerOn(structure);
        });
    }
  }

  useEffect(() => loadViewer(), []);

  return (
    <div style={{ textAlign: "center" }}>
      <h3 onClick={() => loadViewer()}>Result data will be displayed here</h3>
      <div id="viewer"></div>
    </div>
  );
};
