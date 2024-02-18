import { useRef, useState } from "react";
import { InsertStory } from "./insert-story";
import { StoryList } from "./story-list";
import { useFilterStories } from "./use-filter-stories";
import { InsertSentence } from "./insert-sentence";
import { CompletedStory } from "./completed-story";

export const App = () => {
  const ws = useRef(new WebSocket("ws://localhost:3001"));
  const [stories, setStories] = useState<Stories>({});
  const { openStories, closedStories } = useFilterStories({ stories });
  const [selectedStory, setSelectedStory] = useState<{
    key: string;
    data: Story;
  }>();

  ws.current.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.type === "update_stories") {
      setStories(data.payload);
    }
  };

  return (
    <main className="flex flex-col items-center bg-purple-800 h-screen">
      <div className="flex justify-around gap-8 w-full border-b-4 border-b-white">
        <InsertStory ws={ws.current} />
        <StoryList
          title="Open Stories"
          stories={openStories}
          setSelectedStory={setSelectedStory}
        />
        <StoryList
          title="Closed Stories"
          stories={closedStories}
          setSelectedStory={setSelectedStory}
        />
      </div>
      {selectedStory && (
        <div className="h-full flex flex-col mt-8">
          {selectedStory.data.sentences.includes(null) ? (
            <InsertSentence
              ws={ws.current}
              stories={stories}
              selectedStory={selectedStory}
            />
          ) : (
            <CompletedStory story={selectedStory.data} />
          )}
        </div>
      )}
    </main>
  );
};
