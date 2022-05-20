import type { ContentDifficulty, ContentType } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { prisma } from "~/db.server";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { requireUser } from "~/session.server";

type ContentTypeDataType = {
  name: LocalizedTextDataType[];
  contentGroups: ContentGroupDataType[];
};

type ContentGroupDataType = {
  name: LocalizedTextDataType[];
  contents: ContentDataType[];
};

type ContentDataType = {
  name: LocalizedTextDataType[];
  contentDifficulty?: ContentDifficultyDataType;
  tier: number;
  level: number;
  groupSize: number;
  requireFullParty: boolean;
  iconSrc?: string;
  bannerSrc?: string;
};

type ContentDifficultyDataType = {
  name: LocalizedTextDataType[];
};

type LocalizedTextDataType = {
  text: string;
  locale: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request);
  if (user.discordId !== "288935284014448650") return redirect("/");

  const contents: ContentTypeDataType[] = [
    {
      name: [
        {
          text: "Chaos Dungeon",
          locale: "en",
        },
      ],
      contentGroups: [
        {
          name: [
            {
              text: "North Vern",
              locale: "en",
            },
          ],
          contents: [
            {
              name: [
                {
                  text: "Level 1 Echo",
                  locale: "en",
                },
              ],
              tier: 1,
              level: 250,
              groupSize: 4,
              requireFullParty: false,
              iconSrc: "",
              bannerSrc: "",
            },
            {
              name: [
                {
                  text: "Level 2 Echo",
                  locale: "en",
                },
              ],
              tier: 1,
              level: 340,
              groupSize: 4,
              requireFullParty: false,
              iconSrc: "",
              bannerSrc: "",
            },
            {
              name: [
                {
                  text: "Level 3 Echo",
                  locale: "en",
                },
              ],
              tier: 1,
              level: 380,
              groupSize: 4,
              requireFullParty: false,
              iconSrc: "",
              bannerSrc: "",
            },
            {
              name: [
                {
                  text: "Level 4 Echo",
                  locale: "en",
                },
              ],
              tier: 1,
              level: 420,
              groupSize: 4,
              requireFullParty: false,
              iconSrc: "",
              bannerSrc: "",
            },
          ],
        },
        {
          name: [
            {
              text: "Rohendel",
              locale: "en",
            },
          ],
          contents: [
            {
              name: [
                {
                  text: "Level 1 Phantom",
                  locale: "en",
                },
              ],
              tier: 1,
              level: 460,
              groupSize: 4,
              requireFullParty: false,
              iconSrc: "",
              bannerSrc: "",
            },
            {
              name: [
                {
                  text: "Level 2 Phantom",
                  locale: "en",
                },
              ],
              tier: 1,
              level: 500,
              groupSize: 4,
              requireFullParty: false,
              iconSrc: "",
              bannerSrc: "",
            },
            {
              name: [
                {
                  text: "Level 3 Phantom",
                  locale: "en",
                },
              ],
              tier: 1,
              level: 540,
              groupSize: 4,
              requireFullParty: false,
              iconSrc: "",
              bannerSrc: "",
            },
            {
              name: [
                {
                  text: "Level 4 Phantom",
                  locale: "en",
                },
              ],
              tier: 1,
              level: 580,
              groupSize: 4,
              requireFullParty: false,
              iconSrc: "",
              bannerSrc: "",
            },
          ],
        },
        {
          name: [
            {
              text: "Yorn",
              locale: "en",
            },
          ],
          contents: [
            {
              name: [
                {
                  text: "Level 1 Earth",
                  locale: "en",
                },
              ],
              tier: 2,
              level: 600,
              groupSize: 4,
              requireFullParty: false,
              iconSrc: "",
              bannerSrc: "",
            },
            {
              name: [
                {
                  text: "Level 2 Earth",
                  locale: "en",
                },
              ],
              tier: 2,
              level: 840,
              groupSize: 4,
              requireFullParty: false,
              iconSrc: "",
              bannerSrc: "",
            },
            {
              name: [
                {
                  text: "Level 3 Earth",
                  locale: "en",
                },
              ],
              tier: 2,
              level: 880,
              groupSize: 4,
              requireFullParty: false,
              iconSrc: "",
              bannerSrc: "",
            },
            {
              name: [
                {
                  text: "Level 4 Earth",
                  locale: "en",
                },
              ],
              tier: 2,
              level: 920,
              groupSize: 4,
              requireFullParty: false,
              iconSrc: "",
              bannerSrc: "",
            },
          ],
        },
        {
          name: [
            {
              text: "Feiton",
              locale: "en",
            },
          ],
          contents: [
            {
              name: [
                {
                  text: "Level 1 Shadow",
                  locale: "en",
                },
              ],
              tier: 2,
              level: 960,
              groupSize: 4,
              requireFullParty: false,
              iconSrc: "",
              bannerSrc: "",
            },
            {
              name: [
                {
                  text: "Level 2 Shadow",
                  locale: "en",
                },
              ],
              tier: 2,
              level: 1000,
              groupSize: 4,
              requireFullParty: false,
              iconSrc: "",
              bannerSrc: "",
            },
            {
              name: [
                {
                  text: "Level 3 Shadow",
                  locale: "en",
                },
              ],
              tier: 2,
              level: 1040,
              groupSize: 4,
              requireFullParty: false,
              iconSrc: "",
              bannerSrc: "",
            },
            {
              name: [
                {
                  text: "Level 4 Shadow",
                  locale: "en",
                },
              ],
              tier: 2,
              level: 1080,
              groupSize: 4,
              requireFullParty: false,
              iconSrc: "",
              bannerSrc: "",
            },
          ],
        },
        {
          name: [
            {
              text: "Punika",
              locale: "en",
            },
          ],
          contents: [
            {
              name: [
                {
                  text: "Level 1 Star",
                  locale: "en",
                },
              ],
              tier: 3,
              level: 1100,
              groupSize: 4,
              requireFullParty: false,
              iconSrc: "",
              bannerSrc: "",
            },
            {
              name: [
                {
                  text: "Level 2 Star",
                  locale: "en",
                },
              ],
              tier: 3,
              level: 1310,
              groupSize: 4,
              requireFullParty: false,
              iconSrc: "",
              bannerSrc: "",
            },
            {
              name: [
                {
                  text: "Level 1 Moon",
                  locale: "en",
                },
              ],
              tier: 3,
              level: 1325,
              groupSize: 4,
              requireFullParty: false,
              iconSrc: "",
              bannerSrc: "",
            },
            {
              name: [
                {
                  text: "Level 2 Moon",
                  locale: "en",
                },
              ],
              tier: 3,
              level: 1340,
              groupSize: 4,
              requireFullParty: false,
              iconSrc: "",
              bannerSrc: "",
            },
            {
              name: [
                {
                  text: "Level 3 Moon",
                  locale: "en",
                },
              ],
              tier: 3,
              level: 1355,
              groupSize: 4,
              requireFullParty: false,
              iconSrc: "",
              bannerSrc: "",
            },
            {
              name: [
                {
                  text: "Level 1 Sun",
                  locale: "en",
                },
              ],
              tier: 3,
              level: 1370,
              groupSize: 4,
              requireFullParty: false,
              iconSrc: "",
              bannerSrc: "",
            },
            {
              name: [
                {
                  text: "Level 2 Sun",
                  locale: "en",
                },
              ],
              tier: 3,
              level: 1385,
              groupSize: 4,
              requireFullParty: false,
              iconSrc: "",
              bannerSrc: "",
            },
            {
              name: [
                {
                  text: "Level 3 Sun",
                  locale: "en",
                },
              ],
              tier: 3,
              level: 1400,
              groupSize: 4,
              requireFullParty: false,
              iconSrc: "",
              bannerSrc: "",
            },
          ],
        },
      ],
    },
    {
      name: [
        {
          text: "Guardian Raid",
          locale: "en",
        },
      ],
      contentGroups: [
        {
          name: [
            {
              text: "Raid Level 1",
              locale: "en",
            },
          ],
          contents: [
            {
              name: [
                {
                  text: "Ur'nil",
                  locale: "en",
                },
              ],
              tier: 1,
              level: 302,
              groupSize: 4,
              requireFullParty: false,
              iconSrc: "",
              bannerSrc: "",
            },
            {
              name: [
                {
                  text: "Lumerus",
                  locale: "en",
                },
              ],
              tier: 1,
              level: 340,
              groupSize: 4,
              requireFullParty: false,
              iconSrc: "",
              bannerSrc: "",
            },
            {
              name: [
                {
                  text: "Icy Legoros",
                  locale: "en",
                },
              ],
              tier: 1,
              level: 380,
              groupSize: 4,
              requireFullParty: false,
              iconSrc: "",
              bannerSrc: "",
            },
            {
              name: [
                {
                  text: "Vertus",
                  locale: "en",
                },
              ],
              tier: 1,
              level: 420,
              groupSize: 4,
              requireFullParty: false,
              iconSrc: "",
              bannerSrc: "",
            },
          ],
        },
        {
          name: [
            {
              text: "Raid Level 2",
              locale: "en",
            },
          ],
          contents: [
            {
              name: [
                {
                  text: "Chromanium",
                  locale: "en",
                },
              ],
              tier: 1,
              level: 460,
              groupSize: 4,
              requireFullParty: false,
              iconSrc: "",
              bannerSrc: "",
            },
            {
              name: [
                {
                  text: "Nacrasena",
                  locale: "en",
                },
              ],
              tier: 1,
              level: 500,
              groupSize: 4,
              requireFullParty: false,
              iconSrc: "",
              bannerSrc: "",
            },
            {
              name: [
                {
                  text: "Flame Fox Yoho",
                  locale: "en",
                },
              ],
              tier: 1,
              level: 540,
              groupSize: 4,
              requireFullParty: false,
              iconSrc: "",
              bannerSrc: "",
            },
            {
              name: [
                {
                  text: "Tytalos",
                  locale: "en",
                },
              ],
              tier: 1,
              level: 580,
              groupSize: 4,
              requireFullParty: false,
              iconSrc: "",
              bannerSrc: "",
            },
          ],
        },
        {
          name: [
            {
              text: "Raid Level 3",
              locale: "en",
            },
          ],
          contents: [
            {
              name: [
                {
                  text: "Dark Legoros",
                  locale: "en",
                },
              ],
              tier: 2,
              level: 802,
              groupSize: 4,
              requireFullParty: false,
              iconSrc: "",
              bannerSrc: "",
            },
            {
              name: [
                {
                  text: "Helgaia",
                  locale: "en",
                },
              ],
              tier: 2,
              level: 840,
              groupSize: 4,
              requireFullParty: false,
              iconSrc: "",
              bannerSrc: "",
            },
            {
              name: [
                {
                  text: "Calventus",
                  locale: "en",
                },
              ],
              tier: 2,
              level: 880,
              groupSize: 4,
              requireFullParty: false,
              iconSrc: "",
              bannerSrc: "",
            },
            {
              name: [
                {
                  text: "Achates",
                  locale: "en",
                },
              ],
              tier: 2,
              level: 920,
              groupSize: 4,
              requireFullParty: false,
              iconSrc: "",
              bannerSrc: "",
            },
          ],
        },
        {
          name: [
            {
              text: "Raid Level 4",
              locale: "en",
            },
          ],
          contents: [
            {
              name: [
                {
                  text: "Frost Helgaia",
                  locale: "en",
                },
              ],
              tier: 2,
              level: 960,
              groupSize: 4,
              requireFullParty: false,
              iconSrc: "",
              bannerSrc: "",
            },
            {
              name: [
                {
                  text: "Lava Chromanium",
                  locale: "en",
                },
              ],
              tier: 2,
              level: 1000,
              groupSize: 4,
              requireFullParty: false,
              iconSrc: "",
              bannerSrc: "",
            },
            {
              name: [
                {
                  text: "Levanos",
                  locale: "en",
                },
              ],
              tier: 2,
              level: 1040,
              groupSize: 4,
              requireFullParty: false,
              iconSrc: "",
              bannerSrc: "",
            },
            {
              name: [
                {
                  text: "Alberhastic",
                  locale: "en",
                },
              ],
              tier: 2,
              level: 1080,
              groupSize: 4,
              requireFullParty: false,
              iconSrc: "",
              bannerSrc: "",
            },
          ],
        },
        {
          name: [
            {
              text: "Raid Level 5",
              locale: "en",
            },
          ],
          contents: [
            {
              name: [
                {
                  text: "Armored Nacrasena",
                  locale: "en",
                },
              ],
              tier: 3,
              level: 1302,
              groupSize: 4,
              requireFullParty: false,
              iconSrc: "",
              bannerSrc: "",
            },
            {
              name: [
                {
                  text: "Igrexion",
                  locale: "en",
                },
              ],
              tier: 3,
              level: 1340,
              groupSize: 4,
              requireFullParty: false,
              iconSrc: "",
              bannerSrc: "",
            },
            {
              name: [
                {
                  text: "Night Fox Yoho",
                  locale: "en",
                },
              ],
              tier: 3,
              level: 1370,
              groupSize: 4,
              requireFullParty: false,
              iconSrc: "",
              bannerSrc: "",
            },
            {
              name: [
                {
                  text: "Velganos",
                  locale: "en",
                },
              ],
              tier: 3,
              level: 1385,
              groupSize: 4,
              requireFullParty: false,
              iconSrc: "",
              bannerSrc: "",
            },
          ],
        },
      ],
    },
    {
      name: [
        {
          text: "Abyssal Dungeon",
          locale: "en",
        },
      ],
      contentGroups: [
        {
          name: [
            {
              text: "Ancient Elveria",
              locale: "en",
            },
          ],
          contents: [
            {
              name: [
                {
                  text: "Demon Beast Canyon",
                  locale: "en",
                },
              ],
              contentDifficulty: {
                name: [
                  {
                    text: "Normal",
                    locale: "en",
                  },
                ],
              },
              tier: 1,
              level: 340,
              groupSize: 4,
              requireFullParty: true,
              iconSrc: "",
              bannerSrc: "",
            },
            {
              name: [
                {
                  text: "Necromancer's Origin",
                  locale: "en",
                },
              ],
              contentDifficulty: {
                name: [
                  {
                    text: "Normal",
                    locale: "en",
                  },
                ],
              },
              tier: 1,
              level: 340,
              groupSize: 4,
              requireFullParty: true,
              iconSrc: "",
              bannerSrc: "",
            },
          ],
        },
        {
          name: [
            {
              text: "Phantom Palace",
              locale: "en",
            },
          ],
          contents: [
            {
              name: [
                {
                  text: "Hall of the Twisted Warlord",
                  locale: "en",
                },
              ],
              contentDifficulty: {
                name: [
                  {
                    text: "Normal",
                    locale: "en",
                  },
                ],
              },
              tier: 1,
              level: 460,
              groupSize: 4,
              requireFullParty: true,
              iconSrc: "",
              bannerSrc: "",
            },
            {
              name: [
                {
                  text: "Hildebrandt Palace",
                  locale: "en",
                },
              ],
              contentDifficulty: {
                name: [
                  {
                    text: "Normal",
                    locale: "en",
                  },
                ],
              },
              tier: 1,
              level: 460,
              groupSize: 4,
              requireFullParty: true,
              iconSrc: "",
              bannerSrc: "",
            },
          ],
        },
        {
          name: [
            {
              text: "Ark of Arrogance",
              locale: "en",
            },
          ],
          contents: [
            {
              name: [
                {
                  text: "Road of Lament",
                  locale: "en",
                },
              ],
              contentDifficulty: {
                name: [
                  {
                    text: "Normal",
                    locale: "en",
                  },
                ],
              },
              tier: 2,
              level: 840,
              groupSize: 4,
              requireFullParty: true,
              iconSrc: "",
              bannerSrc: "",
            },
            {
              name: [
                {
                  text: "Forge of Fallen Pride",
                  locale: "en",
                },
              ],
              contentDifficulty: {
                name: [
                  {
                    text: "Normal",
                    locale: "en",
                  },
                ],
              },
              tier: 2,
              level: 840,
              groupSize: 4,
              requireFullParty: true,
              iconSrc: "",
              bannerSrc: "",
            },
          ],
        },
        {
          name: [
            {
              text: "Gate of Paradise",
              locale: "en",
            },
          ],
          contents: [
            {
              name: [
                {
                  text: "Sea of Indolence",
                  locale: "en",
                },
              ],
              contentDifficulty: {
                name: [
                  {
                    text: "Normal",
                    locale: "en",
                  },
                ],
              },
              tier: 2,
              level: 960,
              groupSize: 8,
              requireFullParty: true,
              iconSrc: "",
              bannerSrc: "",
            },
            {
              name: [
                {
                  text: "Tranquil Karkosa",
                  locale: "en",
                },
              ],
              contentDifficulty: {
                name: [
                  {
                    text: "Normal",
                    locale: "en",
                  },
                ],
              },
              tier: 2,
              level: 960,
              groupSize: 8,
              requireFullParty: true,
              iconSrc: "",
              bannerSrc: "",
            },
            {
              name: [
                {
                  text: "Alaric's Sanctuary",
                  locale: "en",
                },
              ],
              contentDifficulty: {
                name: [
                  {
                    text: "Normal",
                    locale: "en",
                  },
                ],
              },
              tier: 2,
              level: 960,
              groupSize: 8,
              requireFullParty: true,
              iconSrc: "",
              bannerSrc: "",
            },
          ],
        },
        {
          name: [
            {
              text: "Oreha's Well",
              locale: "en",
            },
          ],
          contents: [
            {
              name: [
                {
                  text: "Aira's Oculus",
                  locale: "en",
                },
              ],
              contentDifficulty: {
                name: [
                  {
                    text: "Normal",
                    locale: "en",
                  },
                ],
              },
              tier: 3,
              level: 1325,
              groupSize: 4,
              requireFullParty: true,
              iconSrc: "",
              bannerSrc: "",
            },
            {
              name: [
                {
                  text: "Oreha Preveza",
                  locale: "en",
                },
              ],
              contentDifficulty: {
                name: [
                  {
                    text: "Normal",
                    locale: "en",
                  },
                ],
              },
              tier: 3,
              level: 1340,
              groupSize: 4,
              requireFullParty: true,
              iconSrc: "",
              bannerSrc: "",
            },
            {
              name: [
                {
                  text: "Aira's Oculus",
                  locale: "en",
                },
              ],
              contentDifficulty: {
                name: [
                  {
                    text: "Hard",
                    locale: "en",
                  },
                ],
              },
              tier: 3,
              level: 1370,
              groupSize: 4,
              requireFullParty: true,
              iconSrc: "",
              bannerSrc: "",
            },
            {
              name: [
                {
                  text: "Oreha Preveza",
                  locale: "en",
                },
              ],
              contentDifficulty: {
                name: [
                  {
                    text: "Hard",
                    locale: "en",
                  },
                ],
              },
              tier: 3,
              level: 1370,
              groupSize: 4,
              requireFullParty: true,
              iconSrc: "",
              bannerSrc: "",
            },
          ],
        },
      ],
    },
    {
      name: [
        {
          text: "Abyss Raid",
          locale: "en",
        },
      ],
      contentGroups: [
        {
          name: [
            {
              text: "Argos",
              locale: "en",
            },
          ],
          contents: [
            {
              name: [
                {
                  text: "Phase 1",
                  locale: "en",
                },
              ],
              contentDifficulty: {
                name: [
                  {
                    text: "Normal",
                    locale: "en",
                  },
                ],
              },
              tier: 3,
              level: 1370,
              groupSize: 8,
              requireFullParty: true,
              iconSrc: "",
              bannerSrc: "",
            },
            {
              name: [
                {
                  text: "Phase 2",
                  locale: "en",
                },
              ],
              contentDifficulty: {
                name: [
                  {
                    text: "Normal",
                    locale: "en",
                  },
                ],
              },
              tier: 3,
              level: 1385,
              groupSize: 8,
              requireFullParty: true,
              iconSrc: "",
              bannerSrc: "",
            },
            {
              name: [
                {
                  text: "Phase 3",
                  locale: "en",
                },
              ],
              contentDifficulty: {
                name: [
                  {
                    text: "Normal",
                    locale: "en",
                  },
                ],
              },
              tier: 3,
              level: 1400,
              groupSize: 8,
              requireFullParty: true,
              iconSrc: "",
              bannerSrc: "",
            },
          ],
        },
      ],
    },
  ];

  for (const contentTypeData of contents) {
    let contentType = undefined;

    const contentTypeEnName = await prisma.localizedText.findFirst({
      where: {
        text: contentTypeData.name.find((n) => n.locale === "en")?.text,
        locale: "en",
        contentTypeId: {
          not: null,
        },
      },
    });

    if (contentTypeEnName && contentTypeEnName.contentTypeId) {
      contentType = await prisma.contentType.findUnique({
        where: {
          id: contentTypeEnName.contentTypeId,
        },
      });
    } else {
      contentType = await prisma.contentType.create({ data: {} });
    }

    contentType = contentType as ContentType;

    for (const contentTypeNameData of contentTypeData.name) {
      const contentTypeName = await prisma.localizedText.findFirst({
        where: {
          locale: contentTypeNameData.locale,
          contentTypeId: contentType.id,
        },
      });

      if (
        contentTypeName &&
        contentTypeName.text !== contentTypeNameData.text
      ) {
        await prisma.localizedText.update({
          where: {
            id: contentTypeName.id,
          },
          data: {
            text: contentTypeNameData.text,
          },
        });
      } else if (!contentTypeName) {
        await prisma.localizedText.create({
          data: {
            text: contentTypeNameData.text,
            locale: contentTypeNameData.locale,
            contentTypeId: contentType.id,
          },
        });
      }
    }

    for (const [
      contentGroupOrder,
      contentGroupData,
    ] of contentTypeData.contentGroups.entries()) {
      const contentGroup = await prisma.contentGroup.upsert({
        where: {
          order_contentTypeId: {
            order: contentGroupOrder + 1,
            contentTypeId: contentType.id,
          },
        },
        update: {},
        create: {
          order: contentGroupOrder + 1,
          contentTypeId: contentType.id,
        },
      });

      for (const contentGroupNameData of contentGroupData.name) {
        const contentGroupName = await prisma.localizedText.findFirst({
          where: {
            locale: contentGroupNameData.locale,
            contentGroupId: contentGroup.id,
          },
        });

        if (
          contentGroupName &&
          contentGroupName.text !== contentGroupNameData.text
        ) {
          await prisma.localizedText.update({
            where: {
              id: contentGroupName.id,
            },
            data: {
              text: contentGroupNameData.text,
            },
          });
        } else if (!contentGroupName) {
          await prisma.localizedText.create({
            data: {
              text: contentGroupNameData.text,
              locale: contentGroupNameData.locale,
              contentGroupId: contentGroup.id,
            },
          });
        }
      }

      for (const [
        contentOrder,
        contentData,
      ] of contentGroupData.contents.entries()) {
        let content = await prisma.content.upsert({
          where: {
            order_contentGroupId: {
              order: contentOrder + 1,
              contentGroupId: contentGroup.id,
            },
          },
          update: {
            tier: contentData.tier,
            level: contentData.level,
            groupSize: contentData.groupSize,
            requireFullParty: contentData.requireFullParty,
            iconSrc: contentData.iconSrc || null,
            bannerSrc: contentData.bannerSrc || null,
          },
          create: {
            order: contentOrder + 1,
            tier: contentData.tier,
            level: contentData.level,
            groupSize: contentData.groupSize,
            requireFullParty: contentData.requireFullParty,
            iconSrc: contentData.iconSrc || null,
            bannerSrc: contentData.bannerSrc || null,
            contentGroupId: contentGroup.id,
          },
        });

        if (contentData.contentDifficulty) {
          let contentDifficulty = undefined;

          if (content.contentDifficultyId) {
            contentDifficulty = await prisma.contentDifficulty.findUnique({
              where: {
                id: content.contentDifficultyId,
              },
            });
          } else {
            const contentDifficultyEnName =
              await prisma.localizedText.findFirst({
                where: {
                  text: contentData.contentDifficulty.name.find(
                    (n) => n.locale === "en"
                  )?.text,
                  locale: "en",
                  contentDifficultyId: {
                    not: null,
                  },
                },
              });

            if (
              contentDifficultyEnName &&
              contentDifficultyEnName.contentDifficultyId
            ) {
              contentDifficulty = await prisma.contentDifficulty.findUnique({
                where: {
                  id: contentDifficultyEnName.contentDifficultyId as string,
                },
              });
            } else {
              contentDifficulty = await prisma.contentDifficulty.create({
                data: {},
              });
            }

            content = await prisma.content.update({
              where: {
                id: content.id,
              },
              data: {
                contentDifficultyId: contentDifficulty?.id,
              },
            });
          }

          contentDifficulty = contentDifficulty as ContentDifficulty;

          for (const contentDifficultyNameData of contentData.contentDifficulty
            .name) {
            const contentDifficultyName = await prisma.localizedText.findFirst({
              where: {
                locale: contentDifficultyNameData.locale,
                contentDifficultyId: contentDifficulty.id,
              },
            });

            if (
              contentDifficultyName &&
              contentDifficultyName.text !== contentDifficultyNameData.text
            ) {
              await prisma.localizedText.update({
                where: {
                  id: contentDifficultyName.id,
                },
                data: {
                  text: contentDifficultyNameData.text,
                },
              });
            } else if (!contentDifficultyName) {
              await prisma.localizedText.create({
                data: {
                  text: contentDifficultyNameData.text,
                  locale: contentDifficultyNameData.locale,
                  contentDifficultyId: contentDifficulty.id,
                },
              });
            }
          }
        }

        for (const contentNameData of contentData.name) {
          const contentName = await prisma.localizedText.findFirst({
            where: {
              locale: contentNameData.locale,
              contentId: content.id,
            },
          });

          if (contentName && contentName.text !== contentNameData.text) {
            await prisma.localizedText.update({
              where: {
                id: contentName.id,
              },
              data: {
                text: contentNameData.text,
              },
            });
          } else if (!contentName) {
            await prisma.localizedText.create({
              data: {
                text: contentNameData.text,
                locale: contentNameData.locale,
                contentId: content.id,
              },
            });
          }
        }
      }
    }
  }

  return json(
    await prisma.contentType.findMany({
      orderBy: {
        id: "asc",
      },
      select: {
        id: true,
        name: {
          orderBy: {
            locale: "asc",
          },
          select: {
            id: true,
            text: true,
            locale: true,
          },
        },
        contentGroups: {
          orderBy: {
            order: "asc",
          },
          select: {
            id: true,
            order: true,
            name: {
              orderBy: {
                locale: "asc",
              },
              select: {
                id: true,
                text: true,
                locale: true,
              },
            },
            contents: {
              orderBy: {
                order: "asc",
              },
              select: {
                contentDifficulty: {
                  select: {
                    name: {
                      orderBy: {
                        locale: "asc",
                      },
                      select: {
                        text: true,
                        locale: true,
                      },
                    },
                  },
                },
                name: {
                  orderBy: {
                    locale: "asc",
                  },
                  select: {
                    text: true,
                    locale: true,
                  },
                },
              },
            },
          },
        },
      },
    })
  );
};

export default function ContentPage() {
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
