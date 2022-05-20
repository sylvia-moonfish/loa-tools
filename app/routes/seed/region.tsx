import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { prisma } from "~/db.server";

export const loader: LoaderFunction = async () => {
  const regionMap = [
    {
      regionName: "North America West",
      serverNames: [
        "Mari",
        "Valtan",
        "Enviska",
        "Akkan",
        "Bergstrom",
        "Shandi",
        "Rohendel",
      ],
    },
    {
      regionName: "North America East",
      serverNames: [
        "Azena",
        "Una",
        "Regulus",
        "Avesta",
        "Galatur",
        "Karta",
        "Ladon",
        "Kharmine",
        "Elzowin",
        "Sasha",
        "Adrinne",
        "Aldebaran",
        "Zosma",
        "Vykas",
        "Danube",
      ],
    },
    {
      regionName: "Europe Central",
      serverNames: [
        "Neria",
        "Kadan",
        "Trixion",
        "Calvasus",
        "Thirain",
        "Zinnervale",
        "Asta",
        "Wei",
        "Slen",
        "Sceptrum",
        "Procyon",
        "Beatrice",
        "Inanna",
        "Thaemine",
        "Sirius",
        "Antares",
        "Brelshaza",
        "Nineveh",
        "Mokoko",
      ],
    },
    {
      regionName: "Europe West",
      serverNames: [
        "Rethramis",
        "Tortoyk",
        "Moonkeep",
        "Stonehearth",
        "Shadespire",
        "Tragon",
        "Petrania",
        "Punika",
      ],
    },
    {
      regionName: "South America",
      serverNames: [
        "Kazeros",
        "Agaton",
        "Gienah",
        "Arcturus",
        "Yorn",
        "Feiton",
        "Vern",
        "Kurzan",
        "Prideholme",
      ],
    },
  ];

  for (let i = 0; i < regionMap.length; i++) {
    let region = await prisma.region.upsert({
      where: {
        name: regionMap[i].regionName,
      },
      update: {
        name: regionMap[i].regionName,
      },
      create: {
        name: regionMap[i].regionName,
      },
    });

    for (let j = 0; j < regionMap[i].serverNames.length; j++) {
      await prisma.server.upsert({
        where: {
          name: regionMap[i].serverNames[j],
        },
        update: {
          name: regionMap[i].serverNames[j],
          regionId: region.id,
        },
        create: {
          name: regionMap[i].serverNames[j],
          regionId: region.id,
        },
      });
    }
  }

  return json(
    await prisma.region.findMany({
      orderBy: {
        name: "asc",
      },
      include: {
        servers: {
          orderBy: {
            name: "asc",
          },
        },
      },
    })
  );
};

export default function SeedRegionPage() {
  const data = useLoaderData();
  console.log(data);

  return (
    <textarea
      className="h-full-screen w-full cursor-default bg-loa-body"
      readOnly={true}
      value={JSON.stringify(data, null, 4)}
    />
  );
}
