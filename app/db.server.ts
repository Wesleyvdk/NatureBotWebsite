import { PrismaClient } from "@prisma/client";
import { singleton } from "./singleton.server";

export const db = singleton("prisma", () => new PrismaClient());

export async function updateSettings(
  guildId: string,
  switchState: boolean,
  command: string
) {
  const state = switchState ? 1 : 0;
  const setting = await db.settings.update({
    where: {
      id: `${guildId}${command}`,
    },
    data: { turnedOn: state },
  });
}
