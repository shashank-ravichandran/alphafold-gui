import React, { useRef, useEffect, useState } from "react";
import * as mol from "3dmol";
import axios from "axios";
import {
  difficultyCouplingCalc,
  KdPlotValueCalc,
} from "../Utils/peptideDataExtractFuncs";
import { webpageConstants } from "../Utils/Constants";
import { LineChart } from "./LineChart";
import { KDPlot } from "./KDPlot";
import "bootstrap/dist/css/bootstrap.min.css";

export const ResultPage = (props) => {
  let legendText = webpageConstants.legendText;
  let viewer = null;
  const viewerRef = useRef(null);
  const [pcData, setPcData] = useState([]);
  const [kdData, setKdData] = useState([]);
  const [structData, setStructData] = useState(null);
  const [colorBy, setColorBy] = useState("default");
  const [repr, setRepr] = useState("Sticks");
  const [label, setLabel] = useState(true);
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
      viewer.setStyle({}, { stick: {} });

      const models = viewer.getModel();
      const atoms = models.atoms;
      if (atoms.length > 0) {
        const atom = atoms[atoms.length - 1];
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
            `Residue: ${atom.resn}, Residue Number: ${
              props.sequence.length - atom.resi + 1
            }`,
            {
              position: { x: atom.x, y: atom.y, z: atom.z },
              backgroundColor: "black",
            }
          );
          viewer.render();
        }
      };

      switch (repr) {
        case "Sticks":
          viewer.setStyle({}, { stick: {} });
          break;
        case "Lines":
          viewer.setStyle({}, { line: {} });
          break;
        case "Cartoon":
          viewer.setStyle({}, { cartoon: {} });
          break;
        default:
          break;
      }

      switch (colorBy) {
        case "SS":
          setColorBySecondaryStructure();
          break;
        case "Charge":
          setColorByCharge();
          break;
        case "PC":
          setColorByPc();
          break;
        case "KD":
          setColorByKd();
          break;
        default:
          break;
      }

      handleLabels();
      viewer.setClickable({}, true, clickCallback);
      viewer.zoomTo();
      viewer.render();
    }
  };

  const resetRepr = () => {
    setRepr("Sticks");
    setColorBy("default");
    setLabel(true);
  };

  const generateKdColor = (value) => {
    return value > 0 ? "blue" : "grey";
  };

  const handleLabels = () => {
    if (label) {
      let labels = [];
      var atoms = viewer.getModel().selectedAtoms({
        atom: "CA",
      });

      for (var a in atoms) {
        var atom = atoms[a];
        var l = viewer.addLabel(
          atom.resn + " " + (props.sequence.length - atom.resi + 1),
          {
            inFront: true,
            fontSize: 9,
            position: {
              x: atom.x,
              y: atom.y,
              z: atom.z,
            },
          }
        );
        atom.label = l;
        labels.push(atom);
      }
    } else {
      viewer.removeAllLabels();
    }
  };

  const setColorBySecondaryStructure = () => {
    var m = viewer.getModel();
    m.setColorByFunction({}, (atom) => {
      if (atom.ss === "h") return "magenta";
      else if (atom.ss === "s") return "darkorange";
      else return "grey";
    });
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
  };

  const setColorByPc = () => {
    var m = viewer.getModel();
    m.setColorByFunction({}, (atom) => {
      let index = atom.resi;
      if (pcData[index] > 1.2) {
        return "rgb(255, 0, 0)";
      } else if (pcData[index] <= 0.8) {
        return "rgb(0, 255, 0)";
      } else {
        return "rgb(255, 255, 0)";
      }
    });
  };

  const setColorByKd = () => {
    var m = viewer.getModel();
    m.setColorByFunction({}, (atom) => {
      let index = atom.resi;
      if (index > props.sequence.length - 4) return "grey";
      else return generateKdColor(kdData[index - 1]);
    });
  };

  useEffect(() => loadData(structData), [repr, colorBy, label]);

  useEffect(() => {
    axios
      .get(`http://34.152.59.173/fetch/properties/${props.jobId}`)
      .then((response) => {
        if (response.status !== 500) {
          let res = response.data.split("\n");
          let protProps = {
            molWeight: parseFloat(res[0].split(":")[1]).toFixed(2),
            charge: parseFloat(res[1].split(":")[1]).toFixed(2),
            pI: parseFloat(res[2].split(":")[1]).toFixed(2),
            GRAVY: parseFloat(res[3].split(":")[1]).toFixed(2),
          };
          setProperties(protProps);
        }
      });

    axios
      .get(`http://34.152.59.173/fetchPDB/${props.jobId}`)
      .then((response) => {
        setStructData(response.data);
        loadData(response.data);
      });

    let pc_data = difficultyCouplingCalc(props.sequence);
    setPcData(pc_data[0]);

    let kd_data = KdPlotValueCalc(props.sequence);
    let kd_data_result = kd_data.map((dataPoint) => {
      return dataPoint.y;
    });
    setKdData(kd_data_result);
  }, []);

  return (
    <>
      <br />
      <div className="container paper-background p-4">
        <div className="row justify-content-center p-3 mb-2">
          <div className="col-md-4 d-flex justify-content-center">
            <div
              className="col-md-12 text-center"
              style={{ border: "3px solid gray" }}
            >
              <h4 style={{ textAlign: "center", marginTop: "10px" }}>
                Input Sequence
              </h4>
              <p style={{ fontSize: "15px", marginTop: "20px" }}>
                {props.sequence}
              </p>
            </div>
          </div>

          <div className="col-md-3 d-flex align-items-center justify-content-center">
            <button
              className={"customBtn pdb-viewer-btn"}
              aria-label="Submit another sequence"
              onClick={() => props.resetAll()}
            >
              Submit another sequence
            </button>
          </div>

          <div className="col-md-5 d-flex justify-content-center">
            <table
              className="table table-bordered table-hover"
              style={{ borderColor: "gray" }}
            >
              <thead className="text-center">
                <tr>
                  <th>Residue count</th>
                  <th>Molecular Wt.</th>
                  <th>Charge</th>
                  <th>pI</th>
                  <th>GRAVY score</th>
                </tr>
              </thead>
              <tbody className="text-center">
                <tr>
                  <td>{props.sequence.length}</td>
                  <td>{properties.molWeight ? properties.molWeight : "---"}</td>
                  <td>{properties.charge ? properties.charge : "---"}</td>
                  <td>{properties.pI ? properties.pI : "---"}</td>
                  <td>{properties.GRAVY ? properties.GRAVY : "---"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="row p-2">
          <div
            className={"pdb-viewer col-md-6"}
            ref={viewerRef}
            style={{
              height: "70vh",
            }}
          />
          <div
            className="col-md-6 text-center"
            style={{
              height: "70vh",
            }}
          >
            <div
              className="row p-2 d-flex justify-content-center"
              style={{
                height: "50vh",
                borderTop: "3px solid black",
                borderRight: "3px solid black",
                borderBottom: "1.5px solid black",
              }}
            >
              <div className="row p-2">
                <h3>Structure visualisation style</h3>
                <div className="col-md-6 p-1">
                  <h4 style={{ display: "inline" }}>Representation:</h4>
                  <br />
                  <select
                    onChange={(e) => {
                      setRepr(e.target.value);
                    }}
                  >
                    <option value="default">Choose</option>
                    <option value="Sticks">Sticks</option>
                    <option value="Lines">Lines</option>
                    <option value="Cartoon">Cartoon</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <h4>Color by:</h4>
                  <select
                    onChange={(e) => {
                      setColorBy(e.target.value);
                    }}
                  >
                    <option value="default">Choose</option>
                    <option value="SS">Secondary Structure</option>
                    <option value="Charge">Charge</option>
                    <option value="PC">Peptide Companion</option>
                    <option value="KD">KD</option>
                  </select>
                </div>
              </div>

              <div className="row p-2 mb-2">
                <div className="col-md-6 d-flex justify-content-center">
                  <button
                    className={"customBtn pdb-viewer-btn"}
                    onClick={() => setLabel(!label)}
                  >
                    {label ? "Remove labels" : "Add labels"}
                  </button>
                </div>
                <div className="col-md-6 d-flex justify-content-center">
                  <button
                    className={"customBtn pdb-viewer-btn"}
                    onClick={() => {
                      resetRepr();
                    }}
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div className="row p-2 mb-2">
                <div className="col-md-6">
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
                </div>
                <div className="col-md-6">
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
              </div>

              <div className="row p-2 mb-2">
                <div className="col-md-12">
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
            </div>

            <div
              className="row d-flex align-items-center"
              style={{
                height: "20vh",
                borderBottom: "3px solid black",
                borderRight: "3px solid black",
                borderTop: "1.5px solid black",
              }}
            >
              <div className="col-md-12 text-center p-1">
                <h6>{legendText.representation[repr]}</h6>
                <h6>{legendText.colorBy[colorBy]}</h6>
              </div>
            </div>
          </div>
        </div>
      </div>

      <br />

      <div className="container paper-background p-4">
        <div className="row">
          <div className="col-md-6 text-center">
            <h3>Peptide Companion</h3>
            <LineChart sequence={props.sequence} />
            <div className="mt-3 mb-1 text-start" style={{ color: "red" }}>
              * Due to a window size of 5, the last four residues tend to have
              the exact same values
            </div>
          </div>
          <div className="col-md-6 text-center">
            <h3>2D representation of the peptide</h3>
            <div style={{ height: "85%", border: "3px solid black" }}>
              <img
                src="http://34.152.59.173/fetch/2dImage/${props.jobId}"
                alt="peptide image"
                style={{ width: "inherit", height: "inherit" }}
              />
            </div>
          </div>
        </div>
      </div>

      <br />

      <div className="container paper-background p-4">
        <div className="row d-flex justify-content-center">
          <div className="col-md-10 text-center">
            <h3>Kyte-Doolittle-Hydropathy Plot</h3>
            <KDPlot sequence={props.sequence} />
            <div className="mt-3 mb-1 text-start" style={{ color: "red" }}>
              * Due to a window size of 5, the last four residues tend to have
              the exact same values
            </div>
          </div>
        </div>
      </div>

      <br />
    </>
  );
};
