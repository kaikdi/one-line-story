import express, { json } from "express";
import cors from "cors";
import { WebSocketServer } from "ws";
import http from "http";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

type Story = {
  title: string;
  sentences: (string | undefined)[];
  topic?: string;
};

class State {
  public stories: Story[] = [];
  public openStories: Story[] = [];
  public closedStories: Story[] = [];

  public insertStory = (story: Story) => this.stories.push(story);
}

const state = new State();

app.use(json());
app.use(cors({ origin: "http://localhost:3000" }));

app.post("/create_story", (req, res) => {
  state.insertStory(req.body);

  res.send(state.stories);

  console.log(state.openStories);
});

app.get("/list_open_stories", (_req, res) => {
  res.send(state.openStories);
});

app.get("/list_closed_stories", (_req, res) => {
  res.send(state.closedStories);
});

wss.on("connection", (ws) => {
  ws.send("OK");
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
