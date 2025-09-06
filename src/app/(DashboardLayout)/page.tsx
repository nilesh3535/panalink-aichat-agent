"use client";
import { Grid, Box } from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
// components
import SalesOverview from "@/app/(DashboardLayout)/components/dashboard/SalesOverview";
import YearlyBreakup from "@/app/(DashboardLayout)/components/dashboard/YearlyBreakup";
import RecentTransactions from "@/app/(DashboardLayout)/components/dashboard/RecentTransactions";
import ProductPerformance from "@/app/(DashboardLayout)/components/dashboard/ProductPerformance";
import Blog from "@/app/(DashboardLayout)/components/dashboard/Blog";
import MonthlyEarnings from "@/app/(DashboardLayout)/components/dashboard/MonthlyEarnings";
import Lottie, { LottieComponentProps } from "lottie-react";
import { useEffect, useState } from "react";

import { fetchAllChats, getLoginSession } from "@/lib/api.action";
interface Chat {
  id: number;
  created_at: string;
  session_id: string;
  userinput: string;
  aioutput: string;
}
const Dashboard = () => {
  const [allchats, setAllChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const initializeAppData = async () => {
      // Fetch user data and jobs

      const alldata = await fetchAllChats();
      console.log("Fetched chats:", alldata);
      setAllChats(alldata);

      setLoading(false);
    };
    initializeAppData();
  }, []);
  return (
    <PageContainer title="Portal-AI CHAT AGENT" description="this is Dashboard">
      <Box>
        <Grid container spacing={3}>
          <Grid
            size={{
              xs: 12,
              lg: 8,
            }}
          >
            <SalesOverview allchats={allchats} />
          </Grid>
          <Grid
            size={{
              xs: 12,
              lg: 4,
            }}
          >
            <Grid container spacing={3}>
              <Grid size={12}>
                <YearlyBreakup allchats={allchats} />
              </Grid>
              <Grid size={12}>
                <MonthlyEarnings allchats={allchats} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
