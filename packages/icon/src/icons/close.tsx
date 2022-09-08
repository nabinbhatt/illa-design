import { createIcon } from "../create-icon"

export const CloseIcon = createIcon({
  title: "CloseIcon",
  viewBox: "0 0 8 8",
  path: (
    <path fillRule="evenodd" clipRule="evenodd"
          d="M1.14645 1.14645C1.34171 0.951184 1.65829 0.951184 1.85355 1.14645L4 3.29289L6.14645 1.14645C6.34171 0.951184 6.65829 0.951184 6.85355 1.14645C7.04882 1.34171 7.04882 1.65829 6.85355 1.85355L4.70711 4L6.85355 6.14645C7.04882 6.34171 7.04882 6.65829 6.85355 6.85355C6.65829 7.04882 6.34171 7.04882 6.14645 6.85355L4 4.70711L1.85355 6.85355C1.65829 7.04882 1.34171 7.04882 1.14645 6.85355C0.951184 6.65829 0.951184 6.34171 1.14645 6.14645L3.29289 4L1.14645 1.85355C0.951184 1.65829 0.951184 1.34171 1.14645 1.14645Z"
          fill="black" />

  ),
})

CloseIcon.displayName = "CloseIcon"
