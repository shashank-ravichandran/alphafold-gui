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
      if (!fsSync.existsSync(dir)) fs.mkdir(dir);

      await fs
        .writeFile(`${dir}/${filename}.csv`, header + filename + "," + seqData)
        .then(fs.writeFile(`${dir}/status.txt`, ""));
    } catch (err) {
      throw err;
    }
  },

  fetchAsZip: function (req, res) {
    let zipFile = `${config.file.inputFileDir}/${req.params.id}/result_files_compressed.zip.pdb`;
    res.download(zipFile);
  },
};

module.exports = { jobSubmissionMethods };
