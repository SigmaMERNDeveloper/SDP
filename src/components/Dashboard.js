import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import moment from "moment";
import Axios from "axios";
import { useHistory } from "react-router-dom";

import "../styles/Dashboard.css";

// material-ui/icon imports
import TrafficIcon from "@material-ui/icons/Traffic";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LocalPoliceIcon from "@mui/icons-material/LocalPolice";
import StarIcon from "@material-ui/icons/Star";
import AccountTreeSharpIcon from "@material-ui/icons/AccountTreeSharp";
import HomeIcon from "@material-ui/icons/Home";
import SettingsIcon from "@material-ui/icons/Settings";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LogoutIcon from "@mui/icons-material/Logout";

// Material-ui/table imports
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
// import TablePagination from "@material-ui/core/TablePagination";

// style Functions
const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    height: 60,
  },
  body: {
    fontSize: 13,
    height: 50,
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
    minWidth: 900,
  },
});

function Dashboard() {
  let history = useHistory();

  const classes = useStyles();

  const [violations, setViolations] = useState([]);

  const [vioImage, setVioImage] = useState([]);

  // For Modals
  const [showModal, setShowModal] = useState(false);

  Axios.defaults.withCredentials = true;

  useEffect(() => {
    Axios.get(`${process.env.REACT_APP_NODE_API_PATH}/display-violations`, {
      headers: { authorization: "Bearer " + localStorage.getItem("token") },
    })
      .then((response) => {
        if (response.data.auth === false) {
          history.push("/");
        } else {
          setViolations(response.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [history]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    history.push("/");
  };

  const showImage = (id) => {
    Axios.get(`${process.env.REACT_APP_NODE_API_PATH}/get-vioImg/${id}`).then(
      (response) => {
        setVioImage(response.data);
      }
    );
  };

  //Modals
  const handleOpenModel = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="mainDash">
      <div className="sideNav">
        <div className="container">
          <div className="row">
            <div className="height-setter">
              <div className="info-box">
                <i className="icon">
                  <TrafficIcon />
                </i>
                <div className="info-name">
                  <p>
                    <a href="/dashboard">violations</a>
                  </p>
                </div>
              </div>
              <div className="info-box">
                <i className="icon">
                  <AccountCircleIcon />
                </i>
                <div className="info-name">
                  <p>
                    <a href="/get-people-list">people</a>
                  </p>
                </div>
              </div>
              <div className="info-box">
                <i className="icon">
                  <LocalPoliceIcon />
                </i>
                <div className="info-name">
                  <p>
                    <a href="/police-list">police</a>
                  </p>
                </div>
              </div>
              <div className="info-box">
                <i className="icon">
                  <StarIcon />
                </i>
                <div className="info-name">
                  <p>
                    <a href="/rank-page">police ranks</a>
                  </p>
                </div>
              </div>
              <div className="info-box">
                <i className="icon">
                  <AccountTreeSharpIcon />
                </i>
                <div className="info-name">
                  <p>
                    <a href="/sub-divisions">sub divisons</a>
                  </p>
                </div>
              </div>
              <div className="info-box">
                <i className="icon">
                  <HomeIcon />
                </i>
                <div className="info-name">
                  <p>
                    <a href="/police-stations">police stations</a>
                  </p>
                </div>
              </div>
              <div className="info-box">
                <i className="icon">
                  <SettingsIcon />
                </i>
                <div className="info-name">
                  <p>
                    <a href="/dashboard">settings</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Dashboard */}
      <div className="dashboard">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="navbar">
                <div className="dashboard-leftSide text-left">
                  <h4>DashBoard</h4>
                </div>
                <div className="dashboard-rightSide text-right">
                  <button className="btn" onClick={handleLogout}>
                    <LogoutIcon />
                  </button>
                </div>
              </div>
              <div className="dashboard-search">
                <button className="btn" style={{ backgroundColor: "#c1d9f3" }}>
                  <a href="/filter-dashboard">Filtered search</a>
                </button>
              </div>
              <div className="table">
                <TableContainer component={Paper} style={{ maxHeight: 400 }}>
                  <Table
                    className={classes.table}
                    aria-label="customized table"
                    stickyHeader
                  >
                    <TableHead>
                      <TableRow>
                        <StyledTableCell align="center">Person</StyledTableCell>
                        <StyledTableCell align="center">Date</StyledTableCell>
                        <StyledTableCell align="center">
                          Violations
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Address
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Mobile Number
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Details
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {violations.map((violation, index) => {
                        return (
                          <StyledTableRow key={index}>
                            <StyledTableCell>
                              {violation.people_id ? (
                                <AccountCircleIcon />
                              ) : (
                                <LocalPoliceIcon />
                              )}
                            </StyledTableCell>
                            <StyledTableCell
                              component="th"
                              scope="row"
                              align="center"
                            >
                              {moment(violation.added_date).format(
                                "MMMM Do YYYY, h:mm a"
                              )}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {violation.violation_masters.map(
                                (violation, viokey) => {
                                  return (
                                    <p key={viokey}>
                                      {violation.violation_master}
                                    </p>
                                  );
                                }
                              )}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {violation.address}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {violation.mobile_number}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              <button
                                className="eye-button"
                                onClickCapture={handleOpenModel}
                                onClick={() => {
                                  showImage(violation.violation_id);
                                }}
                                style={{
                                  border: "none",
                                  background: "transparent",
                                }}
                              >
                                <VisibilityIcon />
                              </button>
                              {/* MODALS */}
                              <Modal
                                animation={false}
                                size="lg"
                                show={showModal}
                                onHide={handleCloseModal}
                                aria-labelledby="example-modal-sizes-title-lg"
                              >
                                <Modal.Header>
                                  <Modal.Title>Image and Videos</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                  {vioImage !== null ? (
                                    vioImage.map((image, imagekey) => {
                                      return (
                                        <div
                                          className="conatiner"
                                          key={imagekey}
                                        >
                                          <div className="row">
                                            <div className="vio-img">
                                              <div className="col-md-6">
                                                <img
                                                  src={image.path}
                                                  alt=""
                                                  height="30%"
                                                  width="30%"
                                                />
                                              </div>
                                              <div className="col-md-6">
                                                <video
                                                  src={image.video_path}
                                                  height="30%"
                                                  width="30%"
                                                  autoPlay
                                                />
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })
                                  ) : (
                                    <h2>
                                      No Image or Video uploaded by the user{" "}
                                    </h2>
                                  )}
                                </Modal.Body>
                                <Modal.Footer>
                                  <Button
                                    variant="secondary"
                                    onClick={handleCloseModal}
                                  >
                                    Close
                                  </Button>
                                </Modal.Footer>
                              </Modal>
                            </StyledTableCell>
                          </StyledTableRow>
                        );
                      })}
                    </TableBody>
                    {/* <TablePagination rowsPerPageOptions={[2, 10, 15]} /> */}
                  </Table>
                </TableContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

// git hub token for police_app
// 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
