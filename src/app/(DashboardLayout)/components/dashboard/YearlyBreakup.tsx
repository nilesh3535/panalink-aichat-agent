import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from "@mui/material/styles";
import { Grid, Stack, Typography, Avatar } from "@mui/material";
import { IconArrowUpLeft } from "@tabler/icons-react";

import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import moment from "moment";

const YearlyBreakup = ({ allchats }) => {
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
  
  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primarylight = "#ecf2ff";
  const successlight = theme.palette.success.light;

  // chart
  const optionscolumnchart: any = {
    chart: {
      type: "donut",
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: "#adb0bb",
      toolbar: {
        show: false,
      },
      height: 155,
    },
    colors: [primary, primarylight, "#F9F9FD"],
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        donut: {
          size: "75%",
          background: "transparent",
        },
      },
    },
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
      fillSeriesColor: false,
    },
    stroke: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    responsive: [
      {
        breakpoint: 991,
        options: {
          chart: {
            width: 120,
          },
        },
      },
    ],
  };
  // Calculate chart series: yearly unique sessions, current month unique sessions, remainder to 100
  const yearlyCount = uniqueSessionChats.length;
  const currentMonthCount = uniqueCurrentMonthChats.length;
  const remainder = Math.max(0, 100 - yearlyCount - currentMonthCount);
  const seriescolumnchart: any = [yearlyCount, currentMonthCount, remainder];

  return (
    <DashboardCard title="Yearly Breakup">
      <Grid container spacing={3}>
        {/* column */}
        <Grid
          size={{
            xs: 7,
            sm: 7,
          }}
        >
          <Typography variant="h3" fontWeight="700">
            {uniqueSessionChats.length}
          </Typography>
          <Stack direction="row" spacing={1} mt={1} alignItems="center">
            <Avatar sx={{ bgcolor: successlight, width: 27, height: 27 }}>
              <IconArrowUpLeft width={20} color="#39B69A" />
            </Avatar>
            <Typography variant="subtitle2" fontWeight="600">
              +9%
            </Typography>
          </Stack>
          <Stack spacing={3} mt={5} direction="row">
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar
                sx={{
                  width: 9,
                  height: 9,
                  bgcolor: primary,
                  svg: { display: "none" },
                }}
              ></Avatar>
              <Typography variant="subtitle2" color="textSecondary">
                {new Date().getFullYear()}
              </Typography>
            </Stack>
          </Stack>
        </Grid>
        {/* column */}
        <Grid
          size={{
            xs: 5,
            sm: 5,
          }}
        >
          <Chart
            options={optionscolumnchart}
            series={seriescolumnchart}
            type="donut"
            height={150}
            width={"100%"}
          />
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default YearlyBreakup;
