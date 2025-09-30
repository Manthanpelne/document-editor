const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()
const authRoutes = require("./routes/auth")
const documentRoutes = require("./routes/documents")
const Document = require("./models/Document")
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


//storing active users
 const activeUsers = {}


//socket io connection
io.on("connection",(socket)=>{
    console.log("user connected",socket.id)

//     socket.emit("hello", "world", (response) => {
//   console.log(response); // "got it"
// });

//joining document room
socket.on("join-document",async({documentId, userId, username})=>{
    socket.join(documentId)
    //now adding users in the active list for this doc
    if((!activeUsers[documentId])){
       activeUsers[documentId] = []
    }
    const user = { socketId: socket.id, userId, username}
    activeUsers[documentId].push(user);

    //notifying all the users about new joiner
    io.to(documentId).emit("joinerUpdate",activeUsers[documentId])
})



//handling real time editing and broadcasting changes
socket.on("sendChanges",(data)=>{
    const {documentId, content} = data
    socket.to(documentId).emit("recieveChanges",content)
})


    //socket io disconnection
    socket.on("disconnect",()=>{
//first finding from which room user got disconnected and then remove him
for(const docId in activeUsers){
    const totalUsers = activeUsers[docId].length
    activeUsers[docId] = activeUsers[docId].filter((user)=>user.socketId!==socket.id)
    //broadcasting about the user left
    if(activeUsers[docId].length !== totalUsers){
        socket.to(docId).emit("joinerUpdate", activeUsers[docId])
        console.log(`user left from room ${docId}. Remaining collaborators:`, activeUsers[docId].length)
    }
}
        console.log("user disconnected",socket.id)
    })
})




const PORT = process.env.port || 8000
server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})