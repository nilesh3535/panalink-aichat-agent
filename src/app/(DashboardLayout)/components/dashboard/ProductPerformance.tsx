import React, { useState } from "react";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import moment from "moment";
import ReactMarkdown from "react-markdown";
interface Chat {
  id: number;
  created_at: string;
  session_id: string;
  userinput: string;
  aioutput: string;
}

interface MonthlyEarningsProps {
  allchats: Chat[];
}

const ProductPerformance = ({ allchats }: MonthlyEarningsProps) => {
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  const seen = new Set<string>();
  const uniqueSessions = allchats.filter((chat) => {
    if (seen.has(chat.session_id)) return false;
    seen.add(chat.session_id);
    return true;
  });

  const sessionsWithStart = uniqueSessions.map((session) => {
    const sessionChats = allchats.filter(
      (c) => c.session_id === session.session_id
    );
    const oldest = sessionChats.reduce((min, c) =>
      new Date(c.created_at) < new Date(min.created_at) ? c : min
    );
    return {
      ...session,
      sessionStart: oldest.created_at,
      length: sessionChats.length,
    };
  });

  const getSessionLength = (sessionId: string) =>
    allchats.filter((chat: Chat) => chat.session_id === sessionId).length;

  // Filter chats for selected session
  const selectedChats = allchats.filter(
    (chat: Chat) => chat.session_id === selectedSession
  );

  return (
    <DashboardCard
      title={`Conversations (${sessionsWithStart.length})`}
      righttile={"Total Chat Length: " + allchats.length + ""}
    >
      {selectedSession ? (
        <Box>
          <Box display="flex" alignItems="center" mb={2}>
            <IconButton onClick={() => setSelectedSession(null)}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" ml={1}>
              Session: {selectedSession}
            </Typography>
          </Box>
          <Box p={2} bgcolor="#f5f5f5" borderRadius={2}>
            {selectedChats
              .slice()
              .reverse()
              .map((chat) => (
                <Box key={chat.id} mb={3}>
                  {/* User Input Right Side */}
                  {chat.userinput && (
                    <Box
                      display="flex"
                      alignItems="flex-start"
                      justifyContent="flex-end"
                      mt={10}
                      mb={2}
                    >
                      <Box sx={{ minWidth: 0, textAlign: "right" }}>
                        <Typography variant="subtitle2" color="primary">
                          User (
                          {moment(chat.created_at).format(
                            "DD MMM YY - hh:mm A"
                          )}
                          )
                        </Typography>
                        <Typography
                          sx={{
                            wordBreak: "break-word",
                            whiteSpace: "pre-wrap",
                            mb: 1,
                          }}
                        >
                          {chat.userinput}
                        </Typography>
                      </Box>
                      {/* User Icon on Right */}
                      <Box ml={1}>
                        <img
                          src="https://www.panalinks.com/wp-content/uploads/2025/09/User-icon.png"
                          alt="User"
                          width={32}
                          height={32}
                        />
                      </Box>
                    </Box>
                  )}
                  {/* AI Output Left Side */}
                  {chat.aioutput && (
                    <Box display="flex" alignItems="flex-start">
                      {/* AI Icon on Left */}
                      <Box mr={1}>
                        <img
                          src="https://www.panalinks.com/wp-content/uploads/2025/09/panalink-bot-anika.png"
                          alt="AI"
                          width={32}
                          height={32}
                        />
                      </Box>

                      <Box sx={{}}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Typography
                            variant="subtitle2"
                            fontWeight="bold"
                            color="#1a4bdd"
                          >
                            AI
                          </Typography>
                          <Typography
                            variant="body2"
                            fontStyle="italic"
                            color="gray"
                          >
                            {moment(chat.created_at).format(
                              "DD MMM YY - hh:mm:ss A"
                            )}
                          </Typography>
                        </Box>

                        <div
                          className="prose prose-invert"
                          style={{
                            wordBreak: "break-word",
                            backgroundColor: "#df6c49",
                            color: "#ffffff",
                            borderRadius: "8px",
                            padding: "5px 25px",

                            margin: 0,
                            width: "100%",
                          }}
                        >
                          <ReactMarkdown>{chat.aioutput}</ReactMarkdown>
                        </div>
                      </Box>
                    </Box>
                  )}
                </Box>
              ))}
          </Box>
        </Box>
      ) : (
        <Box sx={{ overflow: "auto", width: { xs: "280px", sm: "auto" } }}>
          <Table aria-label="simple table" sx={{ whiteSpace: "nowrap", mt: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    -
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Session ID
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Chat on
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Length
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Action
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sessionsWithStart.map((session, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Typography sx={{ fontSize: "15px", fontWeight: "500" }}>
                      {index + 1}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      color="textSecondary"
                      variant="subtitle2"
                      fontWeight={400}
                    >
                      {session?.session_id || ""}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">
                      {moment(session.created_at).format("DD MMM YY - hh:mm A")}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">
                      {getSessionLength(session.session_id)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => setSelectedSession(session.session_id)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
    </DashboardCard>
  );
};

export default ProductPerformance;
