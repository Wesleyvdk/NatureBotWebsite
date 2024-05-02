import { Form } from "@remix-run/react";
import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { auth } from "~/auth.server";

export const action: ActionFunction = async ({ request }) => {
  return redirect("/auth/discord");
};

export let loader: LoaderFunction = async ({ request }) => {
  console.log("Logging in");
  return await auth.isAuthenticated(request, {
    successRedirect: "/",
    failureRedirect: "/login",
  });
};

export default function Login() {
  return (
    <Form action="/auth/discord" method="post">
      <button>Login with Discord</button>
    </Form>
  );
}
