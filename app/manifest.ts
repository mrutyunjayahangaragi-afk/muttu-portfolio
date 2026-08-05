import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Developer Portfolio",
    short_name: "Portfolio",
    description: "Premium Developer Portfolio Website",
    start_url: "/",
    display: "standalone",
    background_color: "#020408",
    theme_color: "#020408",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  }
}
