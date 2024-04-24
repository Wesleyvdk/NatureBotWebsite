import type { LoaderFunction } from "@remix-run/node";
import { auth } from "~/auth.server";
import { LeaderboardTable } from "~/components/leaderboardTable";
import Nav from "~/components/nav";

export let loader: LoaderFunction = async ({ request }) => {
  return await auth.isAuthenticated(request, {
    failureRedirect: "/login",
  });
};

export default function LeaderboardPage() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <Nav />
      <LeaderboardTable />;
    </div>
  );
}
