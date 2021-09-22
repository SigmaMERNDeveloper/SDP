import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import "../styles/Rank.css";
import Axios from "axios";

// For Date
import moment from "moment";

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

function Rank() {
  let history = useHistory();

  const classes = useStyles();

  const [rank, setRank] = useState([]);

  // update Rank
  const [newRank, setNewRank] = useState("");

  // For Modals
  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);

  useEffect(() => {
    Axios.get(`${process.env.REACT_APP_NODE_API_PATH}/get-police-ranks`, {
      headers: { authorization: "Bearer " + localStorage.getItem("token") },
    })
      .then((response) => {
        setRank(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [history]);

  // Add Rank
  const addRank = () => {
    Axios.post(`${process.env.REACT_APP_NODE_API_PATH}/add-rank`, {
      newRank: newRank,
    }).then((response) => {
      if (response) {
        window.location.reload();
      }
    });
  };

  // Edit Rank
  const handleEdit = (id) => {
    Axios.put(`${process.env.REACT_APP_NODE_API_PATH}/update-rank`, {
      newRank: newRank,
      id: id,
    }).then((response) => {
      window.location.reload();
    });
  };

  // Delete Rank
  const handleDelete = (id) => {
    Axios.put(`${process.env.REACT_APP_NODE_API_PATH}/delete-rank`, {
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
    <div className="main-rank">
      <div className="container">
        <div className="row">
          <div className="rank-page">
            <div className="rank-navbar">
              <div className="leftSide">
                <div className="back-icon">
                  <a href="/dashboard">
                    <KeyboardBackspaceIcon />
                  </a>
                </div>
                <div className="rank-heading">
                  <h4>Rank</h4>
                </div>
              </div>
              <div className="rank-navbar-header">
                <button
                  className="btn"
                  style={{ backgroundColor: "#edf0f7" }}
                  onClick={handleOpenModel1}
                >
                  <AddIcon />
                  Add Rank
                </button>
                {/* Add Rank Modal */}
                <Modal show={showModal1} onHide={handleCloseModal1}>
                  <Modal.Header>
                    <Modal.Title>Add Rank</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Rank Name"
                      required
                      onChange={(e) => {
                        setNewRank(e.target.value);
                      }}
                    />
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal1}>
                      Close
                    </Button>
                    <Button className="primary" onClick={addRank}>
                      Add
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>
            </div>
            <div className="rank-table">
              <TableContainer component={Paper} style={{ maxHeight: 500 }}>
                <Table
                  className={classes.table}
                  aria-label="customized table"
                  stickyHeader
                >
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center">Rank</StyledTableCell>
                      <StyledTableCell align="center">
                        Added Date
                      </StyledTableCell>
                      <StyledTableCell align="center">Edit</StyledTableCell>
                      <StyledTableCell align="center">Delete</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rank.map((rank) => {
                      return (
                        <StyledTableRow key={rank.police_rank_id}>
                          <StyledTableCell
                            component="th"
                            scope="row"
                            align="center"
                          >
                            {rank.police_rank}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {moment(rank.added_date).format(
                              "MMMM Do YYYY, h:mm a"
                            )}
                          </StyledTableCell>
                          <StyledTableCell
                            component="th"
                            scope="row"
                            align="center"
                          >
                            {/* onclick open modal  */}
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
                                <Modal.Title>Edit Rank</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                <input
                                  className="form-control"
                                  type="text"
                                  onChange={(e) => {
                                    setNewRank(e.target.value);
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
                                    handleEdit(rank.police_rank_id);
                                  }}
                                >
                                  Edit
                                </Button>
                              </Modal.Footer>
                            </Modal>
                          </StyledTableCell>
                          <StyledTableCell>
                            <button
                              style={{
                                border: "none",
                                background: "transparent",
                              }}
                              onClick={() => {
                                handleDelete(rank.police_rank_id);
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

export default Rank;
