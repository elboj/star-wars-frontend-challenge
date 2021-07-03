import React from "react";
import { useState, useEffect } from "react";
import { Container, Grid } from "@material-ui/core";
import Heading from "../Heading/Heading";
import People from "../HomeDisplay/People/People";
import { Pagination } from "@material-ui/lab";
import StarShips from "../HomeDisplay/Starships/StarShips";

function PeoplePaginator({ people }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPagePerPost] = useState(10);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = people.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(people.length / postsPerPage);

  const handleChange = (event, value) => {
    setCurrentPage(value);
  };

  console.log(currentPosts);

  return (
    <div>
      <Heading name="Popular People" />
      <Container maxWidth="md" className="starship-container">
        <Grid container spacing={4}>
          {currentPosts.map((person, index) => {
            return (
              <Grid key={index} item xs={12} sm={6} md={6}>
                <People {...person} />
              </Grid>
            );
          })}
        </Grid>
        <Pagination
          count={totalPages}
          variant="outlined"
          shape="rounded"
          page={currentPage}
          onChange={handleChange}
        />
      </Container>
    </div>
  );
}

export default PeoplePaginator;
