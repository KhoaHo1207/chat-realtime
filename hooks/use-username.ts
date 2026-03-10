"use client";

import { useEffect, useState } from "react";
import { nanoid } from "nanoid";

const STORAGE_KEY = "chat_username";

const ANIMALS = [
  "wolf",
  "cat",
  "dog",
  "lion",
  "tiger",
  "bear",
  "zebra",
  "giraffe",
  "elephant",
  "rhino",
];

const generateUsername = () => {
  const word = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  return `anonymous-${word}-${nanoid(5)}`;
};

export const useUsername = () => {
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const main = () => {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored) {
        setUsername(stored);
        return;
      }

      const generated = generateUsername();
      localStorage.setItem(STORAGE_KEY, generated);
      setUsername(generated);
    };
    main();
  }, [username]);

  return { username, setUsername };
};
