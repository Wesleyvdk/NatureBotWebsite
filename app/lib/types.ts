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
  permissions: string;
  permissions_new: string;
  features: string[];
  approximate_member_count: number;
  approximate_presence_count: number;
}

interface Role {
  id: string;
  name: string;
  color: number;
  hoist: boolean;
  icon?: string;
  unicode_emoji?: string;
  position: number;
  permissions: string;
  managed: boolean;
  mentionable: boolean;
  tags?: RoleTags;
  flags: number;
}

interface RoleTags {
  bot_id?: string;
  integration_id?: string;
  premium_subscriber?: null;
  subscription_listing_id?: string;
  available_for_purchase?: null;
  guild_connections?: null;
}
