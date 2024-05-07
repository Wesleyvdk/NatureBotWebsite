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

export default function LevelSettings({ roles }: { roles: Role[] }) {
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
              <div className="grid grid-cols-[1fr_auto] items-center gap-4">
                <div>
                  <Label htmlFor="level-1">Level 1 Role</Label>
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
                  min="1"
                  type="number"
                  className="mt-7"
                />
              </div>
              <Button className="w-full" variant="outline">
                Add More Levels
              </Button>
            </div>
          </CardContent>
          <CardFooter className="border-t p-4">
            <Button>Save Changes</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
