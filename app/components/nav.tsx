import { Navbar } from "./ui/navbar";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { DiscordUser } from "~/auth.server";

export default function Nav() {
  const user = useLoaderData<DiscordUser>();
  return <Navbar user={user} />;
}
