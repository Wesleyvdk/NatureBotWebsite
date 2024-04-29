import type { LoaderFunction } from "@remix-run/node";
import { auth } from "~/auth.server";
import LeaderboardTable from "~/components/leaderboardTable";
import Nav from "~/components/nav";
import { json } from "@remix-run/node";

import { db } from "~/db.server";
import { useLoaderData } from "@remix-run/react";
import { Card } from "~/components/ui/card";

export let loader: LoaderFunction = async ({ request }) => {
  const users = await db.vampLevels.findMany();
  const authenticated = await auth.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  return { authenticated, users };
};

export default function LeaderboardPage() {
  const { authenticated, users } = useLoaderData<typeof loader>();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <Nav />
      <main className="p-4 md:p-10 mx-auto max-w-7xl">
        <Card className="mt-6">
          <LeaderboardTable users={users} />
        </Card>
      </main>
    </div>
  );
}
