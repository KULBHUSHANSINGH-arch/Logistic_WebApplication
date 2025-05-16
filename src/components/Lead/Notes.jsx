import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  IconButton,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText
} from "@mui/material";
import { useSelector } from "react-redux";

const NotesModal = ({ row = {}, onSave = () => {}, fetchNotes = () => {}, status }) => {
  const { user } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [followDate, setFollowDate] = useState("");
  const [noteId, setNoteId] = useState("");
  const [followUpType, setFollowUpType] = useState(""); // Follow-up type state
  const [isError, setIsError] = useState(false);
  const [isFollowUpTypeError, setIsFollowUpTypeError] = useState(false); // Validation state

  // Function to get the next day same time (24 hrs ahead)
  const getNextDaySameTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 29);
    return now.toISOString().slice(0, 16);
  };

  const handleOpen = () => {
    if (row.customerId) {
      fetchNotes(row.customerId, user)
        .then((data) => {
          setNotes(data.notes || []);
          setFollowDate(data.followDate || "");
          setNoteId(data.id || "");
          setOpen(true);
        })
        .catch((error) => {
          console.error("Error fetching notes:", error);
        });
    }
  };

  const handleClose = () => {
    setOpen(false);
    setNewNote("");
    setFollowDate("");
    setFollowUpType(""); // Reset follow-up type
    setIsFollowUpTypeError(false); // Reset validation error
  };

  const handleAddNote = () => {
    let hasError = false;

    // Validate follow-up type
    if (!followUpType) {
      setIsFollowUpTypeError(true);
      hasError = true;
    }

    // Validate follow-up note only if "Not Received" is NOT selected
    if (followUpType !== "Call Not Received" && !newNote.trim()) {
      setIsError(true);
      hasError = true;
    }

    if (hasError) return; // Stop submission if errors exist

    const newNoteEntry = {
      text: newNote.trim(),
      timestamp: new Date().toISOString(),
      followDate,
      followUpType, // Include follow-up type
    };

    const updatedNotes = [...notes, newNoteEntry];
    setNotes(updatedNotes);
    onSave(updatedNotes);
    setNewNote("");
    setFollowUpType("");
    setOpen(false);
  };

  const handleFollowUpTypeChange = (value) => {
    setFollowUpType(value);
    setIsFollowUpTypeError(false); // Clear error

    if (value === "Call Not Received") {
      setFollowDate(getNextDaySameTime()); // Auto-set follow-up date
      setNewNote(""); // Clear follow-up note
      setIsError(false); // Remove validation error
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(date);
    } catch {
      return "Invalid Date";
    }
  };

  return (
    <div>
      {(row.followUpData != null) || (status === "Assigned" || status === "Followup") ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleOpen}
          style={{ background: "#5dbea3", color: "black" }}
          className="hover:bg-red-300 rounded-full p-2"
        >
          Follow Up
        </Button>
      ) : (
        ""
      )}

      <Dialog open={open} onClose={handleClose}>
        {/* Dialog Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
          <DialogTitle className="text-lg font-semibold">Follow-up Note</DialogTitle>
          <IconButton onClick={handleClose} size="small">✖</IconButton>
        </Box>

        <DialogContent className="sm:max-w-[500px] space-y-4">
          {/* Previous Notes */}
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {notes.map((note, index) => (
              <div
                key={index}
                className={`rounded-lg shadow-sm p-3 border border-gray-200 ${
                  index % 2 === 0 ? "bg-gray-400" : "bg-blue-200"
                }`}
              >
                <p className="text-sm text-gray-600 mb-1">{formatDate(note.timestamp)}</p>
                <p className="text-sm text-gray-800">{note.text}</p>
                {note.followUpType && (
                  <p className="text-sm text-green-500">
                    <span style={{ color: "black" }}>Follow-up Type: </span>{note.followUpType}
                  </p>
                )}
                {note.followDate !== "" && (
                  <p className="text-sm text-blue-500">
                    <span style={{ color: "black" }}>Next Follow-up Date: </span>
                    {formatDate(note.followDate)}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Follow-up Type (Radio Buttons) */}
          {(status === "Followup" || status === "Assigned"||status === "Followup-Pending") && (
            <FormControl component="fieldset" error={isFollowUpTypeError}>
              <FormLabel component="legend">Follow-up Type <span className="text-red-500">*</span></FormLabel>
              <RadioGroup
                row
                value={followUpType}
                onChange={(e) => handleFollowUpTypeChange(e.target.value)}
              >
                <FormControlLabel value="Call" control={<Radio />} label="Call" />
                <FormControlLabel value="Meeting" control={<Radio />} label="Meeting" />
                <FormControlLabel value="Message" control={<Radio />} label="Message" />
                <FormControlLabel value="Call Not Received" control={<Radio />} label="Call Not Received" />
              </RadioGroup>
              {isFollowUpTypeError && <FormHelperText>Please select a follow-up type.</FormHelperText>}
            </FormControl>
          )}

          {/* New Note Input (Hidden when "Not Received" is selected) */}
          {(status === "Followup" || status === "Assigned"||status === "Followup-Pending") && followUpType !== "Call Not Received" && (
            <>
              <textarea
                placeholder="Add Follow-up note..."
                value={newNote}
                onChange={(e) => {
                  setNewNote(e.target.value);
                  if (e.target.value.trim() !== "") {
                    setIsError(false);
                  }
                }}
                className={`w-full min-h-[100px] p-2 rounded-md focus:outline-none focus:ring-2 ${
                  isError ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
                }`}
                style={{ border: "1px solid black" }}
                rows={3}
              />
              {isError && <p className="text-xs text-red-500 mt-1">Follow-up note is required.</p>}
            </>
          )}

          {/* Follow-up Date Input (Auto-set for "Not Received") */}
          {(status === "Followup" || status === "Assigned"||status === "Followup-Pending") && (
            <TextField
              type="datetime-local"
              label="Next Follow-up Date"
              value={followDate}
              onChange={(e) => setFollowDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              className="w-full"
            />
          )}
        </DialogContent>

        <DialogActions>
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          {(status === "Followup" || status === "Assigned"||status === "Followup-Pending") && (
            <Button style={{ background: "#a20000", color: "black" }} onClick={handleAddNote}>
              Add Note
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default NotesModal;
