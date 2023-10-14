import express from "express";

const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get("/layers",(req,res)=>{
  res.send("This is layers")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
