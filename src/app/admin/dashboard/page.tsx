"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

const Dashboard = () => {
  // useEffect(() => {
  //   async function refreshSession() {
  //     const sessionData = localStorage.getItem("supabaseSession");
  //     const session = sessionData ? JSON.parse(sessionData) : null;
  //     if (session) {
  //       const { data, error } = await supabase.auth.refreshSession(session);

  //       if (data) {
  //         // Update session data in local storage
  //         localStorage.setItem("supabaseSession", JSON.stringify(data.session));
  //       } else if (error) {
  //         // Handle error
  //         console.error("Error refreshing session:", error);
  //       }
  //     }
  //   }

  //   // Call refreshSession when the dashboard page loads
  //   refreshSession();

  //   // Set up a periodic refresh (e.g., every 9 days)
  //   const intervalId = setInterval(refreshSession, 9 * 24 * 60 * 60 * 1000); // 9 days in milliseconds

  //   // Clean up the interval when the component unmounts
  //   return () => clearInterval(intervalId);
  // }, []);

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
};

export default Dashboard;
