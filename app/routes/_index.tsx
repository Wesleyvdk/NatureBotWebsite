import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { auth } from "~/auth.server";
import Nav from "~/components/nav";

export const meta: MetaFunction = () => {
  return [
    { title: "Aylani" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};
export let loader: LoaderFunction = async ({ request }) => {
  const authenticated = await auth.isAuthenticated(request, {});

  let commonGuilds: guild[] = [];
  if (authenticated) {
    let userGuilds = await fetchUserGuilds(authenticated.accessToken);
    let botGuilds = await fetchBotGuilds();
    commonGuilds = userGuilds.filter((userGuild: any) =>
      botGuilds.some((botGuild: any) => botGuild.id === userGuild.id)
    );
  }

  return { authenticated, commonGuilds };
};

export default function Index() {
  const { authenticated, commonGuilds } = useLoaderData<typeof loader>();
  console.log(commonGuilds);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <Nav commonGuilds={commonGuilds} />
    </div>
  );
}

async function fetchUserGuilds(accessToken: string) {
  try {
    let guilds: Guild[] = await fetch(
      "https://discordapp.com/api/users/@me/guilds",
      {
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json",
        },
      }
    ).then((response) => response.json());

    return Array.isArray(guilds) ? guilds : [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function fetchBotGuilds() {
  try {
    let botGuilds: guild[] = await fetch(
      "https://discordapp.com/api/users/@me/guilds",
      {
        headers: {
          Authorization: "Bot " + process.env.DISCORD_BOT_TOKEN,
          "Content-Type": "application/json",
        },
      }
    ).then((response) => response.json());

    return Array.isArray(botGuilds) ? botGuilds : [];
  } catch (error) {
    console.error(error);
    return [];
  }
}
