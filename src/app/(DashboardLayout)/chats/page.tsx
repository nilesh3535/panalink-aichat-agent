"use client";
import { Box, Grid, Typography } from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import SalesOverview from "../components/dashboard/SalesOverview";
import YearlyBreakup from "../components/dashboard/YearlyBreakup";
import MonthlyEarnings from "../components/dashboard/MonthlyEarnings";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import ProductPerformance from "../components/dashboard/ProductPerformance";
import Blog from "../components/dashboard/Blog";
import { useEffect, useState } from "react";
import { fetchAllChats } from "@/lib/api.action";
interface Chat {
  id: number;
  created_at: string;
  session_id: string;
  userinput: string;
  aioutput: string;
}
const ChatPage = () => {
  const [allchats, setAllChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const initializeAppData = async () => {
      // Fetch user data and jobs

      const alldata = await fetchAllChats();

      setAllChats(alldata);

      setLoading(false);
    };
    initializeAppData();
  }, []);
  return (
    <PageContainer
      title="Conversations-AI CHAT AGENT"
      description="this is Dashboard"
    >
      <Box>
        <Grid container spacing={3}>
          <Grid
            size={{
              xs: 12,
              lg: 12,
            }}
          >
            <ProductPerformance allchats={allchats} />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default ChatPage;
