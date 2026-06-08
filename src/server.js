require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
connectDB();

const PORT = 5000||process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});