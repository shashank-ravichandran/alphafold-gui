import React, { useRef, useEffect } from "react";
import * as mol from "3dmol";
import axios from "axios";

export const ResultPage = (props) => {
  let viewer = null;
  const viewerRef = useRef(null);

  const loadData = (pdbData) => {
    if (viewerRef.current) {
      viewer = mol.createViewer(viewerRef.current);
      viewer.setBackgroundColor(0xffffff);
      viewer.addModel(pdbData, "pdb");
      viewer.setStyle({}, { cartoon: {} });

      const models = viewer.getModel();
      const atoms = models.atoms;
      if (atoms.length > 0) {
        const atom = atoms[0];
        viewer.addSphere({
          center: { x: atom.x, y: atom.y, z: atom.z },
          radius: 1.5,
          color: "green",
          clickable: false,
        });
      }

      const clickCallback = (picked) => {
        if (picked !== null) {
          const atom = picked.atom;
          viewer.addLabel(
            `Residue: ${atom.resn}, Residue Number: ${atom.resi}`,
            {
              position: { x: atom.x, y: atom.y, z: atom.z },
              backgroundColor: "black",
            }
          );
          viewer.render();
        }
      };

      viewer.setClickable({}, true, clickCallback);
      viewer.zoomTo();
      viewer.render();
    }
  };

  const setCartoon = () => {
    viewer.setStyle({}, { cartoon: {} });
    viewer.render();
  };

  const setLines = () => {
    viewer.setStyle({}, { line: {} });
    viewer.render();
  };

  const setSticks = () => {
    viewer.setStyle({}, { stick: {} });
    viewer.render();
  };

  const resetRepr = () => {
    var m = viewer.getModel();
    m.setColorByFunction({}, (atom) => {
      return "grey";
    });
    viewer.setStyle({}, { cartoon: {} });
    viewer.removeAllLabels();
    viewer.render();
  };

  const addLabels = () => {
    let labels = [];
    var atoms = viewer.getModel().selectedAtoms({
      atom: "CA",
    });

    for (var a in atoms) {
      var atom = atoms[a];
      var l = viewer.addLabel(atom.resn + " " + atom.resi, {
        inFront: true,
        fontSize: 9,
        position: {
          x: atom.x,
          y: atom.y,
          z: atom.z,
        },
      });
      atom.label = l;
      labels.push(atom);
    }
    viewer.render();
  };

  const setColorBySecondaryStructure = () => {
    var m = viewer.getModel();
    m.setColorByFunction({}, (atom) => {
      if (atom.ss === "h") return "magenta";
      else if (atom.ss === "s") return "darkorange";
      else return "grey";
    });
    viewer.render();
  };

  const setColorByCharge = () => {
    var m = viewer.getModel();
    m.setColorByFunction({}, (atom) => {
      if (atom.resn === "ASP" || atom.resn === "GLU") return "red";
      else if (
        atom.resn === "HIS" ||
        atom.resn === "ARG" ||
        atom.resn === "LYS"
      )
        return "blue";
      else return "grey";
    });
    viewer.render();
  };

  useEffect(() => {
    axios
      .get(`http://34.152.59.173/fetchPDB/${props.jobId}`)
      .then((response) => {
        loadData(response.data);
      });
  });

  return (
    <>
      <br />
      <div
        style={{
          width: "75%",
          height: "15vh",
          margin: "auto",
          display: "flex",
        }}
      >
        <div
          style={{ height: "100%", width: "36%", border: "3px solid black" }}
        >
          <h3 style={{ textAlign: "center", marginTop: "10px" }}>
            Input Sequence
          </h3>
          <p>{props.sequence}</p>
        </div>

        <div style={{ textAlign: "center", width: "25%", lineHeight: "3.2" }}>
          <button
            className={"customBtn pdb-viewer-btn"}
            aria-label="Download results"
          >
            <a
              href={`http://34.152.59.173/fetch/zip/${props.jobId}`}
              target="_blank"
              rel="noreferrer"
              style={{ textDecoration: "none", color: "#444444" }}
            >
              Download results
            </a>
          </button>
          <button
            className={"customBtn pdb-viewer-btn"}
            aria-label="Submit another sequence"
            onClick={() => props.resetAll()}
          >
            Submit another sequence
          </button>
        </div>
        <table
          style={{
            height: "100%",
            width: "40%",
            border: "3px solid black",
            textAlign: "center",
          }}
        >
          <tr>
            <th>Residue count</th>
            <th>Molecular Wt.</th>
            <th>Charge</th>
            <th>pI</th>
          </tr>
          <tr>
            <td>---</td>
            <td>---</td>
            <td>---</td>
            <td>---</td>
          </tr>
        </table>
      </div>

      <br />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingBottom: "20px",
        }}
      >
        <div
          className={"pdb-viewer"}
          ref={viewerRef}
          style={{ width: "50%", height: "70vh" }}
        />
        <div
          style={{ border: "3px solid black", width: "30%", height: "70vh" }}
        >
          <div
            style={{
              borderBottom: "3px solid black",
              textAlign: "center",
              paddingBottom: "20px",
            }}
          >
            <h2>Representation</h2>
            <div className="pdb-viewer-btn-container">
              <button
                className={"customBtn pdb-viewer-btn"}
                onClick={() => setLines()}
              >
                Lines
              </button>

              <button
                className={"customBtn pdb-viewer-btn"}
                onClick={() => setSticks()}
              >
                Sticks
              </button>

              <button
                className={"customBtn pdb-viewer-btn"}
                onClick={() => setCartoon()}
              >
                Cartoon
              </button>
            </div>

            <br />
            <h2>Color</h2>
            <div className="pdb-viewer-btn-container">
              <button
                className={"customBtn pdb-viewer-btn"}
                onClick={() => setColorBySecondaryStructure()}
              >
                By SS
              </button>

              <button
                className={"customBtn pdb-viewer-btn"}
                onClick={() => setColorByCharge()}
              >
                By Charge
              </button>

              <button className={"customBtn pdb-viewer-btn"}>
                By GRAVY score
              </button>
              <br />
            </div>

            <br />
            <br />
            <div>
              <button
                className={"customBtn pdb-viewer-btn"}
                onClick={() => addLabels()}
              >
                Label residues
              </button>

              <button
                className={"customBtn pdb-viewer-btn"}
                style={{ marginLeft: "30px" }}
                onClick={() => resetRepr()}
              >
                Reset
              </button>
            </div>

            <br />
            <br />
            <div className="pdb-viewer-btn-container">
              <button
                className={"customBtn pdb-viewer-btn"}
                aria-label="Download input csv"
              >
                <a
                  href={`http://34.152.59.173/fetch/csv/${props.jobId}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ textDecoration: "none", color: "#444444" }}
                >
                  Download csv
                </a>
              </button>

              <button
                className={"customBtn pdb-viewer-btn"}
                aria-label="Download PDB"
              >
                <a
                  href={`http://34.152.59.173/fetch/pdb/${props.jobId}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ textDecoration: "none", color: "#444444" }}
                >
                  Download pdb
                </a>
              </button>
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <h3>Legend</h3>
          </div>
        </div>
      </div>
    </>
  );
};
