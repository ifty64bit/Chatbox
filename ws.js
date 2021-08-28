const mongoose = require("mongoose");
const messages = require('./model/message');
const WebSocket = require('ws');
const dotenv = require("dotenv");

dotenv.config();

const wss = new WebSocket.Server({ port: 9000, clientTracking: true }, () => {
    console.log("Server Started At Port 9000");
});

mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("database connection successful!"))
  .catch((err) => console.log(err));

async function savetoDB(data){
    let msg = new messages({
        users: [data.from, data.to],
        sender: data.from,
        msg: data.msg,
        convoName: data.to
    })
    try {
        let result=await msg.save()
    } catch (err) {
        console.log(err);
    }
}

wss.on('connection', (ws, req) => {
    let user = req.url.substring(1);
    ws.user = user;
    ws.on('message', data => {
        data = JSON.parse(data.toString());
        savetoDB(data);
        console.log(data);
        wss.clients.forEach(client => {
            if (client.user == data.to)
            {
                console.log("Sent to Client");
                
                client.send(data.msg);
            }
        })
    })
})