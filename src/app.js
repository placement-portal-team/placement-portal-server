const express = require("express");
const app = express();

const applicationRoutes=require("./routes/applicationRoutes");
const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes"); 

app.use(express.json());

app.get("/", (req, res) => {
    res.send("PlaceMentor Backend Running like a hell");
});
app.use("/api/applications", applicationRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/ai", aiRoutes);                          


module.exports = app;