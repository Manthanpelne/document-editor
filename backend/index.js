const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()
const authRoutes = require("./routes/auth")
const documentRoutes = require("./routes/documents")
const http = require("http")
const path = require("path")
const {Server} = require("socket.io")

const app = express()
const server = http.createServer(app)
app.use(cors())
app.use(express.json())


const io = new Server(server)


app.use(express.static(path.resolve(__dirname,"../frontend")))


app.get("/",(req,res)=>{
    res.send("api is running")
})




mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB connected successfully"))
.catch((err)=>console.log("DB connection failed",err))


//routes
app.use("/api/auth",authRoutes)
app.use("/api/documents",documentRoutes)



//socket io connection
io.on("connection",(socket)=>{
    console.log("user connected",socket.id)

    socket.emit("hello", "world", (response) => {
  console.log(response); // "got it"
});

    //socket io disconnection
    // socket.on("disconnect",()=>{
    //     console.log("user disconnected",socket.id)
    // })
})




const PORT = process.env.port || 8000
server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})