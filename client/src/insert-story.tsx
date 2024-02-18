import React, { useRef } from "react";

export const InsertStory: React.FC<{
  ws: WebSocket;
}> = ({ ws }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const amountOfSentencesRef = useRef<HTMLInputElement>(null);
  const topicRef = useRef<HTMLInputElement>(null);

  const onSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();

    ws.send(
      JSON.stringify({
        type: "insert_story",
        title: titleRef.current?.value,
        sentences: Array(
          parseInt(amountOfSentencesRef.current?.value ?? ""),
        ).fill(undefined),
        topic: topicRef.current?.value,
      }),
    );

    formRef.current?.reset();
  };

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className="flex flex-col justify-center gap-2 p-4 w-1/3"
    >
      <label htmlFor="title" className="text-white">
        Title
      </label>
      <input
        id="title"
        name="title"
        type="text"
        required
        ref={titleRef}
        className="rounded-sm"
      />
      <label htmlFor="amountOfSentences" className="text-white">
        Amount of Sentences
      </label>
      <input
        id="amountOfSentences"
        name="amountOfSentences"
        type="number"
        required
        ref={amountOfSentencesRef}
        className="rounded-sm"
      />
      <label htmlFor="topic" className="text-white">
        Topic
      </label>
      <input
        id="topic"
        name="topic"
        type="text"
        ref={topicRef}
        className="rounded-sm"
      />
      <button
        type="submit"
        className="outline outline-2 outline-white rounded-sm text-white"
      >
        Create Story
      </button>
    </form>
  );
};
