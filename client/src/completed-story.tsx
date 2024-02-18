export const CompletedStory: React.FC<{ story: Story }> = ({ story }) => (
  <>
    <p className="text-white text-center">The {story?.title} story:</p>
    <ul className="mt-4">
      {story.sentences.map((sentence) => (
        <li key={sentence} className="text-white">
          {sentence}
        </li>
      ))}
    </ul>
  </>
);
