const express=require("express");
const mongoose=require("mongoose");
const cors=require("cors");
require("dotenv").config();

const {PORT,MONGODB_URI,NODE_ENV,ORIGIN}=require("./config");
const {API_ENDPOINT_NOT_FOUND_ERR,SERVER_ERR}=require("./error");

const authRoutes=require("./routes/auth.route");

const app=express();

app.use(express.json())
app.use(cors({
    credentials:true,
    origin:ORIGIN,
    optionsSuccessStatus:200
}))
if(NODE_ENV ==='development'){
    const morgan=require("morgan")
    app.use(morgan("dev"))
}
app.get("/",(req,res)=>{
    res.status(200).json({
        type:"success",
        message:"server is up and running",
        data:null,
    });
});

app.use("/api/auth",authRoutes)


app.use("*",(req,res,next)=>{
    const error={
        status:404,
        message:API_ENDPOINT_NOT_FOUND_ERR,
    };
    next(error);
});

app.use((err,req,res,next)=>{
    console.log(err);
    const status=err.status || 500;
    const message=err.message||SERVER_ERR
    const data=err.data || null;
    res.status(status).json({
        type:"error",
        message,
        data,
    });
});

async function main()
{
    try{
        await mongoose.connect(MONGODB_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        });
        console.log("Database connected");
        app.listen(PORT,()=>{
            console.log(`Server listening on a port ${PORT}`)
        })

    }catch(error){
        console.log(error);
        process.exit(1)
    }
}
main()