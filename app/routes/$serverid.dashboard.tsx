// app/routes/dashboard.tsx
import type { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData, useParams } from "@remix-run/react";
import { auth } from "~/auth.server";
import Nav from "~/components/nav";
import { db } from "~/db.server";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "~/components/ui/table";
import { LineChart, EventProps } from "@tremor/react";
import { useState } from "react";

export let loader: LoaderFunction = async ({ request, params }) => {
  const settings = await db.settings.findMany({
    where: {
      guildid: "929352993655124000",
    },
  });
  const guildid = params.serverid;
  const authenticated = await auth.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  return { authenticated, settings, guildid };
};

export default function DashboardPage() {
  const { authenticated, settings, guildid } = useLoaderData<typeof loader>();
  const params = useParams();
  const [value, setValue] = useState<EventProps>(null);
  console.log(params);
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <Nav />
      <div className="flex flex-col w-full min-h-screen ">
        <main className="flex-1 container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <section className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 ">Bot Settings</h2>
              <Button size="icon" variant="ghost" asChild>
                <Link to={`/${guildid}/settings`}>
                  <SettingsIcon className="w-5 h-5 text-gray-500 " />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 ">Moderation</span>
                <Switch defaultChecked id="moderation" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 ">Welcomer</span>
                <Switch id="welcomer" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 ">Leveling</span>
                <Switch defaultChecked id="leveling" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 ">Logging</span>
                <Switch id="logging" />
              </div>
            </div>
          </section>
          <section className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 ">
                Server Leaderboard
              </h2>
              <Button size="icon" variant="ghost">
                <TrophyIcon className="w-5 h-5 text-gray-500 " />
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Messages</TableHead>
                  <TableHead>Voice Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>1</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <img
                        alt="Avatar"
                        className="rounded-full"
                        height="32"
                        src="https://avatar.vercel.sh/leerob"
                        style={{
                          aspectRatio: "32/32",
                          objectFit: "cover",
                        }}
                        width="32"
                      />
                      <span>John Doe</span>
                    </div>
                  </TableCell>
                  <TableCell>12,345</TableCell>
                  <TableCell>120 hrs</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <img
                        alt="Avatar"
                        className="rounded-full"
                        height="32"
                        src="https://avatar.vercel.sh/leerob"
                        style={{
                          aspectRatio: "32/32",
                          objectFit: "cover",
                        }}
                        width="32"
                      />
                      <span>Jane Smith</span>
                    </div>
                  </TableCell>
                  <TableCell>10,987</TableCell>
                  <TableCell>100 hrs</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>3</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <img
                        alt="Avatar"
                        className="rounded-full"
                        height="32"
                        src="https://avatar.vercel.sh/leerob"
                        style={{
                          aspectRatio: "32/32",
                          objectFit: "cover",
                        }}
                        width="32"
                      />
                      <span>Bob Johnson</span>
                    </div>
                  </TableCell>
                  <TableCell>8,765</TableCell>
                  <TableCell>80 hrs</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </section>
          <section className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 ">
                Level Leaderboard
              </h2>
              <Button size="icon" variant="ghost">
                <TrophyIcon className="w-5 h-5 text-gray-500 " />
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>XP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>1</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <img
                        alt="Avatar"
                        className="rounded-full"
                        height="32"
                        src="https://avatar.vercel.sh/leerob"
                        style={{
                          aspectRatio: "32/32",
                          objectFit: "cover",
                        }}
                        width="32"
                      />
                      <span>John Doe</span>
                    </div>
                  </TableCell>
                  <TableCell>50</TableCell>
                  <TableCell>100,000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <img
                        alt="Avatar"
                        className="rounded-full"
                        height="32"
                        src="https://avatar.vercel.sh/leerob"
                        style={{
                          aspectRatio: "32/32",
                          objectFit: "cover",
                        }}
                        width="32"
                      />
                      <span>Jane Smith</span>
                    </div>
                  </TableCell>
                  <TableCell>45</TableCell>
                  <TableCell>80,000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>3</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <img
                        alt="Avatar"
                        className="rounded-full"
                        height="32"
                        src="https://avatar.vercel.sh/leerob"
                        style={{
                          aspectRatio: "32/32",
                          objectFit: "cover",
                        }}
                        width="32"
                      />
                      <span>Bob Johnson</span>
                    </div>
                  </TableCell>
                  <TableCell>40</TableCell>
                  <TableCell>60,000</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </section>
          <section className="bg-white rounded-lg shadow p-6 col-span-1 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 ">
                Activity Graphs
              </h2>
              <div className="flex items-center gap-4">
                <Button size="icon" variant="ghost">
                  <CalendarIcon className="w-5 h-5 text-gray-500 " />
                </Button>
                <Button size="icon" variant="ghost">
                  <DownloadIcon className="w-5 h-5 text-gray-500 " />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-gray-700  mb-2">Message Activity</h3>
                <LineChart
                  index="date"
                  categories={["2022", "2023"]}
                  colors={["blue", "red"]}
                  yAxisWidth={30}
                  onValueChange={(v) => setValue(v)}
                  connectNulls={true}
                  data={chartdata}
                  className="aspect-[16/9]"
                />
              </div>
              <div>
                <h3 className="text-gray-700  mb-2">Voice Activity</h3>
                <LineChart
                  index="date"
                  categories={["2022", "2023"]}
                  colors={["blue", "red"]}
                  yAxisWidth={30}
                  onValueChange={(v) => setValue(v)}
                  connectNulls={true}
                  data={chartdata}
                  className="aspect-[16/9]"
                />
              </div>
            </div>
          </section>
          <section className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 ">
                Member Growth
              </h2>
              <Button size="icon" variant="ghost">
                <UsersIcon className="w-5 h-5 text-gray-500 " />
              </Button>
            </div>
            <LineChart
              index="date"
              categories={["2022", "2023"]}
              colors={["blue", "red"]}
              yAxisWidth={30}
              onValueChange={(v) => setValue(v)}
              connectNulls={true}
              data={chartdata}
              className="aspect-[16/9]"
            />
          </section>
        </main>
      </div>
    </div>
  );
}

const chartdata = [
  {
    date: "Jan 23",
    2022: 45,
    2023: 78,
  },
  {
    date: "Feb 23",
    2022: 52,
    2023: 71,
  },
  {
    date: "Mar 23",
    2022: 48,
    2023: 80,
  },
  {
    date: "Apr 23",
    2022: 61,
    2023: 65,
  },
  {
    date: "May 23",
    2022: 55,
    2023: 58,
  },
  {
    date: "Jun 23",
    2022: 67,
    2023: 62,
  },
  {
    date: "Jul 23",
    2022: 60,
    2023: 54,
  },
  {
    date: "Aug 23",
    2022: 72,
    2023: 49,
  },
  {
    date: "Sep 23",
    2022: 65,
    2023: 52,
  },
  {
    date: "Oct 23",
    2022: 68,
    2023: null,
  },
  {
    date: "Nov 23",
    2022: 74,
    2023: null,
  },
  {
    date: "Dec 23",
    2022: 71,
    2023: null,
  },
];

function CalendarIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

function DiscIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function DownloadIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  );
}

function SettingsIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function TrophyIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}

function UsersIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
