import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { db } from "~/db.server";
import { ActionFunctionArgs } from "@remix-run/node";
import saveChanges from "~/lib/updateLevelRoles";
import { Form } from "@remix-run/react";

export default function LevelSettings({
  roles,
  guildid,
}: {
  roles: Role[];
  guildid: string;
}) {
  const [levels, setLevels] = useState([{ role: "", level: 1 }]);
  const handleRoleChange = (
    e: React.FormEvent<HTMLSpanElement>,
    index: number
  ) => {
    console.log(e);
    const newLevels = [...levels];
    /* newLevels[index].role = e.target; */
    /* setLevels(newLevels); */
  };
  const handleLevelChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newLevels = [...levels];
    newLevels[index].level = parseInt(e.target.value);
    setLevels(newLevels);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold">Roles</h2>
      <p className="text-gray-500">
        Configure custom level roles and the levels at which members receive
        them.
      </p>
      <div className="mt-6 grid gap-4">
        <Card className="rounded-lg border bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Level Roles</CardTitle>
            <CardDescription>
              Assign custom roles based on member levels.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <Form action="/settings">
                {levels.map((level, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[1fr_auto] items-center gap-4"
                  >
                    <div>
                      <Label htmlFor="level-1">Level {index + 1} Role</Label>
                      {/* <Input id="level-1" placeholder="Enter role name" /> */}
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem
                              key={role.id}
                              value={role.name}
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
                      name="level"
                      min="1"
                      type="number"
                      className="mt-7"
                    />
                  </div>
                ))}
              </Form>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => setLevels([...levels, { role: "", level: 1 }])}
              >
                Add More Levels
              </Button>
            </div>
          </CardContent>
          <CardFooter className="border-t p-4">
            <Button type="submit">Save Changes</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
