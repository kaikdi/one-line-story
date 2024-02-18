export type Story = {
  title: string;
  sentences: (string | null)[];
  topic?: string;
};

export type Stories = {
  [key: string]: Story;
};

type StoryListProps = {
  title: string;
  stories: Stories;
  setSelectedStory: React.Dispatch<
    React.SetStateAction<
      | {
          key: string;
          story: Story;
        }
      | undefined
    >
  >;
};

export const StoryList: React.FC<StoryListProps> = ({
  title,
  stories,
  setSelectedStory,
}) => (
  <ul className="w-1/3 p-4">
    <h4 className="text-white text-center mb-4">{title}</h4>
    {Object.entries(stories).map(([key, story]) => (
      <li
        key={key}
        className="flex justify-between gap-2"
        onClick={() => setSelectedStory({ key, story })}
      >
        <span className="text-white">Topic: {story.topic}</span>
        <span className="text-white">Title: {story.title}</span>
        <span className="text-white">
          {story.sentences.filter(Boolean).length}/{story.sentences.length}
        </span>
      </li>
    ))}
  </ul>
);
