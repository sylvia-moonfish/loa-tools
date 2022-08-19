import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { prisma } from "~/db.server";
import { getSession, saveSession } from "~/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const session = await getSession(request);

    if (
      !process.env.DISCORD_CLIENT_ID ||
      !process.env.DISCORD_CLIENT_SECRET ||
      typeof code !== "string" ||
      state !== session.state
    ) {
      return redirect("/");
    }

    const accessToken = (
      await (
        await fetch("https://discord.com/api/oauth2/token", {
          method: "POST",
          body: new URLSearchParams({
            client_id: process.env.DISCORD_CLIENT_ID,
            client_secret: process.env.DISCORD_CLIENT_SECRET,
            grant_type: "authorization_code",
            code,
            redirect_uri: `${process.env.HOST_URL}/discord/redirect`,
          }),
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
      ).json()
    ).access_token;

    if (!accessToken) {
      return redirect("/");
    }

    const discordUser = await (
      await fetch("https://discord.com/api/users/@me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    ).json();

    if (
      typeof discordUser.id !== "string" ||
      typeof discordUser.username !== "string" ||
      typeof discordUser.discriminator !== "string"
    ) {
      return redirect("/");
    }

    const user = await prisma.user.upsert({
      where: {
        discordId: discordUser.id,
      },
      update: {
        discordUsername: discordUser.username,
        discordDiscriminator: discordUser.discriminator,
        discordAvatarHash: discordUser.avatar ?? null,
      },
      create: {
        discordId: discordUser.id,
        discordUsername: discordUser.username,
        discordDiscriminator: discordUser.discriminator,
        discordAvatarHash: discordUser.avatar ?? null,
      },
    });

    if (typeof user.id !== "string") {
      return redirect("/");
    }

    const redirectTo = session.loginRedirect || "/";
    session.accessToken = accessToken;
    session.loginRedirect = undefined;
    session.state = undefined;
    session.userId = user.id;

    return saveSession({ request, session, redirectTo });
  } catch (e) {
    console.log(e);
  }

  return redirect("/");
};
