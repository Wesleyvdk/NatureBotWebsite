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
