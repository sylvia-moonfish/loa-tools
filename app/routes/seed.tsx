import type { LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { requireUser } from "~/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request);
  if (user.discordId !== "288935284014448650") return redirect("/");
  return json({});
};

export default function SeedPage() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
