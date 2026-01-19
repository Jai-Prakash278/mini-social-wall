//External Modules
const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

//Internal Modules
const connectDB = require("./config/connectionDB");
const postRouter = require('./routes/postRoutes');
const authRouter = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorHandler');


app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('public/uploads'));

app.use('/auth', authRouter);
app.use('/posts', postRouter);

app.use(errorHandler);


const PORT = process.env.PORT || 3000;
connectDB();


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});