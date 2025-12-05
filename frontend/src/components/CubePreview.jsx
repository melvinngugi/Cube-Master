import { useEffect, useRef } from "react";

export default function CubePreview({ scramble, eventId }) {
  const twistyRef = useRef(null);

  useEffect(() => {
    if (twistyRef.current) {
      if (eventId === "333") {
        twistyRef.current.setAttribute("puzzle", "3x3x3");
      } else if (eventId === "222") {
        twistyRef.current.setAttribute("puzzle", "2x2x2");
      } else if (eventId === "pyram") {
        twistyRef.current.setAttribute("puzzle", "pyraminx");
      }

      if (scramble) {
        twistyRef.current.setAttribute("alg", scramble);
      }
    }
  }, [scramble, eventId]);

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
