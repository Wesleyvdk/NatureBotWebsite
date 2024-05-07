import type { LoaderFunction } from "@remix-run/node";
import { auth } from "~/auth.server";
import Nav from "~/components/nav";

import { db } from "~/db.server";
import { useLoaderData } from "@remix-run/react";
import SettingsCard from "~/components/ui/settingsCard";

export let loader: LoaderFunction = async ({ request, params }) => {
  const settings = await db.settings.findMany({
    where: {
      guildid: "929352993655124000",
    },
  });
  const guildid: string | undefined = params.serverid;
  const authenticated = await auth.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const roles: Role[] = await fetchRoles(guildid);
  return { authenticated, settings, roles };
};

export default function LeaderboardPage() {
  const { authenticated, settings, roles } = useLoaderData<typeof loader>();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <Nav />
      <main className="p-4 md:p-10 mx-auto max-w-7xl">
        <SettingsCard settings={settings} roles={roles} />
      </main>
    </div>
  );
}

async function fetchRoles(guildid: string | undefined) {
  try {
    let roles: Role[] = await fetch(
      `https://discord.com/api/guilds/${guildid}/roles`,
      {
        headers: {
          Authorization: "Bot " + process.env.DISCORD_BOT_TOKEN,
          "Content-Type": "application/json",
        },
      }
    ).then((response) => response.json());

    return Array.isArray(roles) ? roles : [];
  } catch (error) {
    console.error(error);
    return [];
  }
}
