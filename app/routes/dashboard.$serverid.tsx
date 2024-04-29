// app/routes/dashboard.tsx
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import { auth } from "~/auth.server";
import type { DiscordUser } from "~/auth.server";
import Nav from "~/components/nav";
import DashboardCard from "~/components/ui/dashboardcard";
import { db } from "~/db.server";

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

export default function DashboardPage() {
  const { authenticated, settings } = useLoaderData<typeof loader>();
  const params = useParams();
  console.log(params);
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <Nav />
      <DashboardCard settings={settings} />
    </div>
  );
}
