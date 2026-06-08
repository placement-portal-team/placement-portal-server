const express = require("express");
const app = express();

const applicationRoutes=require("./routes/applicationRoutes");
const authRoutes = require("./routes/authRoutes");

app.use(express.json());

app.get("/", (req, res) => {
    res.send("PlaceMentor Backend Running like a hell");
});
app.use("/api/applications", applicationRoutes);
app.use("/api/auth",authRoutes);

module.exports = app;