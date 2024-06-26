import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import BettingCalculator from "../components/BettingCalculator";
import EventTimeFormatter from "../components/EventTimeFormatter";
import ToBets from "../components/ToBets";
import CloseButton from "../components/CloseButton";
import {
  Paper,
  Box,
  Typography,
  Container,
  Button,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import Confetti from "react-confetti";

const BetDetails = () => {
  let { id } = useParams();
  const navigate = useNavigate();
  const [bet, setBet] = useState(null);
  const [open, setOpen] = useState(true);
  const [outcome, setOutcome] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [confettiVisible, setConfettiVisible] = useState(false);

  const fetchBet = async () => {
    const token = localStorage.getItem("token");
    let response = await axios.get(
      `https://wager-server-946d5db015ae.herokuapp.com/bets/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setBet(response.data);
    setOpen(response.data.open);
    setOutcome(response.data.outcome);
  };

  useEffect(() => {
    fetchBet();
  }, [id]);

  useEffect(() => {
    if (outcome === "Win") {
      setConfettiVisible(true);
      setTimeout(() => {
        setConfettiVisible(false);
      }, 4500);
    }
  }, [outcome]);

  const getBackgroundColor = () => {
    if (outcome === "Win") {
      return "rgba(0, 255, 0, 0.5)";
    } else if (outcome === "Loss") {
      return "rgba(255, 0, 0, 0.5)";
    }
    return "#ffffff";
  };

  const handleDelete = async () => {
    if (window.confirm("Permanently delete record?")) {
      const token = localStorage.getItem("token");
      try {
        await axios.delete(
          `https://wager-server-946d5db015ae.herokuapp.com/bets/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        navigate("/bets");
      } catch (error) {
        console.error("Error deleting bet", error);
      }
    }
  };

  const handleEdit = (field) => {
    setEditingField(field);
  };

  const handleSave = async (field) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `https://wager-server-946d5db015ae.herokuapp.com/bets/${id}`,
        { [field]: bet[field] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEditingField(null);
      fetchBet();
    } catch (error) {
      console.error(`Error updating ${field}`, error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBet((prevBet) => ({
      ...prevBet,
      [name]: value,
    }));
  };

  if (!bet) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <div>
      <ToBets open={open} />
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        {confettiVisible && <Confetti />}
        <Paper
          elevation={3}
          sx={{
            maxWidth: "550px",
            padding: 3,
            marginTop: 3,
            backgroundColor: getBackgroundColor(),
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {editingField === "event" ? (
              <TextField
                label="Event"
                name="event"
                value={bet.event}
                onChange={handleChange}
                fullWidth
              />
            ) : (
              <Typography variant="h4" gutterBottom>
                {bet.event}
              </Typography>
            )}
            <IconButton onClick={() => handleEdit("event")}>
              <EditIcon />
            </IconButton>
            {editingField === "event" && (
              <IconButton onClick={() => handleSave("event")}>
                <SaveIcon />
              </IconButton>
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {editingField === "pick" ? (
              <TextField
                label="Pick"
                name="pick"
                value={bet.pick}
                onChange={handleChange}
                fullWidth
              />
            ) : (
              <Typography variant="h5" gutterBottom>
                Pick: {bet.pick}
              </Typography>
            )}
            <IconButton onClick={() => handleEdit("pick")}>
              <EditIcon />
            </IconButton>
            {editingField === "pick" && (
              <IconButton onClick={() => handleSave("pick")}>
                <SaveIcon />
              </IconButton>
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {editingField === "betType" ? (
              <FormControl fullWidth>
                <InputLabel id="betType">Bet Type</InputLabel>
                <Select
                  labelId="betType"
                  name="betType"
                  value={bet.betType}
                  onChange={handleChange}
                >
                  <MenuItem value="ml">Moneyline</MenuItem>
                  <MenuItem value="spread">Spread</MenuItem>
                </Select>
              </FormControl>
            ) : (
              <Typography variant="h5" gutterBottom>
                Type: {bet.betType}
                {bet.betType === "spread" &&
                  `  ${bet.spread > 0 ? "+" : ""}${bet.spread}`}
              </Typography>
            )}
            <IconButton onClick={() => handleEdit("betType")}>
              <EditIcon />
            </IconButton>
            {editingField === "betType" && (
              <IconButton onClick={() => handleSave("betType")}>
                <SaveIcon />
              </IconButton>
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {editingField === "commenceTime" ? (
              <TextField
                label="Start Time"
                name="commenceTime"
                type="datetime-local"
                value={bet.commenceTime}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            ) : (
              <Typography variant="h6" gutterBottom>
                Scheduled Start:{" "}
                <EventTimeFormatter dateTimeString={bet.commenceTime} />
              </Typography>
            )}
            <IconButton onClick={() => handleEdit("commenceTime")}>
              <EditIcon />
            </IconButton>
            {editingField === "commenceTime" && (
              <IconButton onClick={() => handleSave("commenceTime")}>
                <SaveIcon />
              </IconButton>
            )}
          </Box>

          <Box sx={{ marginY: 1 }}>
            <BettingCalculator
              stakeAmount={bet.stakeAmount}
              odds={bet.odds}
              outcome={outcome}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 2,
            }}
          >
            {open ? (
              <CloseButton id={id} setOpen={setOpen} setOutcome={setOutcome} />
            ) : (
              <Typography variant="body1">
                Bet closed - Outcome: {outcome}
              </Typography>
            )}
          </Box>
          <Box sx={{ marginTop: 2 }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleDelete}
            >
              Remove Bet from History
            </Button>
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default BetDetails;
