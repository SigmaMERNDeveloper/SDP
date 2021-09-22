import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import moment from "moment";
import { Modal, Button } from "react-bootstrap";
import Switch from "@material-ui/core/Switch";
import "../styles/People.css";
import Axios from "axios";

// Material-icon import
import TrafficIcon from "@material-ui/icons/Traffic";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";

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

function People() {
  let history = useHistory();

  const classes = useStyles();

  const [people, setPeople] = useState([]);

  const [violation, setViolation] = useState([]);

  // Individual Violation Image
  const [vioImg, setVioImg] = useState([]);

  // // Toggle Button
  const [checked, setChecked] = useState(false);

  // For Modals
  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);

  useEffect(() => {
    Axios.get(`${process.env.REACT_APP_NODE_API_PATH}/get-people-list`, {
      headers: { authorization: "Bearer " + localStorage.getItem("token") },
    })
      .then((response) => {
        if (response.data.auth === false) {
          history.push("/");
        } else {
          setPeople(response.data);
          // response.data.forEach((data) => {
          //   console.log(data.is_active);
          // });

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
      `${process.env.REACT_APP_NODE_API_PATH}/get-people-violation/${id}`
    ).then((response) => {
      setViolation(response.data);
    });
  };

  // handleSwitchChange
  const handleChange = (id, is_active) => {
    setChecked(!checked);
    is_active = checked ? 0 : 1;
    Axios.put(`${process.env.REACT_APP_NODE_API_PATH}/block-people`, {
      people_id: id,
      is_active: is_active,
    });
  };

  const showImg = (id) => {
    // alert(id);
    Axios.get(
      `${process.env.REACT_APP_NODE_API_PATH}/people-vio-image/${id}`
    ).then((response) => {
      setVioImg(response.data);
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
    <div className="main-people">
      <div className="container">
        <div className="row">
          <div className="people-page">
            <div className="people-navbar">
              <div className="back-icon">
                <a href="/dashboard">
                  <KeyboardBackspaceIcon />
                </a>
              </div>
              <div className="people-navbar-header">
                <h4>People List</h4>
              </div>
            </div>
            <div className="filter-page">
              <button className="btn" style={{ backgroundColor: "#c1d9f3" }}>
                <a href="/filter-people">Filtered search</a>
              </button>
            </div>

            <div className="people-table">
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
                      <StyledTableCell align="center">E-Mail</StyledTableCell>
                      <StyledTableCell align="center">Taluk</StyledTableCell>
                      <StyledTableCell align="center">District</StyledTableCell>
                      <StyledTableCell align="center">
                        Violations Posted
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        Block User
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {people.map((people, key) => {
                      return (
                        <StyledTableRow key={key}>
                          <StyledTableCell
                            component="th"
                            scope="row"
                            align="center"
                          >
                            {people.name}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {people.mobile_number}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {people.email}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {people.taluk}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {people.district}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            <button
                              onClickCapture={handleOpenModel}
                              onClick={() => {
                                getIndividualViolation(people.people_id);
                              }}
                              style={{
                                border: "none",
                                background: "transparent",
                              }}
                            >
                              <TrafficIcon />
                            </button>
                            {/* Modals */}
                            <Modal
                              size="xl"
                              show={showModal}
                              onHide={handleCloseModal}
                              aria-labelledby="example-modal-sizes-title-lg"
                            >
                              <Modal.Header>
                                <Modal.Title>
                                  Violation's Registered
                                </Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                <table
                                  className="table-bordered table"
                                  style={{ border: "1px solid black" }}
                                  width="100%"
                                >
                                  <thead>
                                    <tr>
                                      <th>Added Date</th>
                                      <th>Taluk</th>
                                      <th>Address</th>
                                      <th>Violation</th>
                                      <th>Details</th>
                                    </tr>
                                  </thead>
                                  {violation.map((vio, viokey) => {
                                    return (
                                      <>
                                        <tbody key={viokey}>
                                          <tr>
                                            <td>
                                              {moment(vio.added_date).format(
                                                "MMMM Do YYYY"
                                              )}
                                            </td>
                                            <td>{vio.taluk}</td>
                                            <td>{vio.address}</td>
                                            <td style={{ color: "red" }}>
                                              {vio.violation_masters.map(
                                                (violation) => {
                                                  return (
                                                    <p>
                                                      {
                                                        violation.violation_master
                                                      }
                                                    </p>
                                                  );
                                                }
                                              )}
                                            </td>
                                            <td>
                                              <button
                                                onClick={() => {
                                                  showImg(vio.people_id);
                                                }}
                                                onClickCapture={
                                                  handleOpenModel1
                                                }
                                                style={{
                                                  border: "none",
                                                  background: "transparent",
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
                                                    vioImg.map((img, index) => {
                                                      return (
                                                        <div className="conatiner">
                                                          <div className="row">
                                                            <div className="vio-img">
                                                              <div className="col-md-6">
                                                                <img
                                                                  key={key}
                                                                  src={
                                                                    img.img_path
                                                                  }
                                                                  alt=""
                                                                  height="30%"
                                                                  width="30%"
                                                                />
                                                              </div>
                                                              <div className="col-md-6">
                                                                <video
                                                                  key={key}
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
                                                      No Image or video uploaded
                                                      by user
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
                                      </>
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
                                handleChange(people.people_id, people.is_active)
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
    </div>
  );
}

export default People;
