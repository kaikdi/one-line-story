import express, { json } from "express";
import cors from "cors";
import { WebSocketServer } from "ws";
import http from "http";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

class State {
  public stories: Stories = {};

  public insertStory = (story: Story) => {
    const index = Object.keys(this.stories).length;
    this.stories[index] = story;
  };

  public insertSentence = (storyKey: string, sentence: string) => {
    if (!(storyKey in this.stories)) {
      return;
    }

    const story = this.stories[storyKey];
    const indexOfFirstEmptySentence = story.sentences.indexOf(null);
    story.sentences[indexOfFirstEmptySentence] = sentence;
  };
}

const state = new State();

app.use(json());
app.use(cors({ origin: "http://localhost:3000" }));

wss.on("connection", (ws) => {
  const updateStories = {
    type: "update_stories",
    payload: state.stories,
  };

  ws.send(JSON.stringify(updateStories));

  ws.on("message", (rawData) => {
    const data = JSON.parse(rawData.toString());

    switch (data.type) {
      case "insert_story":
        state.insertStory({
          title: data.title,
          sentences: data.sentences,
          topic: data.topic,
        });

        wss.clients.forEach((client) =>
          client.send(JSON.stringify(updateStories)),
        );
        break;
      case "insert_sentence": {
        state.insertSentence(data.storyKey, data.sentence);

        wss.clients.forEach((client) =>
          client.send(JSON.stringify(updateStories)),
        );
        break;
      }
    }
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
