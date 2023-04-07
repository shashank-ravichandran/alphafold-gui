const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const config = require("config");
const fsSync = require("fs");
const fs = require("fs/promises");

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
    console.log(err);
  }
};

app.get("/", (req, res) => {
  res.send("Hi I am alive");
});

app.get("/completionstatus/:id", (req, res) => {
  fsSync.readFile(
    `${config.file.inputFileDir}/${req.params.id}/status.txt`,
    (_, data) => {
      res.send(data);
    }
  );
});

app.post("/submitdata", async (req, res) => {
  let seqData = req.body.proteinSeq;
  const fileName = Array(5)
    .fill(0)
    .map((x) => Math.random().toString(36).charAt(2))
    .join("");

  saveCsvFile(fileName, seqData).then(() =>
    res.send({
      status: 200,
      jobId: fileName,
      message: "Submitted successfully. Job ID: " + fileName,
    })
  );

  setTimeout(() => {
    fs.writeFile(
      `${config.file.inputFileDir}/${fileName}/status.txt`,
      "Success"
    );
  }, 12000);
});

app.listen(config.app.port, (err) => {
  if (err) console.log("Encountered an error", err);
  else console.log("Listening on port " + config.app.port);
});
