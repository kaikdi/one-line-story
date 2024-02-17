import { useRef } from "react";

export const CreateStoryForm = () => {
  const titleInput = useRef<HTMLInputElement>(null);
  const amountOfSentencesInput = useRef<HTMLInputElement>(null);
  const topicInput = useRef<HTMLInputElement>(null);

  const onSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();
  };

  return (
    <form className="flex flex-col w-1/2 justify-center" onSubmit={onSubmit}>
      <label htmlFor="title">Title</label>
      <input id="title" name="title" type="text" required ref={titleInput} />

      <label htmlFor="amountOfSentences">Amount of Sentences</label>
      <input
        id="amountOfSentences"
        name="amountOfSentences"
        type="number"
        required
        ref={amountOfSentencesInput}
      />

      <label htmlFor="topic">Topic</label>
      <input id="topic" name="topic" type="text" ref={topicInput} />

      <button type="submit">Create Story</button>
    </form>
  );
};
