import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
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
    let region = await prisma.region.create({
      data: {
        name: regionMap[i].regionName,
      },
    });

    for (let j = 0; j < regionMap[i].serverNames.length; j++) {
      await prisma.server.create({
        data: {
          name: regionMap[i].serverNames[j],
          regionId: region.id,
        },
      });
    }
  }

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
