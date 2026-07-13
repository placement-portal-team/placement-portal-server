const express = require("express");
const app = express();
const cors = require("cors");

const applicationRoutes=require("./routes/applicationRoutes");
const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes"); 
const resumeRoutes = require("./routes/resumeRoutes");

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());



app.get("/", (req, res) => {
    res.send("PlaceMentor Backend Running like a hell");
});
app.use("/api/applications", applicationRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/ai", aiRoutes);  
app.use("/api/resume", resumeRoutes);                        


module.exports = app;