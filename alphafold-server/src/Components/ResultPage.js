import React, { useRef, useEffect, useState } from "react";
import * as mol from "3dmol";
import axios from "axios";

export const ResultPage = (props) => {
  let viewer = null;
  const viewerRef = useRef(null);
  const [label, setLabel] = useState(false);
  const [properties, setProperties] = useState({
    molWeight: null,
    charge: null,
    pI: null,
    GRAVY: null,
  });

  const loadData = (pdbData) => {
    if (viewerRef.current) {
      viewer = mol.createViewer(viewerRef.current);
      viewer.setBackgroundColor(0xffffff);
      viewer.addModel(pdbData, "pdb");
      viewer.setStyle({}, { sticks: {} });

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
    viewer.setStyle({}, { sticks: {} });
    viewer.removeAllLabels();
    viewer.render();
  };

  const handleLabels = () => {
    if (!label) {
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
    } else {
      viewer.removeAllLabels();
    }
    viewer.render();
    setLabel(!label);
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
      .get(`http://34.152.59.173/fetch/properties/${props.jobId}`)
      .then((response) => {
        if (response.status !== 500) {
          let response = response.data.split("\n");
          let protProps = {
            molWeight: response[0].split(":")[1],
            charge: response[1].split(":")[1],
            pI: response[2].split(":")[1],
            GRAVY: response[3].split(":")[1],
          };
          setProperties(protProps);
        }
      });

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
          width: "75vw",
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
          <p style={{ fontSize: "15px" }}>{props.sequence}</p>
        </div>

        <div
          style={{
            textAlign: "center",
            width: "25%",
            display: "flex",
            alignItems: "center",
          }}
        >
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
            <th>GRAVY score</th>
          </tr>
          <tr>
            <td>{props.sequence.length}</td>
            <td>{properties.molWeight ? properties.molWeight : "---" }</td>
            <td>{properties.charge ? properties.charge : "---" }</td>
            <td>{properties.pI ? properties.pI : "---" }</td>
            <td>{properties.GRAVY ? properties.GRAVY : "---" }</td>
          </tr>
        </table>
      </div>

      <br />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "auto",
          width: "75vw",
          marginBottom: "20px",
        }}
      >
        <div
          className={"pdb-viewer"}
          ref={viewerRef}
          style={{ width: "60%", height: "70vh", border: "3px solid black" }}
        />
        <div
          style={{ border: "3px solid black", width: "50%", height: "70vh" }}
        >
          <div
            style={{
              textAlign: "center",
              paddingBottom: "20px",
            }}
          >
            <h2>Structure visualisation style</h2>
            <div style={{ display: "flex", justifyContent: "space-evenly" }}>
              <div>
                <h3 style={{ display: "inline" }}>Representation: </h3>
                <select
                  onChange={(e) => {
                    switch (e.target.value) {
                      case "Sticks":
                        setSticks();
                        break;
                      case "Lines":
                        setLines();
                        break;
                      case "Cartoon":
                        setCartoon();
                        break;
                      default:
                        break;
                    }
                  }}
                >
                  <option value="Sticks">Sticks</option>
                  <option value="Lines">Lines</option>
                  <option value="Cartoon">Cartoon</option>
                </select>
              </div>
              <div>
                <h3 style={{ display: "inline" }}>Color by: </h3>
                <select
                  onChange={(e) => {
                    switch (e.target.value) {
                      case "SS":
                        setColorBySecondaryStructure();
                        break;
                      case "Charge":
                        setColorByCharge();
                        break;
                      case "Hydrophobicity":
                        break;
                      default:
                        break;
                    }
                  }}
                >
                  <option value="SS">Secondary Structure</option>
                  <option value="Charge">Charge</option>
                  <option value="Hydrophobicity">Hydrophobicity</option>
                </select>
              </div>
            </div>

            <br />
            <div>
              <button
                className={"customBtn pdb-viewer-btn"}
                onClick={() => handleLabels()}
              >
                {label ? "Label residues" : "Remove labels"}
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
            <br />
            <div className="pdb-viewer-btn-container">
              <button
                className={"customBtn pdb-viewer-btn"}
                aria-label="Download input .csv"
              >
                <a
                  href={`http://34.152.59.173/fetch/csv/${props.jobId}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ textDecoration: "none", color: "#444444" }}
                >
                  Download input .csv
                </a>
              </button>

              <button
                className={"customBtn pdb-viewer-btn"}
                aria-label="Download output .PDB"
              >
                <a
                  href={`http://34.152.59.173/fetch/pdb/${props.jobId}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ textDecoration: "none", color: "#444444" }}
                >
                  Download output .PDB
                </a>
              </button>
            </div>

            <br />
            <div
              style={{ borderBottom: "3px solid black", paddingBottom: "20px" }}
            >
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
                  Download results as .zip
                </a>
              </button>
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <h2>Legend</h2>
          </div>
        </div>
      </div>
    </>
  );
};
