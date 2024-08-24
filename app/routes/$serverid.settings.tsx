import type { ActionFunctionArgs, LoaderFunction } from "@remix-run/node";
import { auth } from "~/auth.server";
import Nav from "~/components/nav";

import { db } from "~/db.server";
import { Form, json, redirect, useLoaderData } from "@remix-run/react";
import SettingsCard from "~/components/ui/settingsCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import React, { useState } from "react";
import saveChanges from "~/lib/updateLevelRoles";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const mongoClient = new MongoClient(process.env.MONGODB_DATABASE_URL);

export async function action({ params, request }: ActionFunctionArgs) {
  const formData = await request.formData();
  for (const [key, value] of formData) {
    console.log(key, value);
  }
  /* const levels: any = formData.map((_, index) => {
    const role = formData.get(`role-${index}`)! as string;
    const level = formData.get(`level-${index}`)! as string;
    return { role, level: parseInt(level) };
  });
  console.log(levels); */
  const guildid: string = params.serverid!;
  //console.log(role, level);
  //await saveChanges(guildid, role, parseInt(level));
  return redirect(`/${params.serverid}/settings`);
}

export let loader: LoaderFunction = async ({ request, params }) => {
  /*   const settings = await db.settings.findMany({
    where: {
      guildid: "929352993655124000",
    },
  }); */
  const guildid: string | undefined = params.serverid;
  await mongoClient.connect();
  const settings = await mongoClient
    .db("Aylani")
    .collection(`${guildid}Settings`)
    .find({})
    .toArray();
  const authenticated = await auth.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const roles: Role[] = await fetchRoles(guildid);
  return { authenticated, guildid, settings, roles };
};

export default function LeaderboardPage() {
  const { authenticated, guildid, settings, roles } =
    useLoaderData<typeof loader>();

  const categoryMap = new Map<string, { settings: SettingsSummary[] }>();

  settings.forEach((command: any) => {
    if (!categoryMap.has(command.category)) {
      categoryMap.set(command.category, { settings: [] });
    }
    const categoryData = categoryMap.get(command.category);
    categoryData?.settings.push({
      name: command.command,
      value: command.turnedOn,
    });
  });

  const data: SettingsData[] = Array.from(categoryMap).map(
    ([category, { settings }]) => ({
      category: category,
      data: settings,
    })
  );
  const [commandState, setCommandState] = React.useState<CommandStates>({});

  React.useEffect(() => {
    let initialState: CommandStates = {};
    data.forEach((item) => {
      item.data.forEach((command) => {
        initialState[command.name] = command.value;
      });
    });
    setCommandState(initialState);
  }, [data]);

  const handleSwitchChange = (commandName: any, newValue: boolean) => {
    setCommandState((prevStates) => {
      // Create a new object instead of mutating the existing one
      return { ...prevStates, [commandName]: newValue };
    });
  };

  const [levels, setLevels] = useState([{ role: "", level: 1 }]);
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <Nav />
      <main className="p-4 md:p-10 mx-auto max-w-7xl">
        {/* <SettingsCard guildid={guildid} settings={settings} roles={roles} /> */}
        <Tabs defaultValue={data[0].category} className="w-[400px]">
          <TabsList>
            {data.map((item) => (
              <TabsTrigger key={item.category} value={item.category}>
                {item.category}
              </TabsTrigger>
            ))}
          </TabsList>
          {data.map((item) => (
            <TabsContent key={item.category} value={item.category}>
              {item.category === "levels" ? (
                <div>
                  <div className="grid grid-cols-2">
                    {item.data.map((command) => (
                      <div
                        key={command.name}
                        className="flex items-center justify-between space-x-2 py-4"
                      >
                        <Label htmlFor={command.name}>{command.name}</Label>
                        <Switch id={command.name} name={command.name} />
                      </div>
                    ))}
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold">Roles</h2>
                    <p className="text-gray-500">
                      Configure custom level roles and the levels at which
                      members receive them.
                    </p>
                    <div className="mt-6 grid gap-4">
                      <Form method="post">
                        <Card className="rounded-lg border bg-white shadow-sm">
                          <CardHeader>
                            <CardTitle>Level Roles</CardTitle>
                            <CardDescription>
                              Assign custom roles based on member levels.
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="grid gap-4">
                              {levels.map((level, index) => (
                                <div
                                  key={index}
                                  className="grid grid-cols-[1fr_auto] items-center gap-4"
                                >
                                  <div>
                                    <Label>Level {index + 1} Role</Label>
                                    {/* <Input id="level-1" placeholder="Enter role name" /> */}
                                    <Select name={`role-${index}`}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Role" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {roles.map((role: any) => (
                                          <SelectItem
                                            key={role.id}
                                            value={role.id}
                                            className={`bg-[${role.color}]`}
                                          >
                                            {role.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <Input
                                    defaultValue="1"
                                    name={`level-${index}`}
                                    min="1"
                                    type="number"
                                    className="mt-7"
                                  />
                                </div>
                              ))}

                              <Button
                                className="w-full"
                                variant="outline"
                                onClick={() =>
                                  setLevels([...levels, { role: "", level: 1 }])
                                }
                              >
                                Add More Levels
                              </Button>
                            </div>
                          </CardContent>
                          <CardFooter className="border-t p-4">
                            <Button type="submit">Save Changes</Button>
                          </CardFooter>
                        </Card>
                      </Form>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2">
                  {item.data.map((command) => (
                    <div
                      key={command.name}
                      className="flex items-center justify-between space-x-2 py-4"
                    >
                      <Label htmlFor={command.name}>{command.name}</Label>
                      <Switch id={command.name} name={command.name} />
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
}

async function fetchRoles(guildid: string | undefined) {
  try {
    let roles: Role[] = await fetch(
      `https://discord.com/api/guilds/${guildid}/roles`,
      {
        headers: {
          Authorization: "Bot " + process.env.DISCORD_BOT_TOKEN,
          "Content-Type": "application/json",
        },
      }
    ).then((response) => response.json());

    return Array.isArray(roles) ? roles : [];
  } catch (error) {
    console.error(error);
    return [];
  }
}
