import type { LoaderFunction } from "@remix-run/node";
import { auth } from "~/auth.server";
import Nav from "~/components/nav";

import { db } from "~/db.server";
import { useLoaderData } from "@remix-run/react";
import SettingsCard from "~/components/ui/settingsCard";

export let loader: LoaderFunction = async ({ request }) => {
  const settings = await db.settings.findMany({
    where: {
      guildid: "929352993655124000",
    },
  });
  const authenticated = await auth.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  return { authenticated, settings };
};

export default function LeaderboardPage() {
  const { authenticated, settings } = useLoaderData<typeof loader>();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <Nav />
      <main className="p-4 md:p-10 mx-auto max-w-7xl">
        <SettingsCard settings={settings} />
      </main>
    </div>
  );
}
