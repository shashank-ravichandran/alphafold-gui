import pv from "bio-pv";
import { useEffect } from "react";

export const ResultPage = (props) => {
  var options = {
    antialias: true,
    quality: "medium",
  };

  function loadViewer(jobId) {
    var isEmpty = document.getElementById("viewer").innerHTML === "";
    if (isEmpty) {
      var viewer = pv.Viewer(document.getElementById("viewer"), options);
      fetch(`http://34.152.59.173/fetchPDB/${jobId}`)
        .then((res) => res.text())
        .then((result) => {
          console.log("result", result);
          let structure = pv.io.pdb(result);
          viewer.cartoon("protein", structure, {
            color: pv.color.ssSuccession(),
          });
          viewer.centerOn(structure);
        })
        .catch((err) => alert("Error: Something went wrong !!"));
    }
  }

  useEffect(() => loadViewer(props.jobId), []);

  return (
    <div style={{ textAlign: "center" }}>
      <h3>Result data will be displayed here</h3>
      <div id="viewer"></div>
      <br />
      <button
        className="customBtn"
        aria-label="Submit another sequence"
        style={{ borderRadius: "5px" }}
        onClick={() => props.resetAll()}
      >
        Submit another sequence
      </button>
      <button
        className="customBtn"
        aria-label="Download results"
        style={{ borderRadius: "5px" }}
        onClick={() => props.resetAll()}
      >
        <a href={`http://34.152.59.173/submitdata/${props.jobId}`} target="_blank">Download results</a>
      </button>
    </div>
  );
};
