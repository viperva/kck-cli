import express from "express";
const app = express();
const port = 4200;

app.get("/", (request, response) => {
  response.send("Hello world");
});

app.listen(port, () => {
  return console.log("listening on port: " + port);
});
