import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export default function ServerSelection({
  commonGuilds,
}: {
  commonGuilds: Guild[];
}) {
  return (
    <div className="max-w-sm mx-auto space-y-6">
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Server" />
        </SelectTrigger>
        <SelectContent>
          {commonGuilds.map((guild: Guild, index: number) => (
            <SelectItem key={guild.id} value={guild.name}>
              {guild.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
