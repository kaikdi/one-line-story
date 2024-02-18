import express, { json } from "express";
import cors from "cors";
import { WebSocketServer } from "ws";
import http from "http";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

type Story = {
  title: string;
  sentences: (string | null)[];
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
    const index = Object.keys(this.stories.open).length;
    this.stories.open[index] = story;
  };

  public insertSentence = (storyKey: string, sentence: string) => {
    const story = this.stories.open[storyKey];

    if (!story) {
      return;
    }

    const indexOfFirstEmptySentence = story.sentences.indexOf(null);

    if (!this.isStoryFull(indexOfFirstEmptySentence, storyKey)) {
      story.sentences[indexOfFirstEmptySentence] = sentence;
    }
  };

  private isStoryFull(index: number, storyKey: string) {
    const story = this.stories.open[storyKey];

    if (index === story.sentences.length - 1) {
      this.stories.closed = { [storyKey]: story };
      delete this.stories.open[storyKey];

      return true;
    }

    return false;
  }
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
