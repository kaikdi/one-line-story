import { useEffect } from "react";
import { CreateStoryForm } from "./create-story-form";

export const App = () => {
  const socket = new WebSocket("ws://localhost:3001");

  useEffect(() => {
    (async () => {
      const res = await fetch("http://localhost:3001/list_open_stories");
      console.log(await res.json());
    })();

    (async () => {
      const res = await fetch("http://localhost:3001/list_closed_stories");
      console.log(await res.json());
    })();
  }, []);

  return (
    <main className="flex flex-col items-center">
      <CreateStoryForm />
      <ul></ul>
      <ul></ul>
    </main>
  );
};
