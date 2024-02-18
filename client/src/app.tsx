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
  const [selectedStoryKey, setSelectedStoryKey] = useState<string>();

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
          setSelectedStory={setSelectedStoryKey}
        />
        <StoryList
          title="Closed Stories"
          stories={closedStories}
          setSelectedStory={setSelectedStoryKey}
        />
      </div>
      {selectedStoryKey && (
        <div className="h-full flex flex-col mt-8">
          {stories[selectedStoryKey].sentences.includes(null) ? (
            <InsertSentence
              ws={ws.current}
              stories={stories}
              selectedStoryKey={selectedStoryKey}
            />
          ) : (
            stories[selectedStoryKey] && (
              <CompletedStory story={stories[selectedStoryKey]} />
            )
          )}
        </div>
      )}
    </main>
  );
};
