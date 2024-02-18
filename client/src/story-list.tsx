import React from "react";

type StoryListProps = {
  title: string;
  stories: Stories;
  setSelectedStory: React.Dispatch<React.SetStateAction<string | undefined>>;
};

export const StoryList: React.FC<StoryListProps> = ({
  title,
  stories,
  setSelectedStory,
}) => (
  <div className="w-1/3 p-4">
    <h4 className="text-white text-center mb-4">{title}</h4>
    <ul className="flex flex-col gap-2 w-full p-4 overflow-y-auto">
      {Object.entries(stories).map(([key, story]) => (
        <li
          key={key}
          className="flex justify-between gap-2 p-2 outline outline-1 outline-white rounded cursor-pointer"
          onClick={() => setSelectedStory(key)}
        >
          <span className="text-white">Topic: {story.topic}</span>
          <span className="text-white">Title: {story.title}</span>
          <span className="text-white">
            {story.sentences.filter(Boolean).length}/{story.sentences.length}
          </span>
        </li>
      ))}
    </ul>
  </div>
);
