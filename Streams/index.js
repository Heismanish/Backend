import express from "express";
import fs from "fs";
import zlib from "zlib";

const app = express();

app.get("/", (req, res) => {
  res.send("Home for streams");
});

app.get("/file", (req, res) => {
  try {
    const readStream = fs.createReadStream("./Test.txt", "utf-8");
    const zipStream = zlib.createGzip();
    const writeStream = fs.createWriteStream("./Test.zip");

    readStream.pipe(zipStream.pipe(writeStream));

    readStream.on("error", (err) => {
      console.log(err);
      return res.sendStatus(500).send("Internal Server error");
    });

    writeStream.on("finish", () => {
      console.log("file zipped succesfully");
      return res.download("./Test.zip");
    });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

app.listen(9000, () => {
  console.log("Server is live at port 9000");
});
