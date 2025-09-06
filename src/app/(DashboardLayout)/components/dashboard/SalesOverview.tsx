import React from "react";
import { Select, MenuItem, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import dynamic from "next/dynamic";
import moment from "moment";
import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type Chat = {
  created_at: string;
  session_id: string;
};

type Props = {
  allchats: Chat[];
};

const getMonthOptions = (allchats: Chat[]) => {
  const months = Array.from(
    new Set(
      allchats.map((c) =>
        moment(c.created_at).startOf("month").format("YYYY-MM")
      )
    )
  );
  months.sort((a, b) => (a < b ? 1 : -1));
  return months;
};

const getChartData = (allchats: Chat[], selectedMonth: string) => {
  const filtered = allchats.filter(
    (c) => moment(c.created_at).format("YYYY-MM") === selectedMonth
  );

  const dateSessionMap: { [date: string]: Set<string> } = {};
  filtered.forEach((c) => {
    const date = moment(c.created_at).format("YYYY-MM-DD");
    if (!dateSessionMap[date]) dateSessionMap[date] = new Set<string>();
    dateSessionMap[date].add(c.session_id);
  });

  const dates = Object.keys(dateSessionMap).sort();
  const counts = dates.map((d) => dateSessionMap[d].size);

  return { dates, counts };
};

const getUniqueSessionsForMonth = (allchats: Chat[], targetMonth: string) => {
  const filtered = allchats.filter(
    (c) => moment(c.created_at).format("YYYY-MM") === targetMonth
  );

  const uniqueSessionIds = new Set(filtered.map((c) => c.session_id));
  return uniqueSessionIds.size;
};

const SalesOverview = ({ allchats }: Props) => {
  const currentMonth = moment().format("YYYY-MM");

  const monthOptions = getMonthOptions(allchats);
  const defaultMonth = monthOptions.includes(currentMonth)
    ? currentMonth
    : monthOptions[0] || "";

  const [month, setMonth] = React.useState(defaultMonth);

  React.useEffect(() => {
    const updatedMonth = monthOptions.includes(currentMonth)
      ? currentMonth
      : monthOptions[0] || "";
    setMonth(updatedMonth);
  }, [allchats.length]);

  const handleChange = (event: any) => setMonth(event.target.value);

  const { dates, counts } = getChartData(allchats, month);
  const totalSessions = getUniqueSessionsForMonth(allchats, month);

  const theme = useTheme();
  const primary = theme.palette.primary.main;

  const optionscolumnchart: ApexOptions = {
    chart: {
      type: "bar",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      foreColor: "#adb0bb",
      toolbar: { show: true },
      height: 370,
    },
    colors: [primary],
    plotOptions: {
      bar: {
        horizontal: false,
        barHeight: "60%",
        columnWidth: "42%",
        borderRadius: [6],
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "all",
      },
    },
    stroke: {
      show: true,
      width: 5,
      lineCap: "butt",
      colors: ["transparent"],
    },
    dataLabels: { enabled: false },
    legend: { show: false },
    grid: {
      borderColor: "rgba(0,0,0,0.1)",
      strokeDashArray: 3,
      xaxis: { lines: { show: false } },
    },
    yaxis: { tickAmount: 4 },
    xaxis: {
      categories: dates.map((d) => moment(d).format("DD/MMM")),
      axisBorder: { show: false },
    },
    tooltip: { theme: "dark", fillSeriesColor: false },
  };

  const seriescolumnchart = [{ name: "Sessions", data: counts }];

  return (
    <DashboardCard
      title="AI Chat Sessions Overview"
      action={
        <Select
          labelId="month-dd"
          id="month-dd"
          value={month}
          onChange={handleChange}
        >
          {monthOptions.map((m) => (
            <MenuItem key={m} value={m}>
              {moment(m, "YYYY-MM").format("MMMM YYYY")}
            </MenuItem>
          ))}
        </Select>
      }
    >
      <Typography variant="h6" align="center" sx={{ marginBottom: 2 }}>
        Total sessions in {moment(month, "YYYY-MM").format("MMMM YYYY")}:{" "}
        {totalSessions}
      </Typography>

      <Chart
        options={optionscolumnchart}
        series={seriescolumnchart}
        type="bar"
        height={370}
        width="100%"
      />
    </DashboardCard>
  );
};

export default SalesOverview;
