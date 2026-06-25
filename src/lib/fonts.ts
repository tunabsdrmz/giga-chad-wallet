import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";

/** Site-wide sans — fomo-aligned Plus Jakarta on landing + trade. */
export const sansFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
});

export const monoFont = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});
