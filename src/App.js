import React from "react";
import PropTypes from "prop-types";
import "./App.css";
import { Row, Col, Spin, Alert, Pagination } from "antd";
import { debounce } from "lodash";
import MovieDBService from "./services/movie-db-service";

import FilmCard from "./components/film-card";
import SearchInput from "./components/search-input";

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
      inputValue: "",
      isLoading: true,
      isError: false,
      totalMovies: 1,
      currentPage: 1,
    };
  }

  componentDidMount() {
    this.getMovies();
  }

  findMovies = (keywords, page = 1) => {
    this.setState((prevState) => {
      const newState = JSON.parse(JSON.stringify(prevState));
      return { ...newState, isLoading: true };
    });
    this.service
      .getByKeywords(keywords, page)
      .then((movies) => {
        this.setState({
          movies: movies.results,
          isLoading: false,
          isError: false,
          totalMovies: movies.total_results,
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

  debounceFindMovies = debounce(this.findMovies, 1200);

  getMovies = () => {
    new Promise((res) => {
      res(this.findMovies("return"));
    }).then(() => {
      this.setState({
        totalMovies: 20,
      });
    });
  };

  changeHandle = (e) => {
    this.setState((prevState) => {
      const newState = JSON.parse(JSON.stringify(prevState));
      return { ...newState, inputValue: e.target.value };
    });
    this.debounceFindMovies(e.target.value);
  };

  pageChange = (page) => {
    this.setState((prevState) => {
      const newState = JSON.parse(JSON.stringify(prevState));
      return { ...newState, currentPage: page };
    });
    this.findMovies(this.state.inputValue, page);
  };

  render() {
    const { isLoading, isError, movies, inputValue, totalMovies, currentPage } =
      this.state;

    const hasData = !(isLoading || isError);

    const errorMessage = isError ? <ErrorView /> : null;
    const loader = isLoading ? <Loader /> : null;
    const films = hasData ? (
      <FilmsView
        movies={movies}
        value={inputValue}
        changeHandle={this.changeHandle}
        totalMovies={totalMovies}
        pageChange={this.pageChange}
        currentPage={currentPage}
      />
    ) : null;

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

const FilmsView = ({
  movies,
  value,
  changeHandle,
  totalMovies,
  pageChange,
  currentPage,
}) => {
  return (
    <Col>
      <Row justify="center" style={{ marginBottom: 32 }}>
        <SearchInput value={value} changeHandle={changeHandle} />
      </Row>
      <Row>
        <Row
          wrap
          gutter={[35, 35]}
          justify={"center"}
          style={{ marginBottom: 40 }}
        >
          {movies.length === 0 ? (
            <div style={{ ...wrapperStyle, width: "100%", height: "100" }}>
              Movies not finded
            </div>
          ) : (
            movies.map((movie) => (
              <Col key={movie.id}>
                <FilmCard
                  title={movie.title}
                  overview={movie.overview}
                  poster={movie.poster_path}
                  date={movie.release_date}
                />
              </Col>
            ))
          )}
        </Row>
      </Row>
      <Row justify="center">
        <Pagination
          current={currentPage}
          defaultCurrent={1}
          defaultPageSize={20}
          total={totalMovies}
          onChange={pageChange}
        />
      </Row>
    </Col>
  );
};

FilmsView.propTypes = {
  movies: PropTypes.arrayOf(PropTypes.object).isRequired,
  value: PropTypes.string.isRequired,
  changeHandle: PropTypes.func.isRequired,
  totalMovies: PropTypes.number,
  pageChange: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
};

FilmsView.defaultProps = {
  movies: [],
  value: "",
  changeHandle: () => {},
  totalMovies: 1,
  pageChange: () => {},
  currentPage: 1,
};

export default App;
