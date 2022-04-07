import { json } from "@remix-run/node";
import {
  Form,
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";

import fontsStylesheetUrl from "~/styles/fonts.css";
import tailwindStylesheetUrl from "~/styles/tailwind.css";
import { getUser } from "~/session.server";

export const links: LinksFunction = () => [
  { href: fontsStylesheetUrl, rel: "stylesheet" },
  { href: tailwindStylesheetUrl, rel: "stylesheet" },
];

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
};

export const loader: LoaderFunction = async ({ request }) =>
  json<LoaderData>({ user: await getUser(request) });

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Lost Ark Tools",
  viewport: "width=device-width,initial-scale=1",
});

export default function Root() {
  const data = useLoaderData() as LoaderData;

  console.log(data);

  return (
    <html className="h-full">
      <head>
        <Links></Links>
        <Meta></Meta>
      </head>
      <body className="h-full">
        <LiveReload></LiveReload>
        <header className="flex items-center justify-between bg-gray-900 p-4 text-white">
          <h1 className="text-3xl font-bold">
            <Link to="/">LA-T 로아툴즈</Link>
          </h1>
          <div className="float-right flex items-center justify-between">
            <p className="mr-4">TEST</p>
            <Form action="/logout" method="post">
              <button
                className="rounded-md bg-indigo-600 py-2 px-4 text-indigo-100 hover:bg-indigo-700 active:bg-indigo-500"
                type="submit"
              >
                Logout
              </button>
            </Form>
          </div>
        </header>
        <Outlet></Outlet>
        <Scripts></Scripts>
        <ScrollRestoration></ScrollRestoration>
      </body>
    </html>
  );
}
