import { db } from "~/db.server";

export default async function saveChanges(
  guildid: string,
  role: string,
  level: number
) {
  db.levelRoles
    .create({
      data: {
        guildID: guildid,
        roleID: role,
        level: level,
      },
    })
    .then((res) => {
      return res;
    });
}
