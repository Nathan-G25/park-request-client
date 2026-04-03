import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from './ui/chart'
import { Bar, BarChart, XAxis, YAxis } from 'recharts'

const chartConfig = {
  zone: { label: "zone", color: "#3b82f6" },
} satisfies ChartConfig;


// const chartData = [
//   { zone: "Downtown", utilization: 87 },
//   { zone: "Business", utilization: 92 },
//   { zone: "Residential", utilization: 65 },
//   { zone: "Waterfront", utilization: 78 },
//   { zone: "Academic", utilization: 71 },
//   { zone: "Airport", utilization: 45 },
// ];

const ZoneUtilizationChart = (zoneUtilization: Array<{ zone: string; utilization: number }>) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className=' font-semibold'>Zone Utilization</CardTitle>
        <CardDescription className='text-sm text-gray-500'>Average occupancy by zone</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={zoneUtilization}
            layout="vertical"
            margin={{
              left: -20,
            }}
          >
            <XAxis type="number" dataKey="utilization" />
            <YAxis
              dataKey="zone"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={true}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="utilization" fill="var(--color-zone)" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default ZoneUtilizationChart