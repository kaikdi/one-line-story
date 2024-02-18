import { useRef, useState } from "react";
import { CreateStoryForm } from "./create-story-form";
import { Stories, Story, StoryList } from "./story-list";

export const App = () => {
  const ws = useRef(new WebSocket("ws://localhost:3001"));
  const [stories, setStories] = useState<{ open: Stories; closed: Stories }>({
    open: {},
    closed: {},
  });
  const [selectedStory, setSelectedStory] = useState<{
    key: string;
    story: Story;
  }>();

  ws.current.onmessage = (event) => {
    const data = JSON.parse(event.data);

    switch (data.type) {
      case "update_stories":
        setStories(data.payload);
        break;
    }
  };

  const formRef = useRef<HTMLFormElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const onSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();

    ws.current.send(
      JSON.stringify({
        type: "insert_sentence",
        storyKey: selectedStory?.key,
        sentence: textAreaRef.current?.value,
      }),
    );

    formRef.current?.reset();
  };

  console.log(stories, selectedStory?.key);

  return (
    <main className="flex flex-col items-center bg-purple-800 h-screen">
      <div className="flex justify-around gap-8 w-full border-b-4 border-b-white">
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
      {selectedStory && (
        <div className="h-full flex flex-col justify-around">
          <p className="text-white text-center">
            {(
              stories.open[selectedStory?.key] ??
              stories.closed[selectedStory?.key]
            ).sentences
              .filter(Boolean)
              .at(-1)}
          </p>
          <form
            ref={formRef}
            onSubmit={onSubmit}
            className="flex flex-col justify-center gap-2 p-4"
          >
            <textarea
              ref={textAreaRef}
              rows={6}
              cols={60}
              maxLength={250}
              className="mt-4 resize-none"
            />
            <button
              type="submit"
              className="outline outline-2 outline-white rounded-sm text-white"
            >
              Submit Sentence
            </button>
          </form>
        </div>
      )}
    </main>
  );
};
