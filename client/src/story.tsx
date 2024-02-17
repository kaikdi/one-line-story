export type Story = {
  title: string;
  amountOfSentences: number;
  topic?: string;
};

export const StoryComponent: React.FC<Story> = ({
  title,
  amountOfSentences,
  topic,
}) => (
  <>
    <span>{title}</span>
    <span>{amountOfSentences}</span>
    <span>{topic}</span>
  </>
);
