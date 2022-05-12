import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = async ({ request }) => {
  const payload = await (
    await fetch("https://lostarkcodex.com/query.php?a=dungeons&l=kr", {
      method: "GET",
    })
  ).json();

  return json({ payload });
};

export default function Dungeon() {
  const data = useLoaderData();

  console.log(data.payload);

  return (
    <div>
      {data.payload.aaData.map((el: any, index: number) => {
        return (
          <div key={index}>
            {el.map((_el: any, _index: number) => {
              return (
                <div
                  dangerouslySetInnerHTML={{
                    __html: _el,
                  }}
                  key={_index}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
