import { useRef } from "react";

export const InsertSentence: React.FC<{
  ws: WebSocket;
  stories: Stories;
  selectedStory: {
    key: string;
    data: Story;
  };
}> = ({ ws, stories, selectedStory }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const onSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();

    ws.send(
      JSON.stringify({
        type: "insert_sentence",
        storyKey: selectedStory?.key,
        sentence: textAreaRef.current?.value,
      }),
    );

    formRef.current?.reset();
  };

  return (
    <>
      <p className="text-white text-center">
        The latest sentence of {selectedStory.data.title}:
      </p>
      <p className="text-white text-center">
        {stories[selectedStory.key].sentences.filter(Boolean).at(-1)}
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
    </>
  );
};
