import type React from "react";

declare namespace JSX {
  interface IntrinsicElements {
    "model-viewer": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      src?: string;
      poster?: string;
      ar?: boolean;
      "ar-modes"?: string;
      "camera-controls"?: boolean;
      "auto-rotate"?: boolean;
      autoplay?: boolean;
      exposure?: string | number;
      "shadow-intensity"?: string | number;
      "interaction-prompt"?: string;
      "environment-image"?: string;
    };
  }
}

