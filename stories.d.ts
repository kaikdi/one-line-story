type Story = {
  title: string;
  sentences: (string | null)[];
  topic?: string;
};

type Stories = {
  [key: string]: Story;
};
