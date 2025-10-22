import React, { useState, useEffect } from 'react';
import { Text, Box } from 'ink';
import gradient from 'gradient-string';
const genieGradient = gradient(['#FF6B9D', '#C06FEF', '#4D8FFF']);
const FRAMES = [
    `
      ╭─────╮
     ╱       ╲
    │  ◠ ◡ ◠  │
    │  ─────  │
     ╲_______╱
      │     │
      │     │
     ╱╲     ╱╲
    ╱  ╲___╱  ╲
   `,
    `
      ╭─────╮
     ╱  ~    ╲
    │  ◠ ◡ ◠  │
    │  ─────  │
     ╲_______╱
      │     │
      │     │
     ╱╲     ╱╲
    ╱  ╲___╱  ╲
   `,
    `
      ╭─────╮   ∴
     ╱  ~~   ╲  ∵
    │  ◠ ◡ ◠  │
    │  ─────  │
     ╲_______╱
      │     │
      │     │
     ╱╲     ╱╲
    ╱  ╲___╱  ╲
   `,
    `
      ╭─────╮  ∴ ∵
     ╱  ~~~  ╲ ∵ ∴
    │  ◠ ◡ ◠  │ ∴
    │  ─────  │
     ╲_______╱
      │     │
      │     │
     ╱╲     ╱╲
    ╱  ╲___╱  ╲
   `,
    `
      ╭─────╮  ✨ ∵
     ╱  ~~~  ╲ ∵ ✨
    │  ◠ ◡ ◠  │ ∴
    │  ─────  │  ╱╲
     ╲_______╱  │  │
      │     │
      │     │
     ╱╲     ╱╲
    ╱  ╲___╱  ╲
   `,
    `
      ╭─────╮  ✨ ∵
     ╱  ~~~  ╲ ∵ ✨
    │  ◠ ◡ ◠  │ ∴
    │  ─────  │ ╱ ╲
     ╲_______╱ │ ◠ │
      │     │  │   │
      │     │  ╲___╱
     ╱╲     ╱╲   ∼
    ╱  ╲___╱  ╲
   `,
    `
      ╭─────╮    ✨
     ╱       ╲
    │  ◠ ◡ ◠  │  🧞
    │  ─────  │
     ╲_______╱
      │     │
      │     │
     ╱╲     ╱╲
    ╱  ╲___╱  ╲
   `,
];
export const LampAnimation = ({ onComplete }) => {
    const [frame, setFrame] = useState(0);
    useEffect(() => {
        if (frame < FRAMES.length - 1) {
            const timeout = setTimeout(() => {
                setFrame(frame + 1);
            }, 400);
            return () => clearTimeout(timeout);
        }
        else {
            const timeout = setTimeout(() => {
                onComplete();
            }, 800);
            return () => clearTimeout(timeout);
        }
    }, [frame, onComplete]);
    return (React.createElement(Box, { flexDirection: "column", alignItems: "center" },
        React.createElement(Text, null, genieGradient(FRAMES[frame]))));
};
