import React, { useState, useEffect } from "react";
import { Tooltip, Button, Paper, Grid, Typography, FormControl, FormLabel, FormControlLabel, Radio, IconButton, InputLabel, Select, Box, Menu, MenuItem, RadioGroup, TextField, Divider } from "@mui/material";
import { useSelector } from "react-redux";
import { dev } from "../../utils/ApiUrl";
import { toast } from "react-toastify";
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import { Add, Search, Download } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import "../../styles/statusvehicle.css";
import { useNavigate } from "react-router-dom";
import { GetApp } from "@mui/icons-material";

const StatusRadioGroup = ({
  status,
  getStatus,
  searchValue,
  handleSearchInput,
  setSelectedLocationId,
  selectedLocationId,
  handleExcelFile,
  setDateFilterOpen,
  vehicleData,
  setDateRange,
  dateRange,
  setPreventApiCall
}) => {

  const { user } = useSelector((state) => state.user);
  const [workLocations, setWorkLocations] = useState([]);
  const navigate = useNavigate();

  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState('');

  useEffect(() => {
    const department = localStorage.getItem('department');
    const designation = localStorage.getItem('designation');
    setDesignation(designation);
    setDepartment(department);
    if (designation === "Sales Executive"  ) {
      getStatus("out"); 
    }
  }, [designation]);

  const handleChange = (event) => {
    const newValue = event.target.value;
    getStatus(newValue);
    if (dateRange && dateRange.fromDate && dateRange.toDate) {
      setDateRange({})
    }
    console.log('chcking the status', newValue);
    setPreventApiCall(false);
  };


  useEffect(() => {
    const fetchWorkLocationLists = async () => {
      try {
        const resp = await fetch(
          `${dev}/workLocation/work-location-list`,
          {
            method: "GET",
            headers: {
              "content-type": "application/json",
            },
          }
        );
        const result = await resp.json();

        if (!resp.ok) {
          toast.error(result.message || "Something went wrong");
          return;
        }

        if (user.designation === 'Sales Executive' ) {
          setWorkLocations([{ WorkLocationId: "ALL", workLocationName: "All" }]);
          setSelectedLocationId("ALL"); 
        } else {
          setWorkLocations([
            ...result.workLocations,
            { WorkLocationId: "ALL", workLocationName: "All" },
          ]);
        }

      } catch (error) {
        console.log("Error fetching work locations:", error.message);
        toast.error("Failed to fetch work locations");
      }
    };
    fetchWorkLocationLists();
  }, []);

  const actions = [
    {
      name: "Search Filter",
      icon: <SearchIcon />,
      onClick: () => setDateFilterOpen(true),
    },
    {
      name: "Export",
      icon: <GetApp />,
      onClick: () => handleExcelFile(workLocations.filter((unit) => unit.WorkLocationId === selectedLocationId)),
      disabled: vehicleData?.length === 0 || user.designation === 'Dispatcher',
    },
  ];

  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="vehicle-paper-container">
      <Paper elevation={6}>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          className="gap-1 px-2 py-2 border-2 lg:px-1 lg:py-2"
          flexWrap="nowrap"
          sx={{ maxWidth: "100%" }}
        >
          <Grid item>
            <Grid container alignItems="center">
              <Grid item>
                <TextField
                  label="Search"
                  variant="outlined"
                  value={searchValue}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  sx={{
                    marginRight: "10px",
                    width: "160px",
                    "& .MuiOutlinedInput-root": {
                      padding: "4px",
                      "& input": {
                        fontSize: "10px",
                        padding: "8px 7px",
                      },
                    },
                    "& .MuiInputLabel-outlined": {
                      fontSize: "10px",
                      lineHeight: "1.2",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderRadius: "4px",
                    },
                  }}
                />
              </Grid>

              <Grid item>
                <FormControl component="fieldset">
                  {designation !== 'Dispatcher' && (
                    <RadioGroup
                      aria-label="status"
                      name="status"
                      value={status || (designation === "Sales Executive" ? "out" : status)}
                      // value={status || (designation === "Sales Executive" ? "out" : status)}
                      onChange={handleChange}
                      row
                      sx={{ gap: "0px" }}
                    >
                      {[
                        "all",
                        "In",
                        "Loading",
                        "Transferred",
                        "Out",
                        "Pending",
                        "Transporter Billing Pending",
                        "Delivered",
                        "Canceled",
                        "Delay"
                      ]
                        // .filter(option => !(designation === "Sales Executive" && (option === "Pending" || option === "Canceled" || option === "all")))
                        .filter(option => 
                          !(designation === "Sales Executive" && (option === "Pending" || option === "Canceled" || option === "all")) &&
                          !(option === "Transporter Billing Pending" && designation !== "Super Admin") // Super Admin ke alawa sabke liye hide
                        )
                        .map(option => (
                          <FormControlLabel
                            key={option.toLowerCase()}
                            value={option.toLowerCase()}
                            control={<Radio sx={{ fontSize: "9px" }} />}
                            label={
                              <Typography
                                sx={{
                                  fontSize: "9px",
                                  fontWeight: "400",
                                  textTransform: "uppercase",
                                  fontFamily: "Arial, sans-serif",
                                  color: "#000009",
                                }}
                              >
                                {option}
                              </Typography>
                            }
                            sx={{ margin: "0" }}
                          />
                        ))}
                    </RadioGroup>
                  )}
                </FormControl>
              </Grid>
              
            </Grid>
          </Grid>

          <Grid item display={"flex"} justifyContent={"space-between"}>
            <Grid container alignItems="center" spacing={2}>
              {designation !== 'Sales Executive' && (
                <Grid item>
                  <Button
                    disabled={vehicleData?.length === 0 || user.designation === 'Dispatcher'}
                    onClick={() =>
                      handleExcelFile(
                        workLocations.filter((unit) => unit.WorkLocationId === selectedLocationId)
                      )
                    }
                    sx={{
                      padding: "5px 12px",
                      fontSize: "11px",
                      fontWeight: "bold",
                      color: "#fff",
                      background: "linear-gradient(90deg, #8f0c0c, #ad4024)",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      "&:hover": {
                        background: "linear-gradient(90deg, #f12400, #3b0101)",
                      },
                    }}
                  >
                    <Download sx={{ fontSize: "13px", marginRight: "4px" }} />
                    Export
                  </Button>
                </Grid>
              )}

              <Grid item>
                <FormControl sx={{ marginRight: "0px" }}>
                  <InputLabel
                    id="work-location-label"
                    sx={{ fontSize: "13px", fontWeight: "bold" }}
                  >
                    Unit
                  </InputLabel>
                  <Select
                    labelId="work-location-label"
                    id="work-location"
                    value={designation === "Sales Executive" ? "ALL" : selectedLocationId} 
                    label="Unit"
                    disabled={designation === 'Sales Executive'}
                    
                    onChange={(e) => {
                      setSelectedLocationId(e.target.value);
                      setPreventApiCall(false);
                    }}
                    sx={{
                      fontSize: "10px",
                      height: "30px",
                      "& .MuiSelect-select": {
                        display: "flex",
                        alignItems: "center",
                        height: "100%",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderRadius: "4px",
                      },
                    }}
                  >
                    {workLocations.map((location) => (
                      <MenuItem
                        key={location.WorkLocationId}
                        value={location.WorkLocationId}
                        sx={{
                          backgroundColor: "#ffffff",
                          color: "#333333",
                          fontSize: "10px",
                          "&:hover": {
                            backgroundColor: "#e0e0e0",
                            color: "#000000",
                          },
                        }}
                      >
                        {location.workLocationName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {designation !== 'Sales Executive' && (
                <Grid item>
                  <Box
                    sx={{
                      position: "relative",
                      height: "46px",
                      marginRight: "0",
                    }}
                  >
                    <IconButton
                      aria-controls="simple-menu"
                      aria-haspopup="true"
                      onClick={handleMenuClick}
                      sx={{
                        marginTop: "8px",
                        marginRight: "4px",
                        padding: "4px 8px",
                        fontSize: "10px",
                        color: "#fff",
                        backgroundColor: "#7a7878",
                        borderRadius: "4px",
                        "&:hover": {
                          backgroundColor: "#918a8a",
                        },
                      }}
                    >
                      <MenuIcon sx={{ fontSize: "20px" }} />
                    </IconButton>
                    <Menu
                      id="simple-menu"
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                    >
                      {actions.map((action) => (
                        <MenuItem
                          key={action.name}
                          onClick={() => {
                            if (!action.disabled) {
                              action.onClick();
                            }
                            handleMenuClose();
                          }}
                          disabled={action.disabled}
                          sx={{
                            opacity: action.disabled ? 0.5 : 1,
                            pointerEvents: action.disabled ? "none" : "auto",
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            {action.icon}
                            <Typography sx={{ marginLeft: 1 }}>
                              {action.name}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Menu>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default StatusRadioGroup;
