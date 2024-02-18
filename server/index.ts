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

type Stories = {
  open: {
    [key: string]: Story;
  };
  closed: {
    [key: string]: Story;
  };
};

class State {
  public stories: Stories = {
    open: {},
    closed: {},
  };

  public insertStory = (story: Story) => {
    const index = Object.keys(this.stories).length;
    this.stories.open[index] = story;
  };
}

const state = new State();

app.use(json());
app.use(cors({ origin: "http://localhost:3000" }));

wss.on("connection", (ws) => {
  ws.send(
    JSON.stringify({
      type: "update_stories",
      payload: state.stories,
    }),
  );

  ws.on("message", (rawData) => {
    const data = JSON.parse(rawData.toString());

    switch (data.type) {
      case "create_story":
        state.insertStory({
          title: data.title,
          sentences: data.sentences,
          topic: data.topic,
        });

        wss.clients.forEach((client) =>
          client.send(
            JSON.stringify({
              type: "update_stories",
              payload: state.stories,
            }),
          ),
        );
        break;
    }
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
