import React, { useState, useEffect } from "react";
import moment from "moment";
import Axios from "axios";
import { useHistory } from "react-router-dom";

// material
import { Modal, Button } from "react-bootstrap";
import Switch from "@material-ui/core/Switch";
import TrafficIcon from "@material-ui/icons/Traffic";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

import "../styles/PeopleFilter.css";

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

function PeopleFilterSearch() {
  const classes = useStyles();

  let history = useHistory();

  const [violation, setViolation] = useState([]);
  const [people, setPeople] = useState([]);
  const [taluk, setTaluk] = useState([]);
  const [district, setDistrict] = useState([]);
  // Individual Violation Image
  const [vioImg, setVioImg] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [checked, setChecked] = useState(false);
  const [filterResult, setFilterResult] = useState([]);

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [mail, setMail] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    Axios.get(`${process.env.REACT_APP_NODE_API_PATH}/taluk-list`).then(
      (response) => {
        setTaluk(response.data);
      }
    );
  }, []);

  useEffect(() => {
    Axios.get(`${process.env.REACT_APP_NODE_API_PATH}/district-list`).then(
      (response) => {
        setDistrict(response.data);
      }
    );
  }, []);

  useEffect(() => {
    Axios.get(`${process.env.REACT_APP_NODE_API_PATH}/get-people-list`, {
      headers: { authorization: "Bearer " + localStorage.getItem("token") },
    })
      .then((response) => {
        if (response.data.auth === false) {
          history.push("/");
        } else {
          response.data[0].is_active === "0"
            ? setChecked(false)
            : setChecked(true);
          setPeople(response.data);
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
    }).then((response) => {
      console.log(response.data);
    });
  };

  // FilterSerach Function
  const filteredSearch = () => {
    Axios.post(`${process.env.REACT_APP_NODE_API_PATH}/people-search`, {
      people_name: name,
      people_mobile: mobile,
      people_mail: mail,
      people_area: area,
      people_city: city,
    }).then((response) => {
      setFilterResult(response.data);
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

  const showFilter = () => {
    document.getElementById("search-tab").style.display = "block";
  };

  const closeFilter = () => {
    document.getElementById("search-tab").style.display = "none";
  };

  return (
    <div className="people-filter">
      <div className="container">
        <div className="row">
          <div className="people-filter-page">
            <div className="people-filter-navbar">
              <div className="filterPage-leftSide">
                <a href="/get-people-list" className="back-icon">
                  <KeyboardBackspaceIcon />
                </a>
                <div className="people-filter-heading">
                  <h4>Search For People</h4>
                </div>
              </div>
            </div>
            <div className="search-table-transition">
              <button
                className="btn"
                style={{ color: "#fff" }}
                onClick={showFilter}
              >
                <FilterAltIcon color="primary" fontSize="large" />
                Filter
              </button>
            </div>
            <div className="search-table" id="search-tab">
              <div className="filter-box">
                <div className="select-bar">
                  <select
                    className="custom-select form-select-sm mb-3"
                    name="Filter by City"
                    onChange={(e) => {
                      setCity(e.target.value);
                    }}
                  >
                    {district.map((dist, key2) => {
                      return (
                        <option value={dist.district_name} key={key2}>
                          {dist.district_name}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="select-bar">
                  <select
                    className="custom-select form-select-sm mb-3"
                    onChange={(e) => {
                      setArea(e.target.value);
                    }}
                  >
                    {taluk.map((taluk, key) => {
                      return (
                        <option key={key} value={taluk.taluk}>
                          {taluk.taluk}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="select-bar">
                  <input
                    type="text"
                    placeholder="search by Name"
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="filter-box-2">
                <div className="select-bar">
                  <input
                    type="text"
                    placeholder="search by Mobile Number"
                    onChange={(e) => {
                      setMobile(e.target.value);
                    }}
                  />
                </div>
                <div className="select-bar">
                  <input
                    type="text"
                    placeholder="search by E-mail"
                    onChange={(e) => {
                      setMail(e.target.value);
                    }}
                  />
                </div>
                <div className="search-submit">
                  <button className="btn" onClick={filteredSearch}>
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
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">Name</StyledTableCell>
                    <StyledTableCell align="center">
                      Mobile Number
                    </StyledTableCell>
                    <StyledTableCell align="center">E-Mail</StyledTableCell>
                    <StyledTableCell align="center">Taluk</StyledTableCell>
                    <StyledTableCell align="center">District</StyledTableCell>
                    <StyledTableCell align="center">Violation</StyledTableCell>
                    <StyledTableCell align="center">
                      Block Status
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                {filterResult.length === 0 || null ? (
                  <TableBody>
                    <StyledTableRow>
                      <StyledTableCell>No Results Found</StyledTableCell>
                    </StyledTableRow>
                  </TableBody>
                ) : (
                  <TableBody>
                    {filterResult.map((filter, index) => {
                      return (
                        <StyledTableRow key={index}>
                          <StyledTableCell
                            component="th"
                            scope="row"
                            align="center"
                          >
                            {filter.name}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {filter.mobile_number}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {filter.email}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {filter.taluk}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {filter.district_name}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            <button
                              style={{
                                border: "none",
                                background: "transparent",
                              }}
                              onClickCapture={handleOpenModel}
                              onClick={() => {
                                getIndividualViolation(filter.people_id);
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
                                <Modal.Title>
                                  Violation's Registered
                                </Modal.Title>
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
                                  {violation.map((vio, keys) => {
                                    return (
                                      <>
                                        <tbody key={keys}>
                                          <tr>
                                            <td>
                                              {moment(vio.added_date).format(
                                                "MMMM Do YYYY"
                                              )}
                                            </td>
                                            <td>{vio.email}</td>
                                            {vio.violation_masters.map(
                                              (violation, viokey) => {
                                                return (
                                                  <p
                                                    style={{ color: "red" }}
                                                    key={viokey}
                                                  >
                                                    {violation.violation_master}
                                                  </p>
                                                );
                                              }
                                            )}
                                            <td>
                                              <button
                                                style={{
                                                  border: "none",
                                                  background: "transparent",
                                                }}
                                                onClick={() => {
                                                  showImg(vio.people_id);
                                                }}
                                                onClickCapture={
                                                  handleOpenModel1
                                                }
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
                                                        <div
                                                          className="conatiner"
                                                          key={index}
                                                        >
                                                          <div className="row">
                                                            <div className="vio-img">
                                                              <div className="col-md-6">
                                                                <img
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
                )}
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PeopleFilterSearch;
