export const useFilterStories = ({ stories }: { stories: Stories }) => {
  const openStories = Object.keys(stories)
    .filter((key) => stories[key].sentences.includes(null))
    .reduce((acc, key) => {
      acc[key] = stories[key];

      return acc;
    }, {} as Stories);

  const closedStories = Object.keys(stories)
    .filter((key) => !stories[key].sentences.includes(null))
    .reduce((acc, key) => {
      acc[key] = stories[key];

      return acc;
    }, {} as Stories);

  return { openStories, closedStories };
};
