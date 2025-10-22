import React, { useState, useEffect } from 'react';
import { Text, Box } from 'ink';
import gradient from 'gradient-string';
const portalGradient = gradient(['#4D8FFF', '#C06FEF', '#FF6B9D']);
const FRAMES = [
    `



         ∴



   `,
    `


        ∵ ∴
       ∴   ∵
        ∵ ∴


   `,
    `

       ∴  ∵  ∴
      ╱       ╲
     │    ∵    │
      ╲   ∴   ╱
       ∴  ∵  ∴

   `,
    `
      ✨  ∴  ∵  ✨
     ╱           ╲
    │      ∵      │
    │    ∴   ∴    │
     ╲     ∵     ╱
      ✨  ∴  ∵  ✨
   `,
    `
     ✨  ╭─────╮  ✨
       ╱  ∵ ∴  ╲
      │  ∴   ∵  │
      │  ∵ ∴ ∴  │
       ╲  ∴ ∵  ╱
     ✨  ╰─────╯  ✨
   `,
    `
     ✨  ╭─────╮  ✨
       ╱  ∵ ∴  ╲
      │    🧞    │
      │  ∵ ∴ ∴  │
       ╲  ∴ ∵  ╱
     ✨  ╰─────╯  ✨
   `,
    `

       ╭─────╮
      │       │
      │  🧞   │
      │       │
       ╰─────╯

   `,
];
export const PortalAnimation = ({ onComplete }) => {
    const [frame, setFrame] = useState(0);
    useEffect(() => {
        if (frame < FRAMES.length - 1) {
            const timeout = setTimeout(() => {
                setFrame(frame + 1);
            }, 350);
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
        React.createElement(Text, null, portalGradient(FRAMES[frame]))));
};
