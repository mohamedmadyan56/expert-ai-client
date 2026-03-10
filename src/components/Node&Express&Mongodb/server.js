const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const globalErrorHandler = require("./controllers/errorController");
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
dotenv.config({ path: "./config.env" });
app.use(helmet());
const app = express();

// middleware
app.use(express.json());


// استيراد ال Routes
const AppError = require("./Utils/appError");
const tourRoutes = require("./routes/tourRoutes");
const userRoutes = require("./routes/userRoute");
const limiter = rateLimit({
  max: 100, // أقصى عدد Requests
  windowMs: 60 * 60 * 1000, // ساعة
  message: 'Too many requests from this IP, please try again in an hour'
});
app.use('/api',limiter);
// الاتصال بالـ MongoDB
const DB = process.env.DATABASE.replace(
  "PASSWORD",
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB)
  .then(() => console.log("DB connection successful!"))
  .catch((err) => console.log("DB connection error:", err));


app.use((req,res,next)=>{
  req.requestTime = new Date().toISOString();
  console.log(req.headers);
  next();
  
})

// استخدام ال Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/tours", tourRoutes);


app.all('*', (req, res, next) => {




next(new AppError(`cannot find this route ${req.originalUrl} `,400) )


});



app.use(globalErrorHandler);



console.log(process.env);

// start server
const server =app.listen(3000, () => console.log("server running on port 3000"));

//handle rejections outside express

process.on('uncaughtException',(err)=>{
    console.log(`unhandledRejection Errors ${err.name}| ${err.message}`);
    server.close(()=>{
      console.error(`shutting down`);
      process.exit(1);
    })
})