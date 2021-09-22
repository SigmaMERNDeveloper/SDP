import React, { useState, useEffect } from "react";
import Multiselect from "multiselect-react-dropdown";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import { Modal, Button } from "react-bootstrap";
import "../styles/DashboardFilter.css";

// Icons
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import VisibilityIcon from "@material-ui/icons/Visibility";
import PeopleIcon from "@material-ui/icons/People";
import SecurityIcon from "@material-ui/icons/Security";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

import Axios from "axios";

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

function DashboardFilter() {
  const classes = useStyles();

  const [img, setImg] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [filteredVio, setFilteredVio] = useState([]);
  const [vioMasters, setVioMasters] = useState([]);

  // filter options
  var [selectedViolation, setSelectedViolation] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    Axios.get(`${process.env.REACT_APP_NODE_API_PATH}/violation-list`).then(
      (res) => {
        setVioMasters(res.data);
      }
    );
  }, []);

  const violationSearch = () => {
    Axios.post(`${process.env.REACT_APP_NODE_API_PATH}/violation-search`, {
      selectedViolation: selectedViolation,
      startDate: startDate,
      endDate: endDate,
    }).then((response) => {
      if (response.data.length === 0) {
        alert("Please provide both start and End date");
      }
      console.log(response.data);
      setFilteredVio(response.data);
    });
  };

  const showImage = (id) => {
    Axios.get(`${process.env.REACT_APP_NODE_API_PATH}/get-vioImg/${id}`).then(
      (response) => {
        setImg(response.data);
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

  const showFilter = () => {
    document.getElementById("search-tab").style.display = "block";
  };

  const closeFilter = () => {
    document.getElementById("search-tab").style.display = "none";
  };

  return (
    <div className="violation-filter">
      <div className="container">
        <div className="row">
          <div className="violation-filter-page">
            <div className="violation-filter-navbar">
              <div className="filterPage-leftSide">
                <a href="/dashboard" className="back-icon">
                  <KeyboardBackspaceIcon />
                </a>
                <div className="violation-filter-heading">
                  <h4>Search For Violation</h4>
                </div>
              </div>
            </div>
            <div className="search-table-transition">
              <button
                className="btn"
                onClick={showFilter}
                style={{ color: "#fff" }}
              >
                <FilterAltIcon color="primary" fontSize="large" />
                Filter
              </button>
            </div>
            <div className="search-table" id="search-tab">
              <div className="filter-box">
                <div className="select-bar">
                  <Multiselect
                    showCheckbox={true}
                    placeholder="SELECT VIOLATIONS"
                    options={vioMasters}
                    displayValue="name"
                    onSelect={setSelectedViolation}
                  />
                </div>
                <div className="select-bar">
                  <DatePicker
                    isClearable
                    placeholderText="Select Start Date"
                    dateFormat="yyyy MMMM d"
                    selected={startDate}
                    onChange={(startDate) => setStartDate(startDate)}
                    selectsStart
                    startDate={startDate}
                  />
                  <DatePicker
                    isClearable
                    placeholderText="Select End Date"
                    dateFormat="yyyy MMMM d"
                    selected={endDate}
                    onChange={(endDate) => setEndDate(endDate)}
                    selectsEnd
                    endDate={endDate}
                  />
                </div>
                <div className="filter-box-2">
                  <div className="search-submit">
                    <button className="btn" onClick={violationSearch}>
                      <SearchIcon />
                      search
                    </button>
                    <button className="btn" onClick={closeFilter}>
                      <CloseIcon />
                      close
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="search-results">
              <TableContainer component={Paper} style={{ maxHeight: 340 }}>
                <Table className={classes.table} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center">Person</StyledTableCell>
                      <StyledTableCell align="center">Date</StyledTableCell>
                      <StyledTableCell align="center">
                        Violations
                      </StyledTableCell>
                      <StyledTableCell align="center">Address</StyledTableCell>
                      <StyledTableCell align="center">
                        Mobile Number
                      </StyledTableCell>
                      <StyledTableCell align="center">Details</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  {filteredVio.length === 0 || "" ? (
                    <TableBody>
                      <StyledTableRow>
                        <StyledTableCell>No Results Found</StyledTableCell>
                      </StyledTableRow>
                    </TableBody>
                  ) : (
                    <TableBody>
                      {filteredVio.map((violation, index) => {
                        return (
                          <StyledTableRow key={index}>
                            <StyledTableCell>
                              {violation.people_id ? (
                                <PeopleIcon />
                              ) : (
                                <SecurityIcon />
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
                                    <div className="dyn-violation" key={viokey}>
                                      <p style={{ display: "flex " }}>
                                        {violation.violation_master}
                                      </p>
                                    </div>
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
                                  {img !== null ? (
                                    img.map((image, imagekey) => {
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
                  )}
                </Table>
              </TableContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardFilter;
