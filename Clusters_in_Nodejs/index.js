import express from "express";
import cluster from "cluster"; // inbuilt nodejs library to helo us manage cluster
import { availableParallelism } from "os"; // to get number of cpu
import process from "process"; 

const app = express();

const cpuNum = availableParallelism();

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers: create instances in all the cpus
  for (let i = 0; i < cpuNum; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.id} died`);
    console.log(signal, code);
  });
} else {

  // Define routes inside the worker process
  app.get("/", (req, res) => {
    res.send("Home with" + process.pid);
  });

  app.listen(9000, () => {
    console.log("Server live at 9000");
  });

  console.log(`Worker ${process.pid} started`);

}
