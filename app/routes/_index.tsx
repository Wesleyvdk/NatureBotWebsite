import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import { auth } from "~/auth.server";
import Nav from "~/components/nav";

export const meta: MetaFunction = () => {
  return [
    { title: "Aylani" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};
export let loader: LoaderFunction = async ({ request }) => {
  return await auth.isAuthenticated(request, {});
};

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <Nav />
    </div>
  );
}
