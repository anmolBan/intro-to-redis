import express from "express"
import { createClient } from "redis"

const app = express();
app.use(express.json());

const client = createClient();
client.on("error", (err) => console.log("Redis Client Error", err));

app.post("/submit", async (req, res) => {
    const {problemId, userId, code, language} = req.body;

    await client.lPush("submissions", JSON.stringify({problemId, userId, code, language}));
    res.json({
        message: "Submission received"
    });
});

async function startServer() {
    try {
        await client.connect();
        console.log("Connected to Redis");

        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        });
    } catch(error){
        console.error("Failed to connect to Redis", error);
    }
}

startServer()