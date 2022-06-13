import React from "react";
import PropTypes from "prop-types";
import "./App.css";
import { Row, Col, Spin, Alert, Pagination, Tabs } from "antd";
import { debounce } from "lodash";
import { GenreProvider } from "./components/genre-context";
import MovieDBService from "./services/movie-db-service";

import FilmCard from "./components/film-card";
import SearchInput from "./components/search-input";

const { TabPane } = Tabs;

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
      genresList: [],
    };
  }

  componentDidMount() {
    this.getMovies();
    if (!localStorage.ratedMovies) {
      localStorage.ratedMovies = JSON.stringify([]);
    }
    this.getGenresList();
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

  getGenresList = () => {
    this.service
      .getGenresList()
      .then((genresList) => {
        this.setState((prevState) => {
          const newState = JSON.parse(JSON.stringify(prevState));
          return {
            ...newState,
            genresList: genresList.genres,
          };
        });
      })
      .catch(() => {
        this.setState((prevState) => {
          const newState = JSON.parse(JSON.stringify(prevState));
          return {
            ...newState,
            isError: true,
          };
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

  changeRaiting = (value, id) => {
    this.setState((prevState) => {
      const newState = JSON.parse(JSON.stringify(prevState));
      const index = newState.movies.findIndex((movie) => movie.id === id);
      newState.movies[index].raiting = value;
      return newState;
    });
    let ratedMovs;
    if (localStorage.ratedMovies) {
      ratedMovs = JSON.parse(localStorage.ratedMovies);
      const index = ratedMovs.findIndex((movie) => movie.id === id);
      if (index !== -1) {
        ratedMovs[index].raiting = value;
      } else {
        const ratedMovie = this.state.movies.find((movie) => movie.id === id);
        ratedMovie.raiting = value;
        ratedMovs.push(ratedMovie);
      }
      localStorage.ratedMovies = JSON.stringify(ratedMovs);
    }
  };

  ratedFilter = (movies) => {
    if(!localStorage.ratedMovies) {
      localStorage.ratedMovies = JSON.stringify([]);
    }
    const ratedMovs = JSON.parse(localStorage.ratedMovies);
    return movies.map((movie) => {
      const ratedMov = ratedMovs.find(
        (ratedMovie) => ratedMovie.id === movie.id
      );
      if (ratedMov) {
        return { ...movie, rating: ratedMov.raiting };
      }
      return movie;
    });
  };

  render() {
    const {
      isLoading,
      isError,
      movies,
      inputValue,
      totalMovies,
      currentPage,
      genresList,
    } = this.state;

    const newMovies = this.ratedFilter([...movies]);

    const hasData = !(isLoading || isError);

    const errorMessage = isError ? <ErrorView /> : null;
    const loader = isLoading ? <Loader /> : null;
    const films = hasData ? (
      <FilmsView
        movies={newMovies}
        value={inputValue}
        changeHandle={this.changeHandle}
        totalMovies={totalMovies}
        pageChange={this.pageChange}
        currentPage={currentPage}
        changeRaiting={this.changeRaiting}
        genresList={genresList}
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
  changeRaiting,
  genresList,
}) => {
  const ratedMovies = JSON.parse(localStorage.ratedMovies);
  return (
    <GenreProvider value={genresList}>
      <Col>
        <Row justify="center" style={{ marginBottom: 20 }}>
          <Tabs centered defaultActiveKey="1">
            <TabPane tab="Search" key="1">
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
                      <div
                        style={{
                          ...wrapperStyle,
                          width: "100%",
                          height: "100",
                        }}
                      >
                        Movies not founded
                      </div>
                    ) : (
                      movies.map((movie) => (
                        <Col key={movie.id}>
                          <FilmCard
                            id={movie.id}
                            title={movie.title}
                            overview={movie.overview}
                            poster={movie.poster_path}
                            date={movie.release_date}
                            raiting={movie.vote_average}
                            ownMark={movie.rating}
                            changeRaiting={changeRaiting}
                            genreIds={movie.genre_ids}
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
            </TabPane>
            <TabPane tab="Rated" key="2">
              <Row>
                <Row
                  wrap
                  gutter={[35, 35]}
                  justify={"center"}
                  style={{ marginBottom: 40 }}
                >
                  {ratedMovies.length === 0 ? (
                    <div
                      style={{ ...wrapperStyle, width: "100%", height: "100" }}
                    >
                      Movies not founded
                    </div>
                  ) : (
                    ratedMovies.map((movie) => (
                      <Col key={movie.id}>
                        <FilmCard
                          id={movie.id}
                          title={movie.title}
                          overview={movie.overview}
                          poster={movie.poster_path}
                          date={movie.release_date}
                          raiting={movie.vote_average}
                          ownMark={movie.raiting}
                          changeRaiting={changeRaiting}
                          genreIds={movie.genre_ids}
                          rated
                        />
                      </Col>
                    ))
                  )}
                </Row>
              </Row>
            </TabPane>
          </Tabs>
        </Row>
      </Col>
    </GenreProvider>
  );
};

FilmsView.propTypes = {
  movies: PropTypes.arrayOf(PropTypes.object).isRequired,
  value: PropTypes.string.isRequired,
  changeHandle: PropTypes.func.isRequired,
  totalMovies: PropTypes.number,
  pageChange: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  changeRaiting: PropTypes.func.isRequired,
  genresList: PropTypes.arrayOf(PropTypes.object).isRequired,
};

FilmsView.defaultProps = {
  movies: [],
  value: "",
  changeHandle: () => {},
  totalMovies: 1,
  pageChange: () => {},
  currentPage: 1,
  changeRaiting: () => {},
  genresList: [],
};

export default App;
