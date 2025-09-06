"use client";
import Link from "next/link";
import { Grid, Box, Card, Stack, Typography } from "@mui/material";
// components
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import Logo from "@/app/(DashboardLayout)/layout/shared/logo/Logo";
import AuthLogin from "../auth/AuthLogin";
import Image from "next/image";
import Lottie, { LottieComponentProps } from "lottie-react";
import { getLoginSession } from "@/lib/api.action";
import { useEffect, useState } from "react";

const Login2 = () => {
  const [loading, setLoading] = useState(true);
  const [animationData, setAnimationData] = useState<
    LottieComponentProps["animationData"] | null
  >(null);

  useEffect(() => {
    const loadEverything = async () => {
      const res = await fetch("/images/loader.json");
      const json = await res.json();
      setAnimationData(json);

      await new Promise((resolve) => setTimeout(resolve, 3000));

      const adminRes = await getLoginSession();

      if (!adminRes) {
        setLoading(false);
      } else {
        window.location.href = "/"; // Redirect to dashboard if already logged in
      }
    };

    loadEverything();
  }, []);

  if (loading || !animationData) {
    return (
      <div
        className="relative "
        style={{
          backgroundColor: "#171950",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: 0,
          padding: 0,
        }}
      >
        <Lottie
          animationData={animationData}
          loop
          autoplay
          style={{ width: 200, height: 200 }}
        />
      </div>
    );
  }
  return (
    <PageContainer title="Login" description="this is Login page">
      <Box
        sx={{
          position: "relative",
          "&:before": {
            content: '""',
            background: "radial-gradient(#d2f1df, #d3d7fa, #bad8f4)",
            backgroundSize: "400% 400%",
            animation: "gradient 15s ease infinite",
            position: "absolute",
            height: "100%",
            width: "100%",
            opacity: "0.3",
          },
        }}
      >
        <Grid
          container
          spacing={0}
          justifyContent="center"
          sx={{ height: "100vh" }}
        >
          <Grid
            display="flex"
            justifyContent="center"
            alignItems="center"
            size={{
              xs: 12,
              sm: 12,
              lg: 4,
              xl: 3,
            }}
          >
            <Card
              elevation={10}
              sx={{ p: 4, zIndex: 1, width: "100%", maxWidth: "500px" }}
            >
              <Box
                alignItems="center"
                justifyContent="center"
                textAlign="center"
              >
                <Image
                  src="/images/anika.png"
                  alt="logo"
                  height={70}
                  width={70}
                  priority
                />
                <Typography variant="h3" component="h2">
                  AI CHAT AGENT PORTAL
                </Typography>
              </Box>
              <AuthLogin
                subtitle={
                  <Stack
                    direction="row"
                    spacing={1}
                    justifyContent="center"
                    mt={3}
                  >
                    <Typography
                      color="textSecondary"
                      variant="h6"
                      fontWeight="500"
                    >
                      Panalink Infotech Limited
                    </Typography>
                  </Stack>
                }
              />
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};
export default Login2;
