const fsSync = require("fs");
const fs = require("fs").promises;

const jobSubmissionMethods = {
  fetchPdb: (req, res) => {
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
  },

  testPdb: (req, res) => {
    try {
      fsSync.readFile(
        `../inputFiles/1jug.pdb`,
        (_, data) => {
          res.status(200).send(data);
        }
      );
    } catch (err) {
      console.log("Error in TestPDB", err);
      res.status(500).send(err);
    }
  },

  completionStatus: (req, res) => {
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
  },

  saveCsvFile: async (filename, seqData) => {
    const header = "id,sequence\n";
    const dir = `${config.file.inputFileDir}/${filename}`;

    try {
      console.log("Inside file creation if");
      await fs.mkdir(dir);

      await fs
        .writeFile(`${dir}/${filename}.csv`, header + filename + "," + seqData)
        .then(fs.writeFile(`${dir}/status.txt`, ""));
    } catch (err) {
      throw err;
    }
  },

  fetch: (req, res) => {
    switch (req.params.fileType) {
      case "zip":
        let zipFile = `${config.file.inputFileDir}/${req.params.id}/result_files_compressed.zip`;
        res.download(zipFile);
        break;

      case "pdb":
        let pdbFile = `${config.file.inputFileDir}/${req.params.id}/final_structure.pdb`;
        res.download(pdbFile);
        break;

      case "csv":
        let csvFile = `${config.file.inputFileDir}/${req.params.id}/${req.params.id}.csv`;
        res.download(csvFile);
        break;

      default:
        break;
    }
  },
};

module.exports = { jobSubmissionMethods };
