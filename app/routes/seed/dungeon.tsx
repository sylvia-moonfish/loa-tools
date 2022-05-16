import type { LoaderFunction } from "@remix-run/node";
import { ContentCategory, ContentType } from "@prisma/client";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { prisma } from "~/db.server";
import { requireUser } from "~/session.server";
import { downloadFile, parseDOM } from "~/utils.server";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request);
  if (user.discordId !== "288935284014448650") return redirect("/");

  const contents = [
    { a: "dungeons" },
    { a: "chaosruins" },
    { a: "towers" },
    { a: "raids", type: "daily" },
    { a: "raids", type: "weekly" },
    { a: "raids", type: "abyss" },
    { a: "abyssdungeons", type: "common" },
    { a: "abyssdungeons", type: "challenge" },
    { a: "abyssdungeons", type: "commanders" },
  ];
  const categoryMap: any = {
    dungeons: ContentCategory.DUNGEONS,
    chaosruins: ContentCategory.CHAOS_RUINS,
    towers: ContentCategory.TOWERS,
    raids: ContentCategory.RAIDS,
    abyssdungeons: ContentCategory.ABYSS_DUNGEONS,
  };
  const typeMap: any = {
    daily: ContentType.DAILY,
    weekly: ContentType.WEEKLY,
    abyss: ContentType.ABYSS,
    common: ContentType.COMMON,
    challenge: ContentType.CHALLENGE,
    commanders: ContentType.COMMANDERS,
  };
  const languages = ["us", "kr"];
  const locales: any = {
    us: "en",
    kr: "ko",
  };
  const partySizeKeywordByLanguage: any = {
    us: "Party size",
    kr: "그룹 규모",
  };
  const data: any = {};
  const queryStat: any = {};

  for (let contentIndex = 0; contentIndex < contents.length; contentIndex++) {
    const content = contents[contentIndex];

    for (
      let languageIndex = 0;
      languageIndex < languages.length;
      languageIndex++
    ) {
      const language = languages[languageIndex];

      const payload = await (
        await fetch(
          `https://lostarkcodex.com/query.php?a=${content.a}&${
            content.type ? `type=${content.type}&` : ""
          }l=${language}`,
          { method: "GET" }
        )
      ).json();

      if (!queryStat[contentIndex.toString()]) {
        queryStat[contentIndex.toString()] = {
          content,
        };
      }

      queryStat[contentIndex.toString()][language] = {
        unparsedCount: payload.aaData.length,
      };

      const parsedPayload = payload.aaData
        .map((aaData: any) => {
          // data[0] -> id column
          // data[1] -> icon column <div class="iconset_wrapper_big"><a href="/kr/zone/10012/"><div class="icon_wrapper_big">[img src="/icons/minimap_symbol_3.webp" alt="icon" class="qtooltip  icon_grade_-1 list_icon_big" data-id="zone--10012"]</div></a><div class=" sub_icon"></div></div>
          // data[2] -> title column <a href="/kr/dungeon/10012/" class="qtooltip item_grade_-1" data-id="dungeon--10012" data-enchant="0"><b><span></span>요즈문드</b></a>
          // data[3] -> level column
          // data[4] -> conditions column <div class="text-center"><div class="stat_cell"><div class="condition_name">수평</div><div class="condition_value">1+</div></div><br><div class="stat_cell"><div class="condition_name">그룹 규모</div><div class="condition_value">1</div></div></div>
          let groupSizeNameEl: Element | undefined = undefined;
          let groupSize = undefined;

          parseDOM(aaData[4])
            .window.document.querySelectorAll("div .condition_name")
            .forEach((e) => {
              if (e.textContent === partySizeKeywordByLanguage[language]) {
                groupSizeNameEl = e;
              }
            });

          if (groupSizeNameEl) {
            groupSize = (
              groupSizeNameEl as Element
            ).parentElement?.querySelector("div .condition_value")?.textContent;

            if (groupSize === "4" || groupSize === "8") {
              groupSize = parseInt(groupSize);
            } else if (groupSize === "1 ~ 4") {
              groupSize = 4;
            } else {
              groupSize = undefined;
            }
          }

          return {
            groupSize,
            id: aaData[0] ?? undefined,
            imgSrc:
              parseDOM(
                aaData[1].replace("[", "<").replace("]", ">")
              ).window.document.querySelector("img")?.src ?? undefined,
            level: aaData[3] ?? undefined,
            name:
              parseDOM(aaData[2]).window.document.querySelector("a")
                ?.textContent ?? undefined,
          };
        })
        .filter(
          (parsed: any) =>
            parsed.groupSize &&
            typeof parsed.id !== "undefined" &&
            parsed.imgSrc &&
            typeof parsed.level !== "undefined" &&
            parsed.name
        );

      queryStat[contentIndex.toString()][language].parsedCount =
        parsedPayload.length;
      queryStat[contentIndex.toString()][language].parsedIds =
        parsedPayload.map((parsed: any) => parsed.id);

      parsedPayload.forEach((parsed: any) => {
        if (!data[parsed.id.toString()]) {
          data[parsed.id.toString()] = {
            content: {
              category: content.a,
              type: content.type,
            },
            groupSize: undefined,
            id: undefined,
            imgSrc: undefined,
            level: undefined,
            name: {},
          };
        }

        data[parsed.id.toString()].groupSize = parsed.groupSize;
        data[parsed.id.toString()].id = parsed.id;
        data[parsed.id.toString()].imgSrc = parsed.imgSrc;

        if (parsed.level) {
          data[parsed.id.toString()].level = parsed.level;
        }

        data[parsed.id.toString()].name[language] = parsed.name;
      });
    }
  }

  const dataKeys = Object.keys(data);

  for (let i = 0; i < dataKeys.length; i++) {
    if (data[dataKeys[i]].imgSrc) {
      await downloadFile(
        `https://lostarkcodex.com${data[dataKeys[i]].imgSrc}`,
        `~/../public${data[dataKeys[i]].imgSrc}`
      );
    }
  }

  for (let i = 0; i < dataKeys.length; i++) {
    const contentData = data[dataKeys[i]];

    const content = await prisma.content.upsert({
      where: {
        contentId: contentData.id,
      },
      update: {
        contentCategory: categoryMap[contentData.content.category],
        contentType: typeMap[contentData.content.type] ?? undefined,
        level: contentData.level,
        groupSize: contentData.groupSize,
        imgSrc: contentData.imgSrc,
      },
      create: {
        contentId: contentData.id,
        contentCategory: categoryMap[contentData.content.category],
        contentType: typeMap[contentData.content.type] ?? undefined,
        level: contentData.level,
        groupSize: contentData.groupSize,
        imgSrc: contentData.imgSrc,
      },
    });

    const langKeys = Object.keys(contentData.name);

    for (let j = 0; j < langKeys.length; j++) {
      const lang = langKeys[j];
      const locale = locales[lang];
      const name = contentData.name[lang];

      const contentName = await prisma.contentName.findFirst({
        where: {
          contentId: content.id,
          locale,
        },
      });

      if (contentName && contentName.name !== name) {
        await prisma.contentName.update({
          data: {
            name,
          },
          where: {
            id: contentName.id,
          },
        });
      } else {
        await prisma.contentName.create({
          data: {
            name,
            locale,
            contentId: content.id,
          },
        });
      }
    }
  }

  return json({ data, queryStat });
};

export default function Dungeon() {
  const data = useLoaderData();
  console.log(data);

  return <div />;
}
