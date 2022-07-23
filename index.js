const app = require('./app');
const connectWithDb = require('./config/database');
require("dotenv").config();

//connect with db
connectWithDb();

app.listen(process.env.PORT, ()=> {
    console.log(`Server is running at port ${process.env.PORT}`);
})