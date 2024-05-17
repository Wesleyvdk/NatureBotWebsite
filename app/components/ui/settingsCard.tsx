import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Switch } from "~/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import LevelSettings from "../settings/level";
import { Label } from "./label";

export default function SettingsCard({
  guildid,
  settings,
  roles,
}: {
  guildid: string;
  settings: Settings[];
  roles: Role[];
}) {
  const categoryMap = new Map<string, { settings: SettingsSummary[] }>();

  settings.forEach((command) => {
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
  return (
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
                    <Switch id={command.name} />
                  </div>
                ))}
              </div>
              <LevelSettings roles={roles} guildid={guildid} />
            </div>
          ) : (
            <div className="grid grid-cols-2">
              {item.data.map((command) => (
                <div
                  key={command.name}
                  className="flex items-center justify-between space-x-2 py-4"
                >
                  <Label htmlFor={command.name}>{command.name}</Label>
                  <Switch id={command.name} />
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      ))}
    </Tabs>
  );

  /* <Grid numItemsSm={2} numItemsLg={3} className="gap-6">
      {data.map((item) => (
        <Card key={item.category}>
          <CardHeader>
            <CardTitle>{item.category}</CardTitle>
          </CardHeader>
          {item.data.map((command) => (
            <CardContent key={command.name} className="flex mt-6">
              <p>{command.name}</p>
              <div className="justify-end items-baseline space-x-2">
                <Switch
                  key={command.name}
                  checked={commandState[command.name]}
                  onChange={(newValue) =>
                    handleSwitchChange(command.name, newValue)
                  }
                  className="relative inline-flex h-6 w-11 items-center rounded-full ui-checked:bg-blue-600 ui-not-checked:bg-gray-200 "
                >
                  <span className="sr-only">Enable command</span>
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white transition ui-checked:translate-x-6 ui-not-checked:translate-x-1" />
                </Switch>
              </div>
            </CardContent>
          ))}
        </Card>
      ))}
    </Grid> */
}
