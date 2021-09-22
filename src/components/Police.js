import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import moment from "moment";
import { Modal, Button } from "react-bootstrap";
import "../styles/Police.css";
import Switch from "@material-ui/core/Switch";
import Axios from "axios";

import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import TrafficIcon from "@material-ui/icons/Traffic";

// Material-ui/table imports
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import SecurityIcon from "@material-ui/icons/Security";

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

function Police() {
  let history = useHistory();

  const classes = useStyles();

  const [police, setPolice] = useState([]);

  const [violation, setViolation] = useState([]);

  // Individual Violation Image
  const [vioImg, setVioImg] = useState([]);

  // For Modals
  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);

  // Toggle Button
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    Axios.get(`${process.env.REACT_APP_NODE_API_PATH}/get-police-details`, {
      headers: { authorization: "Bearer " + localStorage.getItem("token") },
    })
      .then((response) => {
        if (response.data.auth === false) {
          history.push("/");
        } else {
          // console.log(response.data);
          setPolice(response.data);
          response.data[0].is_active === "0"
            ? setChecked(false)
            : setChecked(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [history]);

  const getIndividualViolation = (id) => {
    Axios.get(
      `${process.env.REACT_APP_NODE_API_PATH}/get-police-violation/${id}`
    ).then((response) => {
      setViolation(response.data);
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

  // Modal Button
  const handleImage = (id) => {
    Axios.get(`http://localhost:3001/police-vio-image/${id}`).then(
      (response) => {
        setVioImg(response.data);
      }
    );
  };

  // handleSwitchChange
  const handleChange = (id, is_active) => {
    setChecked(!checked);
    is_active = checked ? 0 : 1;
    Axios.put("http://localhost:3001/block-police", {
      police_id: id,
      is_active: is_active,
    }).then((response) => {
      console.log(response.data);
    });
  };

  return (
    <div className="main-police">
      <div className="container">
        <div className="row">
          <div className="police-page">
            <div className="police-navbar">
              <div className="leftSide">
                <a href="/dashboard">
                  <KeyboardBackspaceIcon />
                </a>
                <div className="police-heading">
                  <h4>Police List</h4>
                </div>
              </div>
            </div>
          </div>
          <div className="navigate">
            <button className="btn" style={{ backgroundColor: "#c1d9f3" }}>
              <a href="/filter-police">Filter Search</a>
            </button>
          </div>
          <div className="police-table">
            <TableContainer component={Paper} style={{ maxHeight: 500 }}>
              <Table
                className={classes.table}
                aria-label="customized table"
                stickyHeader
              >
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">Name</StyledTableCell>
                    <StyledTableCell align="center">
                      Mobile Number
                    </StyledTableCell>
                    <StyledTableCell align="center">Rank</StyledTableCell>
                    <StyledTableCell align="center">
                      GPF No/CPS No
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      Police Station
                    </StyledTableCell>
                    <StyledTableCell align="center">Violation</StyledTableCell>
                    <StyledTableCell align="center">
                      Block Status
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {police.map((police, key) => {
                    return (
                      <StyledTableRow key={key}>
                        <StyledTableCell
                          component="th"
                          scope="row"
                          align="center"
                        >
                          {police.name}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {police.mobile_number}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {police.police_rank}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {police.police_number}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {police.police_station}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <button
                            style={{
                              border: "none",
                              background: "transparent",
                            }}
                            onClickCapture={handleOpenModel}
                            onClick={() => {
                              getIndividualViolation(police.police_id);
                            }}
                          >
                            <TrafficIcon />
                          </button>
                          {/* MODALS */}
                          <Modal
                            size="xl"
                            show={showModal}
                            onHide={handleCloseModal}
                            aria-labelledby="example-modal-sizes-title-lg"
                          >
                            <Modal.Header>
                              <Modal.Title>Violation's Registered</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              <table
                                className="table table-bordered"
                                style={{ border: "1px solid black" }}
                                width="100%"
                              >
                                <thead>
                                  <tr>
                                    <th>Added Date</th>
                                    <th>E-mail</th>
                                    <th>Violation</th>
                                    <th>Details</th>
                                  </tr>
                                </thead>
                                {violation.map((vio, viokey) => {
                                  return (
                                    <tbody key={viokey}>
                                      <tr>
                                        <td>
                                          {moment(vio.added_date).format(
                                            "MMMM Do YYYY"
                                          )}
                                        </td>
                                        <td>{vio.email}</td>
                                        <td style={{ color: "red" }}>
                                          {vio.violation_masters.map(
                                            (violation) => {
                                              return (
                                                <p>
                                                  {violation.violation_master}
                                                </p>
                                              );
                                            }
                                          )}
                                        </td>
                                        <td>
                                          <button
                                            style={{
                                              border: "none",
                                              background: "transparent",
                                            }}
                                            onClickCapture={handleOpenModel1}
                                            onClick={() => {
                                              handleImage(vio.police_id);
                                            }}
                                          >
                                            <SecurityIcon />
                                          </button>
                                          {/* Modal-2 */}
                                          <Modal
                                            size="xl"
                                            show={showModal1}
                                            onHide={handleCloseModal1}
                                            aria-labelledby="example-modal-sizes-title-lg"
                                          >
                                            <Modal.Header>
                                              <Modal.Title>
                                                Images and Videos
                                              </Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                              {vioImg !== null ? (
                                                vioImg.map((img, imgkey) => {
                                                  return (
                                                    <div
                                                      className="conatiner"
                                                      key={imgkey}
                                                    >
                                                      <div className="row">
                                                        <div className="vio-img">
                                                          <div className="col-md-6">
                                                            <img
                                                              src={img.img_path}
                                                              alt=""
                                                              height="30%"
                                                              width="30%"
                                                            />
                                                          </div>
                                                          <div className="col-md-6">
                                                            <video
                                                              src={
                                                                img.video_path
                                                              }
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
                                                  No Image or Video to Display
                                                </h2>
                                              )}
                                            </Modal.Body>
                                            <Modal.Footer>
                                              <Button
                                                variant="secondary"
                                                onClick={handleCloseModal1}
                                              >
                                                Close
                                              </Button>
                                            </Modal.Footer>
                                          </Modal>
                                        </td>
                                      </tr>
                                    </tbody>
                                  );
                                })}
                              </table>
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
                        <StyledTableCell align="center">
                          <Switch
                            color="secondary"
                            checked={checked}
                            onChange={() =>
                              handleChange(police.police_id, police.is_active)
                            }
                          />
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
  );
}

export default Police;
