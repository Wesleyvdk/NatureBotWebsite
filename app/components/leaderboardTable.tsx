import * as React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import type { DiscordUser } from "~/auth.server";
import { json } from "@remix-run/node";

import { db } from "~/db.server";

export default function LeaderboardTable({ users }: { users: leaderboard[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">name</TableHead>
          <TableHead>level</TableHead>
          <TableHead>exp</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user: any) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.level}</TableCell>
            <TableCell>{user.exp}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
