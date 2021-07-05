/* eslint-disable */
import React from "react";
import { useState, useEffect } from "react";
import "./styles.scss";
import {
  HeroSection,
  HomeDisplay,
  ShipPaginator,
  PeoplePaginator,
  PlanetPaginator,
} from "./components/index";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Posts from "./components/Paginator/Posts";
// import Footer from "./components/Footer/Footer";

const App = () => {
  /**GLOBAL DEFINED STATES
   * ALL STATES ARE USEFUL..
   * DO NOT DELETE
   */

  const [people, setPeople] = useState([]);
  const [planet, setPlanet] = useState([]);
  const [starShip, setStarShip] = useState([]);
  const [allData, setAllData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hide, setHide] = useState(true);
  const [pg, setPG] = useState(false);
  const [pHide, setPHide] = useState(true);
  const [searchResult, setSearchResult] = useState([]);

  //PAGINATION DATA
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPagePerPost] = useState(10);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;

  const handleChange = (event, value) => {
    setCurrentPage(value);
  };

  //DATA FETCH
  const allDataFetch = () => {
    const peopleRequest = [];
    const shipRequest = [];
    const planetRequest = [];

    for (let i = 1; i <= 9; i++) {
      peopleRequest.push(fetch("https://swapi.dev/api/people/?page=" + i));
    }

    for (let i = 1; i <= 4; i++) {
      planetRequest.push(fetch("https://swapi.dev/api/planets/?page=" + i));
    }

    for (let i = 1; i <= 4; i++) {
      shipRequest.push(fetch("https://swapi.dev/api/starships/?page=" + i));
    }

    const allResult = [...planetRequest, ...shipRequest, ...peopleRequest];

    Promise.all(allResult)
      .then((res) => Promise.all(res.map((r) => r.json())))
      .then((data) => {
        const totalList = [];
        data.forEach((d) => totalList.push(...d.results));
        setAllData(totalList);
        setPlanet(totalList.slice(0, 39));
        setStarShip(totalList.slice(40, 75));
        setPeople(totalList.slice(76));
        setIsLoading(false);
      });
  };

  useEffect(() => {
    allDataFetch();
  }, []);

  /**
   * *************************************************************************
   * INTELLIGENT REGEX SEARXH.. THIS FUNCTIONALITY PRODUCES THE CLOSEST RESULTS
   * TO THE USER INPUT IF THERE'S NO EXACT MATCH
   * **************************************************************************
   */

  const checkName = (name, str) => {
    var pattern = str
      .split("")
      .map((x) => {
        return `(?=.*${x})`;
      })
      .join("");
    var regex = new RegExp(`${pattern}`, "g");
    return name.match(regex);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim() === "") {
      console.log("no valid words");
      return;
    }
    setSearchResult(
      allData.filter(
        (data) =>
          data.name.toLowerCase().includes(search.toLowerCase().trim()) ||
          checkName(data.name.substring(0, 3), search.substring(0, 3))
      )
    );

    setHide(false);
    setPHide(false);
    setPG(true);
  };
  /************************************************************************
   * **********************************************************************
   */

  if (isLoading) {
    return (
      <main>
        <div className="fallback-container">
          <h1>...Loading</h1>
        </div>
      </main>
    );
  }
  return (
    <div>
      <main>
        <Router>
          <HeroSection
            allData={allData}
            setPHide={setPHide}
            setPG={setPG}
            setHide={setHide}
            search={search}
            setSearch={setSearch}
            handleSearch={handleSearch}
          />
          <Switch>
            <Route
              path="/"
              exact
              component={() =>
                hide && <HomeDisplay starShip={starShip} people={people} />
              }
            />
            <Route
              path="/people"
              exact
              component={() =>
                pHide && (
                  <PeoplePaginator
                    people={people}
                    setPeople={setPeople}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    indexOfLastPost={indexOfLastPost}
                    indexOfFirstPost={indexOfFirstPost}
                    postsPerPage={postsPerPage}
                    handleChange={handleChange}
                  />
                )
              }
            />
            <Route
              path="/ships"
              exact
              component={() =>
                pHide && (
                  <ShipPaginator
                    starShip={starShip}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    indexOfLastPost={indexOfLastPost}
                    indexOfFirstPost={indexOfFirstPost}
                    postsPerPage={postsPerPage}
                    handleChange={handleChange}
                  />
                )
              }
            />
            <Route
              path="/planets"
              exact
              component={() =>
                pHide && (
                  <PlanetPaginator
                    planet={planet}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    indexOfLastPost={indexOfLastPost}
                    indexOfFirstPost={indexOfFirstPost}
                    postsPerPage={postsPerPage}
                    handleChange={handleChange}
                  />
                )
              }
            />
          </Switch>
        </Router>
        {pg && (
          <Posts
            setHide={setHide}
            setPG={setPG}
            setPHide={setPHide}
            searchResult={searchResult}
            setSearch={setSearch}
          />
        )}
      </main>
    </div>
  );
};

export default App;
