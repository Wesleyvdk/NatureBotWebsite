import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { auth } from "~/auth.server";
import Nav from "~/components/nav";
import { db } from "~/db.server";
import CategoryCard from "~/components/ui/categorycard";
import { useLoaderData } from "@remix-run/react";

export let loader: LoaderFunction = async ({ request }) => {
  const authenticated = await auth.isAuthenticated(request, {});
  const commands = await db.botCommands.findMany();
  return { authenticated, commands };
};

export default function PlaygroundPage() {
  const { authenticated, commands } = useLoaderData<typeof loader>();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <Nav />
      <main className="p-4 md:p-10 mx-auto max-w-7xl">
        <CategoryCard commands={commands} />
      </main>
    </div>
  );
}
