import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import "../styles/PoliceStation.css";

// For Date
import moment from "moment";

//Modals
import { Modal, Button } from "react-bootstrap";

// Material-icon import
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

// Material-ui/table imports
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

// style Functions
const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    height: 60,
  },
  body: {
    fontSize: 12,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);
const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

function PoliceStation() {
  let history = useHistory();

  const classes = useStyles();

  const [station, setStation] = useState([]);

  const [newStation, setNewStation] = useState("");

  // Add Station
  const [AddNewStation, setAddNewStation] = useState("");
  const [subDivId, setSubDivId] = useState("");

  // For Modals
  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);

  useEffect(() => {
    Axios.get(`${process.env.REACT_APP_NODE_API_PATH}/get-police-station`, {
      headers: { authorization: "Bearer " + localStorage.getItem("token") },
    })
      .then((response) => {
        if (response.data.auth === false) {
          history.push("/");
        } else {
          setStation(response.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [history]);

  // Add station
  const addStation = () => {
    Axios.post(`${process.env.REACT_APP_NODE_API_PATH}/add-station`, {
      newStation: AddNewStation,
      subDivId: subDivId,
    }).then((response) => {
      if (response) {
        window.location.reload();
      }
    });
  };

  // Edit station
  const handleStationEdit = (id) => {
    Axios.put(`${process.env.REACT_APP_NODE_API_PATH}/update-station`, {
      newStation: newStation,
      id: id,
    }).then((response) => {
      window.location.reload();
    });
  };

  // Delete Station
  const handleStationDelete = (id) => {
    Axios.put(`${process.env.REACT_APP_NODE_API_PATH}/delete-station`, {
      id: id,
    }).then((response) => {
      window.location.reload();
    });
  };

  //Modals
  const handleOpenModel = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleOpenModel1 = () => {
    setShowModal1(true);
  };

  const handleCloseModal1 = () => {
    setShowModal1(false);
  };

  return (
    <div className="main-station">
      <div className="container">
        <div className="row">
          <div className="station-page">
            <div className="station-navbar">
              <div className="leftSide">
                <div className="back-icon">
                  <a href="/dashboard">
                    <KeyboardBackspaceIcon />
                  </a>
                </div>
                <div className="station-heading">
                  <h4>Police Stations</h4>
                </div>
              </div>
              <div className="station-navbar-header">
                <button
                  className="btn"
                  style={{ backgroundColor: "#edf0f7" }}
                  onClick={handleOpenModel1}
                >
                  <AddIcon />
                  Add Station
                </button>
                {/* Add Station Modal */}
                <Modal show={showModal1} onHide={handleCloseModal1}>
                  <Modal.Header>
                    <Modal.Title>Add Station</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Station Name"
                      required
                      onChange={(e) => {
                        setAddNewStation(e.target.value);
                      }}
                    />
                    <select
                      className="custom-select form-select form-select-lg mb-3"
                      aria-label=".form-select-lg example"
                      name="sub_Division"
                      onChange={(e) => {
                        setSubDivId(e.target.value);
                      }}
                    >
                      {station.map((station, index) => {
                        return (
                          <option value={station.sub_division_id} key={index}>
                            {station.sub_division}
                          </option>
                        );
                      })}
                    </select>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal1}>
                      Close
                    </Button>
                    <Button className="primary" onClick={addStation}>
                      Add
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>
            </div>
            <div className="station-table">
              <TableContainer component={Paper} style={{ maxHeight: 500 }}>
                <Table
                  className={classes.table}
                  aria-label="customized table"
                  stickyHeader
                >
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center">Station</StyledTableCell>
                      <StyledTableCell align="center">
                        Sub Division
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        Added Date
                      </StyledTableCell>
                      <StyledTableCell align="center">Edit</StyledTableCell>
                      <StyledTableCell align="center">Delete</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {station.map((station) => {
                      return (
                        <StyledTableRow key={station.police_station_id}>
                          <StyledTableCell
                            component="th"
                            scope="row"
                            align="center"
                          >
                            {station.police_station}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {station.sub_division}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {moment(station.added_date).format(
                              "MMMM Do YYYY, h:mm a"
                            )}
                          </StyledTableCell>
                          <StyledTableCell
                            component="th"
                            scope="row"
                            align="center"
                          >
                            <button
                              onClick={handleOpenModel}
                              style={{
                                border: "none",
                                background: "transparent",
                              }}
                            >
                              <EditIcon />
                            </button>
                            {/* Modal */}
                            <Modal show={showModal} onHide={handleCloseModal}>
                              <Modal.Header>
                                <Modal.Title>Edit Police Station</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                <input
                                  className="form-control"
                                  type="text"
                                  onChange={(e) => {
                                    setNewStation(e.target.value);
                                  }}
                                />
                              </Modal.Body>
                              <Modal.Footer>
                                <Button
                                  variant="secondary"
                                  onClick={handleCloseModal}
                                >
                                  Close
                                </Button>
                                <Button
                                  className="primary"
                                  onClick={() => {
                                    handleStationEdit(
                                      station.police_station_id
                                    );
                                  }}
                                >
                                  Edit
                                </Button>
                              </Modal.Footer>
                            </Modal>
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            <button
                              style={{
                                border: "none",
                                background: "transparent",
                              }}
                              onClick={() => {
                                handleStationDelete(station.police_station_id);
                              }}
                            >
                              <DeleteIcon />
                            </button>
                          </StyledTableCell>
                        </StyledTableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PoliceStation;
