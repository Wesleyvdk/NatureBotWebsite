import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { auth } from "~/auth.server";
import Nav from "~/components/nav";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export let loader: LoaderFunction = async ({ request }) => {
  const authenticated = await auth.isAuthenticated(request, {});

  let commonGuilds: Guild[] = [];
  if (authenticated) {
    let userGuilds = await fetchUserGuilds(authenticated.accessToken);
    let botGuilds = await fetchBotGuilds();
    commonGuilds = userGuilds.filter((userGuild: any) =>
      botGuilds.some((botGuild: any) => botGuild.id === userGuild.id)
    );
    //commonGuilds = commonGuilds.filter((guild: any) => guild.owner === true);
  }

  return { authenticated, commonGuilds };
};

export default function Servers() {
  const { authenticated, commonGuilds } = useLoaderData<typeof loader>();
  return (
    <div>
      <Nav />
      <div className="flex items-center justify-center mt-10">
        <div className="grid grid-cols-2 gap-4">
          {commonGuilds.map((guild: Guild) => (
            <Link key={guild.id} to={`/${guild.id}/dashboard`}>
              <Card>
                <CardHeader>
                  <CardTitle>{guild.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Members</p>
                      <p className="text-lg font-semibold">
                        {guild.approximate_member_count}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Online</p>
                      <p className="text-lg font-semibold">
                        {guild.approximate_presence_count}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Uptime</p>
                      <p className="text-lg font-semibold">99.9%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

async function fetchUserGuilds(accessToken: string) {
  try {
    let guilds: Guild[] = await fetch(
      "https://discordapp.com/api/users/@me/guilds?" +
        new URLSearchParams({
          with_counts: "true",
        }),
      {
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json",
        },
      }
    ).then((response) => response.json());
    // console.log(guilds);

    return Array.isArray(guilds) ? guilds : [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function fetchBotGuilds() {
  try {
    let botGuilds: Guild[] = await fetch(
      "https://discordapp.com/api/users/@me/guilds?" +
        new URLSearchParams({
          with_counts: "true",
        }),
      {
        headers: {
          Authorization: "Bot " + process.env.DISCORD_BOT_TOKEN,
          "Content-Type": "application/json",
        },
      }
    ).then((response) => response.json());
    //console.log(botGuilds);

    return Array.isArray(botGuilds) ? botGuilds : [];
  } catch (error) {
    console.error(error);
    return [];
  }
}
