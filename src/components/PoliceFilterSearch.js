import React, { useState, useEffect } from "react";
import moment from "moment";
import Axios from "axios";
import { useHistory } from "react-router-dom";

// material
import { Modal, Button } from "react-bootstrap";
import Switch from "@material-ui/core/Switch";
import TrafficIcon from "@material-ui/icons/Traffic";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

import "../styles/PoliceFilter.css";

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
import FilterAltIcon from "@mui/icons-material/FilterAlt";

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

function PoliceFilterSearch() {
  const classes = useStyles();

  let history = useHistory();

  const [violation, setViolation] = useState([]);
  const [police, setPolice] = useState([]);
  const [taluk, setTaluk] = useState([]);
  const [district, setDistrict] = useState([]);
  const [policeRankSelect, setPoliceRankSelect] = useState([]);
  const [stationSelect, setStationSelect] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);

  // Individual Violation Image
  const [vioImg, setVioImg] = useState([]);

  const [checked, setChecked] = useState(false);
  const [filterResult, setFilterResult] = useState([]);

  const [talukSelect, setTalukSelect] = useState("");
  const [districtSelect, setDistrictSelect] = useState("");
  const [policeStation, setPoliceStation] = useState("");
  const [policeRank, setPoliceRank] = useState("");
  const [policeName, setPoliceName] = useState("");
  const [mobileNum, setMobileNum] = useState("");
  const [gpfNumber, setGpfNumber] = useState("");

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
    Axios.get(`${process.env.REACT_APP_NODE_API_PATH}/get-police-ranks`, {
      headers: { authorization: "Bearer " + localStorage.getItem("token") },
    }).then((response) => {
      setPoliceRankSelect(response.data);
    });
  }, []);

  useEffect(() => {
    Axios.get(`${process.env.REACT_APP_NODE_API_PATH}/get-police-station`, {
      headers: { authorization: "Bearer " + localStorage.getItem("token") },
    }).then((response) => {
      setStationSelect(response.data);
    });
  }, []);

  useEffect(() => {
    Axios.get(`${process.env.REACT_APP_NODE_API_PATH}/get-police-details`, {
      headers: { authorization: "Bearer " + localStorage.getItem("token") },
    })
      .then((response) => {
        if (response.data.auth === false) {
          history.push("/");
        } else {
          response.data[0].is_active === "0"
            ? setChecked(false)
            : setChecked(true);
          setPolice(response.data);
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
      console.log(response.data);
      setViolation(response.data);
    });
  };

  // handleSwitchChange
  const handleChange = (id, is_active) => {
    setChecked(!checked);
    is_active = checked ? 0 : 1;
    Axios.put(`${process.env.REACT_APP_NODE_API_PATH}/block-police`, {
      police_id: id,
      is_active: is_active,
    });
  };

  // FilterSerach Function
  const filteredSearch = () => {
    Axios.post(`${process.env.REACT_APP_NODE_API_PATH}/police-search`, {
      taluk: talukSelect,
      district: districtSelect,
      police_station: policeStation,
      police_rank: policeRank,
      police_name: policeName,
      mobile_num: mobileNum,
      gpf_number: gpfNumber,
    }).then((response) => {
      setFilterResult(response.data);
    });
  };

  // For Display individual  Images
  const handleImage = (id) => {
    Axios.get(`http://localhost:3001/police-vio-image/${id}`).then(
      (response) => {
        setVioImg(response.data);
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
    <div className="police-filter">
      <div className="container">
        <div className="row">
          <div className="police-filter-page">
            <div className="police-filter-navbar">
              <div className="filterPage-leftSide">
                <a href="/police-list" className="back-icon">
                  <KeyboardBackspaceIcon />
                </a>
                <div className="police-filter-heading">
                  <h4>Search For Police</h4>
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
                    name="Filter by Station"
                    onChange={(e) => {
                      setDistrictSelect(e.target.value);
                    }}
                  >
                    {district.map((dis, diskey) => {
                      return (
                        <option key={diskey} value={dis.district_name}>
                          {dis.district_name}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="select-bar">
                  <select
                    className="custom-select form-select-sm mb-3"
                    name="Filter by Station"
                    onChange={(e) => {
                      setTalukSelect(e.target.value);
                    }}
                  >
                    {taluk.map((taluk, taluk_id) => {
                      return (
                        <option defaultValue value={taluk.taluk} key={taluk_id}>
                          {taluk.taluk}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="select-bar">
                  <select
                    className="custom-select form-select-sm mb-3"
                    name="Filter by Station"
                    onChange={(e) => {
                      setPoliceStation(e.target.value);
                    }}
                  >
                    {stationSelect.map((police, index) => {
                      return (
                        <option key={index} value={police.police_station}>
                          {police.police_station}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="select-bar">
                  <select
                    className="custom-select form-select-sm mb-3"
                    onChange={(e) => {
                      setPoliceRank(e.target.value);
                    }}
                  >
                    {policeRankSelect.map((police, rankKey) => {
                      return (
                        <option key={rankKey} value={police.police_rank}>
                          {police.police_rank}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div className="filter-box-2">
                <div className="select-bar">
                  <input
                    type="text"
                    placeholder="search by Name"
                    onChange={(e) => {
                      setPoliceName(e.target.value);
                    }}
                  />
                </div>
                <div className="select-bar">
                  <input
                    type="text"
                    placeholder="search by Mobile Number"
                    onChange={(e) => {
                      setMobileNum(e.target.value);
                    }}
                  />
                </div>
                <div className="select-bar">
                  <input
                    type="text"
                    placeholder="search by GPF/CPS"
                    onChange={(e) => {
                      setGpfNumber(e.target.value);
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
                {filterResult.length === 0 || null ? (
                  <TableBody>
                    <StyledTableRow>
                      <StyledTableCell>No Results Found</StyledTableCell>
                    </StyledTableRow>
                  </TableBody>
                ) : (
                  <TableBody>
                    {filterResult.map((filter, filterkey) => {
                      return (
                        <StyledTableRow key={filterkey}>
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
                            {filter.police_rank}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {filter.police_number}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {filter.police_station}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            <button
                              style={{
                                border: "none",
                                background: "transparent",
                              }}
                              onClickCapture={handleOpenModel}
                              onClick={() => {
                                getIndividualViolation(filter.police_id);
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
                )}
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PoliceFilterSearch;
