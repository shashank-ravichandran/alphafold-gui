const express = require("express");
const { exec } = require("child_process");
const router = express.Router();
const fsSync = require("fs");
const fs = require("fs").promises;
const bodyParser = require("body-parser");
const { jobSubmissionMethods } = require("../Utils/SubmitAf2JobMethods");

//Function to save the submitted sequence in the AF2 input format
const saveCsvFile = jobSubmissionMethods.saveCsvFile;

//Desc: Endpoint to check if the backend is alive
router.get("/", (req, res) => {
  res.send("I am alive");
});

//Endpoint that returns the rank 1 AF2 model
router.get("/fetchPDB/:id", jobSubmissionMethods.fetchPdb);

router.get("/testPDB", jobSubmissionMethods.testPdb);

//Endpoint that returns the result directory as a ZIP file
router.get("/fetch/:fileType/:id", jobSubmissionMethods.fetch);

//Endpoint that checks status of AF2 for a submitted sequence
router.get("/completionstatus/:id", jobSubmissionMethods.completionStatus);

//Desc: Endpoint that receives the formdata and submits the dequence to AF2
//Body: Sequence, additional options(Amber relaxation, template mode, no recycles --> optional)
//Response: JobIdvas JSON object
router.post("/submitdata", async (req, res) => {
  try {
    let seqData = req.body.proteinSeq;

    const fileName = Array(5)
      .fill(0)
      .map((x) => Math.random().toString(36).charAt(2))
      .join("");

    let options = {
      amber: req.body.amberRelax,
      template: req.body.templateMode,
      recycle: req.body.numRecycle,
    };

    let alphafoldOptions = ` -r ${options.recycle} `;

    if (options.amber === "Yes") {
      alphafoldOptions += " -a ";
    }

    if (options.template === true) {
      alphafoldOptions += " -t ";
    }

    alphafoldOptions = alphafoldOptions + ` -f ${fileName}`;
    console.log("Options ---> ", alphafoldOptions);

    try {
      saveCsvFile(fileName, seqData).then(() =>
        res.status(200).send({
          jobId: fileName,
          message: "Submitted successfully. Job ID: " + fileName,
        })
      );
    } catch (err) {
      res.status(500).send(err);
    }

    exec(
      `python3 get_properties.py ${seqData} ${config.file.inputFileDir}/${fileName}`,
      (error, stdout, stderr) => {
        if (error) {
          console.log(
            `Error while generating properties --> ${error}`,
            ` Stderr --> ${stderr}`
          );

          fs.writeFile(
            `${config.file.inputFileDir}/${fileName}/status.txt`,
            "Error"
          );
          res.status(500).send(error);
        } else {
          console.log("Generated properties for the given sequence");
        }
      }
    );

    exec(
      `cp *.sh ${config.file.inputFileDir}/${fileName}/`,
      (error, stdout, stderr) => {
        if (error) {
          console.log(
            `Error while copying --> ${error}`,
            ` Stderr --> ${stderr}`
          );
          fs.writeFile(
            `${config.file.inputFileDir}/${fileName}/status.txt`,
            "Error"
          );
          res.status(500).send(error);
        } else {
          console.log(stdout);
          console.log(
            "Copied script files running AF2 now",
            `${config.file.inputFileDir}/${fileName}/runAlphafold.sh ${alphafoldOptions} -s ${seqData}`
          );
          exec(
            `${config.file.inputFileDir}/${fileName}/runAlphafold.sh ${alphafoldOptions} -s ${seqData}`,
            (error, stdout, stderr) => {
              if (error) {
                console.log(
                  `Error in AF2 --> ${error}`,
                  ` Stderr --> ${stderr}`
                );
                fs.writeFile(
                  `${config.file.inputFileDir}/${fileName}/status.txt`,
                  "Error"
                );
                res.status(500).send(err);
              } else {
                console.log(stdout, "AF2 complete");
              }
            }
          );
        }
      }
    );
  } catch (err) {
    res.status(500).send(err);
  }
});

//Desc: Endpoint that receives data through the URL
`params: sequence (peptide seq), AMBER (amber relaxation[yes/no]), 
           Templatemode (use template mode [yes/no]), Recycle (Number recycles [1,2,3])`;
//Response: Rank 1 AF2 model file contents as text
router.get("/generate", async (req, res) => {
  let result = {
    structure: "",
    properties: "",
  };

  try {
    let seqData = req.query.sequence;

    let options = {
      amber: req.query.AMBER,
      template: req.query.Templatemode,
      recycle: req.query.Recycle,
    };

    const fileName = Array(5)
      .fill(0)
      .map((x) => Math.random().toString(36).charAt(2))
      .join("");

    let alphafoldOptions = ` -r ${options.recycle} `;

    if (options.amber === "yes") {
      alphafoldOptions += " -a ";
    }

    if (options.template === true) {
      alphafoldOptions += " -t ";
    }

    alphafoldOptions = alphafoldOptions + ` -f ${fileName}`;
    console.log("Options ---> ", alphafoldOptions);

    try {
      saveCsvFile(fileName, seqData).then(() =>
        console.log({
          jobId: fileName,
          message: "Submitted successfully. Job ID: " + fileName,
        })
      );
    } catch (err) {
      res.status(500).send(err);
    }

    exec(
      `python3 get_properties.py ${seqData} ${config.file.inputFileDir}/${fileName}`,
      (error, stdout, stderr) => {
        if (error) {
          console.log(
            `Error while generating properties --> ${error}`,
            ` Stderr --> ${stderr}`
          );

          fs.writeFile(
            `${config.file.inputFileDir}/${fileName}/status.txt`,
            "Error"
          );
          res.status(500).send(error);
        } else {
          console.log("Generated properties for the given sequence");
        }
      }
    );

    exec(
      `cp runAlphafold.sh ${config.file.inputFileDir}/${fileName}/`,
      (error, stdout, stderr) => {
        if (error) {
          console.log(`Error in AF2 --> ${error}`, ` Stderr --> ${stderr}`);
          res.status(500).send(`Error in AF2 --> ${error}
             Stderr --> ${stderr}`);
          res.status(500).send(err);
        } else {
          console.log(stdout);
          console.log(
            "Copied script file running AF2 now",
            `${config.file.inputFileDir}/${fileName}/runAlphafold.sh ${alphafoldOptions}`
          );
          exec(
            `${config.file.inputFileDir}/${fileName}/runAlphafold.sh ${alphafoldOptions}`,
            (error, stdout, stderr) => {
              if (error) {
                console.log(
                  `Error in AF2 --> ${error}`,
                  ` Stderr --> ${stderr}`
                );
                res
                  .status(500)
                  .send(`Error in AF2 --> ${error} Stderr --> ${stderr}`);
              } else {
                console.log(stdout);
                try {
                  fsSync.readFile(
                    `${config.file.inputFileDir}/${fileName}/final_structure.pdb`,
                    (_, data) => {
                      result.structure = data;
                    }
                  );

                  try {
                    fsSync.readFile(
                      `${config.file.inputFileDir}/${req.params.id}/properties.txt`,
                      (_, data) => {
                        result.properties(data);
                      }
                    );
                  } catch (err) {
                    res.status(500).send(err);
                  }
                } catch (err) {
                  console.log("Error in FetchPDB", err);
                  res.status(500).send(err);
                }
              }
            }
          );
          res.status(200).send(result);
        }
      }
    );
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = { router };
