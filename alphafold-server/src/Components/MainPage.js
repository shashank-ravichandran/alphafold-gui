import { useState } from "react";
import axios from "axios";
import { Loader } from "./Loader";
import { ResultPage } from "./ResultPage";
import { ErrorPage } from "./ErrorPage";

export const MainPage = () => {
  const [displayAdvancedMenu, setDisplayAdvancedMenu] = useState(false);
  const [screen, setScreen] = useState("form");
  const [requestError, setRequestError] = useState(false);
  const [formData, setFormData] = useState({
    proteinSeq: "",
    jobName: "",
    amberRelax: "Yes",
    templateMode: false,
    numRecycle: 1,
  });

  function toggleAdvancedMenu() {
    const advancedMenuButton = document.querySelector(
      'button[aria-haspopup="true"]'
    );

    setDisplayAdvancedMenu(!displayAdvancedMenu);

    if (!displayAdvancedMenu) {
      advancedMenuButton.setAttribute("aria-expanded", "true");
    } else {
      advancedMenuButton.setAttribute("aria-expanded", "false");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setScreen("loader");
    let jobId = "";

    await axios
      .post("http://34.152.59.173/submitdata", formData)
      .then((response) => {
        if (response.status === 200) console.log(response);
        else setRequestError(true);

        jobId = response.data.jobId;
      });

    const checkCompleteStatus = setInterval(() => {
      axios
        .get(`http://34.152.59.173/completionstatus/${jobId}`)
        .then((res) => {
          console.log(res);
          if (res.data === "Success") {
            clearInterval(checkCompleteStatus);
            setScreen("result");
          } else if (res.status !== 200) {
            clearInterval(checkCompleteStatus);
            setRequestError(true);
          }
        });
    }, 10000);
  }

  return (
    <div>
      {screen === "form" ? (
        <main>
          <form
            onSubmit={(e) => handleSubmit(e)}
            style={{ border: "3px solid black" }}
          >
            <label htmlFor="protein-sequence">Protein Sequence</label>
            <textarea
              id="protein-sequence"
              rows="5"
              placeholder="Enter your protein sequence here..."
              aria-required="true"
              value={formData.proteinSeq}
              onChange={(e) =>
                setFormData((prevState) => ({
                  ...prevState,
                  proteinSeq: e.target.value,
                }))
              }
              required
            />
            <button
              type="button"
              onClick={() => toggleAdvancedMenu()}
              aria-haspopup="true"
              aria-expanded="false"
            >
              Advanced Options
            </button>
            {displayAdvancedMenu && (
              <>
                <br />
                <div
                  id="advanced-menu"
                  aria-labelledby="advanced-options-heading"
                >
                  <h3 id="advanced-options-heading">Advanced Options</h3>
                  <div className="advanced-option">
                    <label htmlFor="job-name">Job Name</label>
                    <input
                      type="text"
                      id="job-name"
                      placeholder="Enter a job name"
                      aria-label="Job Name"
                      value={formData.jobName}
                      onChange={(e) =>
                        setFormData((prevState) => ({
                          ...prevState,
                          jobName: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="advanced-option">
                    <label htmlFor="amber-relaxation">AMBER Relaxation</label>
                    <select
                      id="amber-relaxation"
                      aria-label="AMBER Relaxation"
                      value={formData.amberRelax}
                      onChange={(e) =>
                        setFormData((prevState) => ({
                          ...prevState,
                          amberRelax: e.target.value,
                        }))
                      }
                    >
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>

                  <div className="advanced-option">
                    <label htmlFor="template-mode">Template Mode</label>
                    <input
                      type="checkbox"
                      id="template-mode"
                      aria-label="Template Mode"
                      value={formData.templateMode}
                      onClick={(e) =>
                        setFormData((prevState) => ({
                          ...prevState,
                          templateMode: !formData.templateMode,
                        }))
                      }
                    />
                  </div>

                  <div className="advanced-option">
                    <label htmlFor="num-recycle">Num-Recycle</label>
                    <select
                      id="num-recycle"
                      aria-label="Num-Recycle"
                      value={formData.numRecycle}
                      onChange={(e) =>
                        setFormData((prevState) => ({
                          ...prevState,
                          numRecycle: e.target.value,
                        }))
                      }
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <br />

            <button type="submit" aria-label="Submit" style={{borderRadius: '5px'}}>
              Submit
            </button>
          </form>
        </main>
      ) : screen === "loader" ? (
        <Loader />
      ) : requestError ? (
        <ErrorPage />
      ) : (
        <ResultPage />
      )}
    </div>
  );
};
