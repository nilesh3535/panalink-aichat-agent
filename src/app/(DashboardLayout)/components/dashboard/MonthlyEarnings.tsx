import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from "@mui/material/styles";
import { Stack, Typography, Avatar, Fab } from "@mui/material";
import {
  IconArrowDownRight,
  IconArrowUpLeft,
  IconCurrencyDollar,
  IconWaveSine,
} from "@tabler/icons-react";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import moment from "moment";

interface Chat {
  session_id: string;
  created_at: string;
  // Add other properties if needed
}

interface MonthlyEarningsProps {
  allchats: Chat[];
}

const MonthlyEarnings = ({ allchats }: MonthlyEarningsProps) => {
  const uniqueAllDataSessionsMap = new Map();

  allchats.forEach((chat) => {
    if (!uniqueAllDataSessionsMap.has(chat.session_id)) {
      uniqueAllDataSessionsMap.set(chat.session_id, chat);
    }
  });

  const uniqueSessionChats = Array.from(uniqueAllDataSessionsMap.values());
  const currentMonth = moment().format("YYYY-MM");

  const currentMonthChats = allchats.filter(
    (c) => moment(c.created_at).format("YYYY-MM") === currentMonth
  );

  // Get unique session_id entries
  const uniqueSessionsMap = new Map();

  currentMonthChats.forEach((c) => {
    if (!uniqueSessionsMap.has(c.session_id)) {
      uniqueSessionsMap.set(c.session_id, c);
    }
  });

  const uniqueCurrentMonthChats = Array.from(uniqueSessionsMap.values());
  console.log("Unique sessions this month:", uniqueCurrentMonthChats.length);
  // chart color
  const theme = useTheme();
  const secondary = theme.palette.secondary.main;
  const secondarylight = "#f5fcff";
  const errorlight = "#fdede8";
  const successlight = theme.palette.success.light;
  // chart
  const optionscolumnchart: any = {
    chart: {
      type: "area",
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: "#adb0bb",
      toolbar: {
        show: false,
      },
      height: 60,
      sparkline: {
        enabled: true,
      },
      group: "sparklines",
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      colors: [secondarylight],
      type: "solid",
      opacity: 0.05,
    },
    markers: {
      size: 0,
    },
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
    },
  };
  const seriescolumnchart: any = [
    {
      name: "",
      color: secondary,
      data: [25, 66, 20, 40, 12, 58, 20],
    },
  ];

  return (
    <DashboardCard
      title="Monthly Sessions"
      action={
        <Fab color="secondary" size="medium" sx={{ color: "#ffffff" }}>
          <IconWaveSine width={24} />
        </Fab>
      }
      footer={
        <Chart
          options={optionscolumnchart}
          series={seriescolumnchart}
          type="area"
          height={60}
          width={"100%"}
        />
      }
    >
      <>
        <Typography variant="h3" fontWeight="700" mt="-20px">
          {String(uniqueCurrentMonthChats.length)}
        </Typography>
        <Stack direction="row" spacing={1} my={1} alignItems="center">
          {Math.round(allchats.length / uniqueCurrentMonthChats.length) > 1 ? (
            <Avatar sx={{ bgcolor: successlight, width: 27, height: 27 }}>
              <IconArrowUpLeft width={20} color="#39B69A" />
            </Avatar>
          ) : (
            <Avatar sx={{ bgcolor: errorlight, width: 27, height: 27 }}>
              <IconArrowDownRight width={20} color="#FA896B" />
            </Avatar>
          )}
          <Typography variant="subtitle2" fontWeight="600">
            {uniqueCurrentMonthChats.length > 0
              ? `${Math.round(
                  uniqueSessionChats.length / uniqueCurrentMonthChats.length
                )}%`
              : "0%"}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {moment(currentMonth).format("MMMM YYYY")}
          </Typography>
        </Stack>
      </>
    </DashboardCard>
  );
};

export default MonthlyEarnings;
