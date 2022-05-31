import React from "react";
import "./App.css";
import { Row, Col } from "antd";
import MovieDBService from "./services/movie-db-service";

import FilmCard from "./components/film-card";

class App extends React.Component {
  constructor() {
    super();
    this.service = new MovieDBService();
    this.state = {
      movies: [],
    };
    this.getMovies();
  }

  getMovies = () => {
    this.service.getByKeywords("return").then((movies) => {
      this.setState({
        movies: movies.results,
      });
    });
  };

  render() {
    return (
      <div className="app">
        <Row wrap gutter={[35, 35]} justify={"center"}>
          {this.state.movies.map((movie) => (
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
      </div>
    );
  }
}

export default App;
