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

  return { authenticated };
};

export default function Index() {
  const { authenticated } = useLoaderData<typeof loader>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <Nav />
    </div>
  );
}
