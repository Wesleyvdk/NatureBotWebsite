// app/auth.server.ts
import { Authenticator } from "remix-auth";
import type { DiscordProfile, PartialDiscordGuild } from "remix-auth-discord";
import { DiscordStrategy } from "remix-auth-discord";
import { sessionStorage } from "~/session.server";

/**
 * In this example we will remove the features of the guilds the user is in,
 * so we have to create our own (slightly changed) type for the guilds.
 * You might need to edit this in your use case.
 */
type CustomDiscordGuild = Omit<PartialDiscordGuild, "features">;

export interface DiscordUser {
  id: DiscordProfile["id"];
  displayName: DiscordProfile["displayName"];
  avatar: DiscordProfile["__json"]["avatar"];
  email: DiscordProfile["__json"]["email"];
  locale?: string;
  guilds?: Array<CustomDiscordGuild>;
  accessToken: string;
  refreshToken: string;
}

export const auth = new Authenticator<DiscordUser>(sessionStorage);

const discordStrategy = new DiscordStrategy(
  {
    clientID: process.env.DISCORD_CLIENT_ID!,
    clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    callbackURL: process.env.CALLBACK_URL!,
    // Provide all the scopes you want as an array
    scope: ["identify", "email", "guilds"],
  },
  async ({
    accessToken,
    refreshToken,
    extraParams,
    profile,
  }): Promise<DiscordUser> => {
    /**
     * Get the user data from your DB or API using the tokens and profile
     * For example query all the user guilds
     * IMPORTANT: This can quickly fill the session storage to be too big.
     * So make sure you only return the values from the guilds (and the guilds) you actually need
     * (eg. omit the features)
     * and if that's still to big, you need to store the guilds some other way. (Your own DB)
     *
     * Either way, this is how you could retrieve the user guilds.
     */
    const userGuilds: Array<PartialDiscordGuild> = await (
      await fetch("https://discord.com/api/v10/users/@me/guilds", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    )?.json();
    /**
     * In this example we're only interested in guilds where the user is either the owner or has the `MANAGE_GUILD` permission (This check includes the `ADMINISTRATOR` permission)
     * And not interested in the Guild Features.
     * That's why we use the earlier created CustomDiscordGuild type now.
     */
    const guilds: Array<CustomDiscordGuild> = userGuilds
      .filter(
        (g) => g.owner || (BigInt(g.permissions) & BigInt(0x20)) == BigInt(0x20)
      )
      .map(({ features, ...rest }) => {
        return { ...rest };
      });

    /**
     * Construct the user profile to your liking by adding data you fetched etc.
     * and only returning the data that you actually need for your application.
     */
    return {
      id: profile.id,
      displayName: profile.displayName,
      avatar: profile.__json.avatar,
      email: profile.__json.email,
      locale: profile.__json.locale,
      accessToken,
      refreshToken: refreshToken as string,
      guilds,
    };
  }
);

auth.use(discordStrategy);
