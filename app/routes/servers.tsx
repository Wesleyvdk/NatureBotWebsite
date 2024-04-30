import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { auth } from "~/auth.server";
import Nav from "~/components/nav";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";

export let loader: LoaderFunction = async ({ request }) => {
  const authenticated = await auth.isAuthenticated(request, {});

  let commonGuilds: Guild[] = [];
  if (authenticated) {
    let userGuilds = await fetchUserGuilds(authenticated.accessToken);
    let botGuilds = await fetchBotGuilds();
    commonGuilds = userGuilds.filter((userGuild: any) =>
      botGuilds.some((botGuild: any) => botGuild.id === userGuild.id)
    );
    commonGuilds = commonGuilds.filter((guild: any) => guild.owner === true);
  }

  return { authenticated, commonGuilds };
};

export default function Servers() {
  const { authenticated, commonGuilds } = useLoaderData<typeof loader>();
  return (
    <div>
      <Nav />
      {commonGuilds.map((guild: Guild) => (
        <Button key={guild.id} asChild>
          <Link to={`/${guild.id}/dashboard`}>
            <Card>
              <CardHeader>
                <CardTitle>{guild.name}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        </Button>
      ))}
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
    let botGuilds: Guild[] = await fetch(
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
