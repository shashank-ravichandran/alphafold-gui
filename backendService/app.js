const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const bodyParser = require("body-parser");
const config = require("config");
const fsSync = require("fs");
const fs = require("fs").promises;
const { glob } = require("glob");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const saveCsvFile = async (filename, seqData) => {
  const header = "id,sequence\n";
  const dir = `${config.file.inputFileDir}/${filename}`;

  try {
    if (!fsSync.existsSync(dir)) fs.mkdir(dir);

    await fs
      .writeFile(`${dir}/${filename}.csv`, header + filename + "," + seqData)
      .then(fs.writeFile(`${dir}/status.txt`, ""));
  } catch (err) {
    throw err;
  }
};

app.get("/", (req, res) => {
  res.send("I am alive");
});

app.get("/fetchPDB/:id", (req, res) => {
  try {
    console.log(
      `${config.file.inputFileDir}/${req.params.id}/final_structure.pdb`
    );

    fsSync.readFile(
      `${config.file.inputFileDir}/${req.params.id}/final_structure.pdb`,
      (_, data) => {
        res.status(200).send(data);
      }
    );
  } catch (err) {
    console.log("Error in FetchPDB", err);
    res.status(500).send(err);
  }
});

app.get("/completionstatus/:id", (req, res) => {
  try {
    fsSync.readFile(
      `${config.file.inputFileDir}/${req.params.id}/status.txt`,
      (_, data) => {
        res.status(200).send(data);
      }
    );
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/submitdata", async (req, res) => {
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
      `cp runAlphafold.sh ${config.file.inputFileDir}/${fileName}/`,
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
                fs.writeFile(
                  `${config.file.inputFileDir}/${fileName}/status.txt`,
                  "Error"
                );
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

app.get("/generate", async (req, res) => {
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
      `cp runAlphafold.sh ${config.file.inputFileDir}/${fileName}/`,
      (error, stdout, stderr) => {
        if (error) {
          console.log(`Error in AF2 --> ${error}`, ` Stderr --> ${stderr}`);
          res.status(500).send(`Error in AF2 --> ${error}
           Stderr --> ${stderr}`);
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
                      res.status(200).send(data);
                    }
                  );
                } catch (err) {
                  console.log("Error in FetchPDB", err);
                  res.status(500).send(err);
                }
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

app.listen(process.env.PORT || config.app.port, (err) => {
  if (err) console.log("Encountered an error", err);
  else console.log("Listening on port " + config.app.port);
});
