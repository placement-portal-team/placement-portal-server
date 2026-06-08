const applicationRoutes=require("./routes/applicationRoutes");
const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("PlaceMentor Backend Running like a hell");
});
app.use("/api/applications", applicationRoutes);

module.exports = app;