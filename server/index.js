const express = require("express");
const connectDB = require("./db/connectDb");
const cookieParser = require("cookie-parser");
const routes = require("./routes/routes");
const cors = require("cors");
const ws = require("ws");
const jwt = require("jsonwebtoken");
const Message = require("./models/message");
const fs = require("fs");
const path = require("path");
const session = require('express-session');
require("dotenv").config();

const app = express();

app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(express.json());
app.use(cookieParser());


const isProduction = process.env.NODE_ENV === 'production';

app.use(session({
  secret: process.env.SECRET_KEY,  
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: isProduction,       
    httpOnly: true,             
    sameSite: 'Strict',         
    maxAge: 24 * 60 * 60 * 1000 
  }
}));

const corsOptions = {
  origin: process.env.CLIENT_URL, 
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.get("/test", (req, res) => {
  res.send("Hello, this is the test route");
});

app.use("/api", routes);

const port = process.env.PORT || 4000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    const server = app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      console.log(`connected to Db`);
    });

    const wss = new ws.WebSocketServer({ server });

    wss.on("connection", (connection, req) => {
      // Function to notify all clients about online people
      function notifyAboutOnlinePeople() {
        [...wss.clients].forEach((client) => {
          client.send(
            JSON.stringify({
              online: [...wss.clients].map((c) => ({ ...c.userData })),
            })
          );
        });
      }

      connection.isAlive = true;

      // Ping the client to check if it's still alive
      connection.timer = setTimeout(() => {
        connection.ping();
        connection.deathTimer = setTimeout(() => {
          connection.isAlive = false;
          clearInterval(connection.timer);
          connection.terminate();
          console.log("dead");
          notifyAboutOnlinePeople();
        }, 1000);
      }, 5000);

      // Reset the death timer when pong is received
      connection.on("pong", () => {
        clearTimeout(connection.deathTimer);
      });

      // Extract the token from cookies and verify it
      const cookies = req.headers.cookie;
      const token = cookies
        ?.split(";")
        .find((c) => c.trim().startsWith("token="));
      if (token) {
        const tokenValue = token.split("=")[1];
        jwt.verify(tokenValue, process.env.SECRET_KEY, {}, (err, userData) => {
          if (err) throw err;
          connection.userData = userData;
        });
      }

      connection.on("message", async (message) => {
        const data = JSON.parse(message);
        const { recipientId, text, file } = data.message;

        if (file) {
          const parts = file.name.split(".");
          const ext = parts[parts.length - 1];
          const fileName = `${Date.now()}.${ext}`;
          const filePath = path.join(__dirname, "uploads", fileName);

          console.log(file.data);
          const fileData = new Buffer(file.data, "base64");
          fs.writeFile(filePath, fileData, (err) => {
            if (err) {
              console.error("File upload failed:", err);
            } else {
              console.log(`File uploaded at ${filePath}`);
            }
          });          
        }

        if (recipientId && text) {
          const sendingMessage = await Message.create({
            senderId: connection.userData.id,
            recipientId,
            text,
          });

          // Send the message to the recipient and sender
          [...wss.clients]
            .filter(
              (c) =>
                c.userData?.id === recipientId ||
                c.userData?.id === connection.userData.id
            )
            .forEach((c) => {
              c.send(JSON.stringify(sendingMessage));
            });
        }
      });

      // Notify about online people once a new connection is established
      notifyAboutOnlinePeople();
    });
  } catch (error) {
    console.error("Error starting server", error);
  }
};

start();
