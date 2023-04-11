import pv from "bio-pv";

export const ResultPage = () => {
  var options = {
    antialias: true,
    quality: "medium"
  };

  function loadViewer() {
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

  return (
    <div style={{textAlign: 'center'}}>
      <h3 onClick={() => loadViewer()}>Result will be displayed here</h3>
      <div id="viewer" style={{border: '1px solid black'}}></div>
    </div>
  );
};
