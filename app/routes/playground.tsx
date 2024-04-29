import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { auth } from "~/auth.server";
import Nav from "~/components/nav";
import { db } from "~/db.server";
import CategoryCard from "~/components/ui/categorycard";
import { useLoaderData } from "@remix-run/react";

interface Command {
  command_id: number;
  command_name: string;
  category: string;
  usage_count: number;
  last_used: Date;
}

export let loader: LoaderFunction = async ({ request }) => {
  const commands = await db.botCommands.findMany();
  return commands;
};

export default function PlaygroundPage() {
  const commands = useLoaderData<typeof loader>();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <Nav />
      <main className="p-4 md:p-10 mx-auto max-w-7xl">
        <CategoryCard commands={commands} />
      </main>
    </div>
  );
}
