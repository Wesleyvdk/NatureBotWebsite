interface leaderboard {
  id: number;
  name: string;
  exp: number;
  level: number;
}

interface Command {
  command_id: number;
  command_name: string;
  category: string;
  usage_count: number;
  last_used: Date;
}

interface CommandSummary {
  name: string;
  value: number;
}

interface CategoryData {
  category: string;
  stat: string;
  data: CommandSummary[];
}

interface Settings {
  id: number;
  command: string;
  category: string;
  turnedOn: boolean;
}
interface SettingsSummary {
  name: string;
  value: boolean;
}

interface SettingsData {
  category: string;
  data: SettingsSummary[];
}

type CommandStates = {
  [key: string]: boolean; // Or the appropriate type of 'command.value'
};

interface Guild {
  id: string;
  name: string;
  icon: string;
  owner: boolean;
}
