import { Button } from "~/components/ui/button";
import { Card, Metric, Text, Title, BarList, Flex, Grid } from "@tremor/react";

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
