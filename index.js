import express from "express"
import { startPairing } from "./session.js"

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/views/index.html")
})

app.post("/pair", async (req, res) => {
  const number = req.body.number
  const result = await startPairing(number)
  res.send(result)
})

app.listen(3000, () => {
  console.log("Pairing Server running on port 3000")
})
