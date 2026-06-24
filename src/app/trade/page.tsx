import { redirect } from "next/navigation";
import { getTrending } from "@/lib/tokens";

export default async function TradePage() {
  // Default to the top trending token until the full /trade index ships.
  const trending = await getTrending(1);
  const top = trending[0];
  redirect(`/trade/${top.mint}`);
}
