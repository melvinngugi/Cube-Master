import { useEffect, useRef, useState } from "react";

export default function CubePreview({ scramble }) {
  const twistyRef = useRef(null);

  useEffect(() => {
    if (twistyRef.current && scramble) {
      twistyRef.current.setAttribute("alg", scramble);
    }
  }, [scramble]);

  return (
    <div className="p-2">
      <twisty-player
        ref={twistyRef}
        background="none"
        control-panel="none"
        style={{ width: "200px", height: "200px" }}
      ></twisty-player>
    </div>
  );
}