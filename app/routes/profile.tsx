import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { DiscordUser, auth } from "~/auth.server";
import Nav from "~/components/nav";

export let loader: LoaderFunction = async ({ request }) => {
  const authenticated = await auth.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  return { authenticated };
};

export default function Profile() {
  const user = useLoaderData<DiscordUser>();
  console.log(user.profile);
  return (
    <div>
      <Nav />
      <Avatar>
        <AvatarImage
          src={user.avatar || "https://avatar.vercel.sh/leerob.png"}
        />
      </Avatar>
      <div>{user.displayName}</div>
    </div>
  );
}
