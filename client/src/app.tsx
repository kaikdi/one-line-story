import { useRef, useState } from "react";
import { CreateStoryForm } from "./create-story-form";
import { Stories, Story, StoryList } from "./story-list";

export const App = () => {
  const ws = useRef(new WebSocket("ws://localhost:3001"));
  const [stories, setStories] = useState<{ open: Stories; closed: Stories }>({
    open: {},
    closed: {},
  });
  const [selectedStory, setSelectedStory] = useState<Story>();

  ws.current.onmessage = (event) => {
    const data = JSON.parse(event.data);

    switch (data.type) {
      case "update_stories":
        setStories(data.payload);
        break;
    }
  };

  return (
    <main className="flex flex-col items-center bg-purple-800 h-screen">
      <div className="flex w-full gap-8  border-b-4 border-b-white">
        <CreateStoryForm ws={ws.current} />
        <StoryList
          title="Open Stories"
          stories={stories.open}
          setSelectedStory={setSelectedStory}
        />
        <StoryList
          title="Closed Stories"
          stories={stories.closed}
          setSelectedStory={setSelectedStory}
        />
      </div>
      <div className="h-full flex flex-col justify-around">
        <p className="">
          {selectedStory?.sentences[selectedStory.sentences.length - 1]}
        </p>
        <textarea
          rows={6}
          cols={60}
          maxLength={250}
          className="mt-4 resize-none"
        />
      </div>
    </main>
  );
};
