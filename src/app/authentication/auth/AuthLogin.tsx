import React, { useState } from "react";
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
  Stack,
  Checkbox,
  Alert,
  Snackbar,
} from "@mui/material";
import CustomTextField from "@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField";
import Loading from "@/app/loading";
import { createLoginSession } from "@/lib/api.action";
import { useRouter } from "next/router";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface loginType {
  title?: string;
  subtitle?: React.ReactNode;
  subtext?: React.ReactNode;
}

const AuthLogin = ({ title, subtitle, subtext }: loginType) => {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const checkLogin = async () => {
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Username and password are required.");
      setSnackbar({
        open: true,
        message: "Username and password are required.",
        severity: "error",
      });
      return;
    }

    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);

    if (username === "panalink" && password === "panalink25") {
      setSnackbar({
        open: true,
        message: "Login success!",
        severity: "success",
      });
      // Login success
      console.log("Login success ");
      // Redirect or perform other actions here
      await createLoginSession(username); // set cookie
      window.location.href = "/";
    } else {
      setError("Invalid username or password.");
      setSnackbar({
        open: true,
        message: "Invalid username or password.",
        severity: "error",
      });
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      {title ? (
        <Typography fontWeight="700" variant="h2" mb={1}>
          {title}
        </Typography>
      ) : null}

      {subtext}

      <Stack>
        <Box mt="20px">
          <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="username"
            mb="5px"
          >
            Username
          </Typography>
          <CustomTextField
            id="username"
            value={username}
            placeholder="Enter username"
            onChange={(e) => setUsername(e.target.value)}
            variant="outlined"
            fullWidth
          />
        </Box>
        <Box mt="25px">
          <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="password"
            mb="5px"
          >
            Password
          </Typography>
          <CustomTextField
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            placeholder="***************"
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            fullWidth
            InputProps={{
              endAdornment: (
                <Button
                  onClick={() => setShowPassword((prev) => !prev)}
                  sx={{ minWidth: 0, padding: 0 }}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <Visibility fontSize="small" />
                  ) : (
                    <VisibilityOff fontSize="small" />
                  )}
                </Button>
              ),
            }}
          />
        </Box>

        <Stack
          justifyContent="space-between"
          direction="row"
          alignItems="center"
          my={2}
        >
          <FormGroup>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Remember this Device"
            />
          </FormGroup>
        </Stack>
      </Stack>

      {/* {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )} */}

      <Box>
        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          type="submit"
          onClick={checkLogin}
          disabled={isLoading}
        >
          {isLoading ? "..." : "Sign In"}
        </Button>
      </Box>

      {subtitle}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AuthLogin;
