import type { LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { prisma } from "~/db.server";
import { requireUser } from "~/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  if (!process.env.DISCORD_ADMIN_ID) return redirect("/");

  const _user = await requireUser(request);
  const user = await prisma.user.findFirst({
    where: { id: _user.id },
    select: { id: true, discordId: true },
  });
  if (!user || user.discordId !== process.env.DISCORD_ADMIN_ID)
    return redirect("/");

  return json({});
};

export default function SeedPage() {
  return <Outlet />;
}
