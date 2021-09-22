import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "../styles/SubDivision.css";
import moment from "moment";
import Axios from "axios";

//Modals
import { Modal, Button } from "react-bootstrap";

// Icons
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";

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

function SubDivision() {
  let history = useHistory();

  const classes = useStyles();

  const [subDivision, setSubDivision] = useState([]);

  const [newSubdivi, setSubdiv] = useState("");
  const [newSubDiv, setNewSubDiv] = useState("");

  // For Modals
  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);

  useEffect(() => {
    Axios.get(`${process.env.REACT_APP_NODE_API_PATH}/get-sub-division-list`, {
      headers: { authorization: "Bearer " + localStorage.getItem("token") },
    })
      .then((response) => {
        if (response.data.auth === false) {
          history.push("/");
        } else {
          setSubDivision(response.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [history]);

  const addSubdiv = () => {
    Axios.post(`${process.env.REACT_APP_NODE_API_PATH}/add-subdivision`, {
      newSubdiv: newSubdivi,
    }).then((response) => {
      if (response) {
        window.location.reload();
      }
    });
  };

  const handleSubEdit = (id) => {
    console.log(id);
    Axios.put(`${process.env.REACT_APP_NODE_API_PATH}/update-subdivision`, {
      newSubDiv: newSubDiv,
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
    <div className="main-subdivision">
      <div className="container">
        <div className="row">
          <div className="subdivision-page">
            <div className="subdivision-navbar">
              <div className="leftSide">
                <div className="back-icon">
                  <a href="/dashboard">
                    <KeyboardBackspaceIcon />
                  </a>
                </div>
                <div className="subdivision-heading">
                  <h4>Sub Divisions</h4>
                </div>
              </div>
              <div className="subdivision-navbar-header">
                <button
                  className="btn"
                  style={{ backgroundColor: "#edf0f7" }}
                  onClick={handleOpenModel1}
                >
                  <AddIcon />
                  Add Sub Division
                </button>
                <Modal show={showModal1} onHide={handleCloseModal1}>
                  <Modal.Header>
                    <Modal.Title>Add SubDivision</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Sub Division"
                      required
                      onChange={(e) => {
                        setSubdiv(e.target.value);
                      }}
                    />
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal1}>
                      Close
                    </Button>
                    <Button className="primary" onClick={addSubdiv}>
                      Add
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>
            </div>
            <div className="subdivision-table">
              <TableContainer component={Paper} style={{ maxHeight: 500 }}>
                <Table
                  className={classes.table}
                  aria-label="customized table"
                  stickyHeader
                >
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center">
                        Sub Division
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        Added Date
                      </StyledTableCell>
                      <StyledTableCell align="center">Edit</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {subDivision.map((division) => {
                      return (
                        <StyledTableRow key={division.sub_division_id}>
                          <StyledTableCell
                            component="th"
                            scope="row"
                            align="center"
                          >
                            {division.sub_division}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {moment(division.added_date).format(
                              "MMMM Do YYYY, h:mm a"
                            )}
                          </StyledTableCell>
                          <StyledTableCell align="center">
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
                                <Modal.Title>Edit SubDivision</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                <input
                                  className="form-control"
                                  type="text"
                                  onChange={(e) => {
                                    setNewSubDiv(e.target.value);
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
                                    handleSubEdit(division.sub_division_id);
                                  }}
                                >
                                  Edit
                                </Button>
                              </Modal.Footer>
                            </Modal>
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

export default SubDivision;
