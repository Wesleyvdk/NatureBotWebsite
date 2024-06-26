import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { auth } from "~/auth.server";

export const action: ActionFunction = async ({ request }) => {
  return await auth.logout(request, { redirectTo: "/" });
};
