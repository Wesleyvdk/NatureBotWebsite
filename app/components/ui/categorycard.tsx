import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Card, Metric, Text, Title, BarList, Flex, Grid } from "@tremor/react";
/* import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"; */
import { Switch } from "~/components/ui/switch";

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

export default function CategoryCard({ commands }: { commands: Command[] }) {
  const categoryMap = new Map<
    string,
    { totalUsage: number; commands: CommandSummary[] }
  >();

  commands.forEach((command) => {
    if (!categoryMap.has(command.category)) {
      categoryMap.set(command.category, { totalUsage: 0, commands: [] });
    }
    const categoryData = categoryMap.get(command.category);
    categoryData?.commands.push({
      name: command.command_name,
      value: command.usage_count,
    });
    categoryData!.totalUsage += command.usage_count;
  });

  const data: CategoryData[] = Array.from(categoryMap).map(
    ([category, { totalUsage, commands }]) => ({
      category: category,
      stat: totalUsage.toString(),
      data: commands,
    })
  );
  return (
    /*     <div className="grid gap-6 grid-cols-3 auto-rows-auto">
      {data.map((item) => (
        <Card key={item.category}>
          <CardHeader>
            <CardTitle>{item.category}</CardTitle>
          </CardHeader>

          <CardContent className="justify-content">
            <p>{item.stat}</p>
            <p>Total Times Used</p>

            <div className="justify-start items-baseline mt-6">
              <p>Commands</p>
              <p className="text-right">Times Used</p>
            </div>
            <BarList
              data={item.data}
              value={(number: number) =>
                Intl.NumberFormat("us").format(number).toString()
              }
              className="mt-2"
            />
          </CardContent>
        </Card>
      ))}
    </div> */
    <Grid numItemsSm={2} numItemsLg={3} className="gap-6">
      {data.map((item) => (
        <Card key={item.category}>
          <Title>{item.category}</Title>
          <Flex
            justifyContent="start"
            alignItems="baseline"
            className="space-x-2"
          >
            <Metric>{item.stat}</Metric>
            <Text>Total Times Used</Text>
          </Flex>
          <Flex className="mt-6">
            <Text>Commands</Text>
            <Text className="text-right">Times Used</Text>
          </Flex>
          <BarList
            data={item.data}
            valueFormatter={(number: number) =>
              Intl.NumberFormat("us").format(number).toString()
            }
            className="mt-2"
          />
        </Card>
      ))}
    </Grid>
  );
}
