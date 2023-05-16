import express from "express";
const app = express();
const port = 8080;

app.get("/", (req, res) => {
  res.send("Hallo");
});

app.listen(port, () => {
  return console.log(`🫨 Express is listening at http://localhost:${port}`);
});
