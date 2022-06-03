import React from "react";
import PropTypes from "prop-types";
import "./App.css";
import { Row, Col, Spin, Alert } from "antd";
import MovieDBService from "./services/movie-db-service";

import FilmCard from "./components/film-card";

const wrapperStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  width: "100vw",
  height: "100vh",
};

class App extends React.Component {
  constructor() {
    super();
    this.service = new MovieDBService();
    this.state = {
      movies: [],
      isLoading: true,
      isError: false,
    };
    this.getMovies();
  }

  getMovies = () => {
    this.service
      .getByKeywords("return")
      .then((movies) => {
        this.setState({
          movies: movies.results,
          isLoading: false,
          isError: false,
        });
      })
      .catch(() => {
        this.setState({
          movies: [],
          isLoading: false,
          isError: true,
        });
      });
  };

  render() {
    const { isLoading, isError, movies } = this.state;

    const hasData = !(isLoading || isError);

    const errorMessage = isError ? <ErrorView /> : null;
    const loader = isLoading ? <Loader /> : null;
    const films = hasData ? <FilmsView movies={movies} /> : null;

    return (
      <div className="app">
        {errorMessage}
        {loader}
        {films}
      </div>
    );
  }
}

const ErrorView = () => {
  return (
    <div style={wrapperStyle}>
      <Alert message="Error" description="Bad Request" type="error" showIcon />
    </div>
  );
};

const Loader = () => {
  return (
    <div style={wrapperStyle}>
      <Spin size="large" />
    </div>
  );
};

const FilmsView = ({ movies }) => {
  return (
    <Row wrap gutter={[35, 35]} justify={"center"}>
      {movies.map((movie) => (
        <Col key={movie.id}>
          <FilmCard
            title={movie.title}
            overview={movie.overview}
            poster={movie.poster_path}
            date={movie.release_date}
          />
        </Col>
      ))}
    </Row>
  );
};

FilmsView.propTypes = {
  movies: PropTypes.arrayOf(PropTypes.object).isRequired,
};

FilmsView.defaultProps = {
  movies: [],
};

export default App;
