export default class MovieDBService {
  constructor() {
    this._apiKey = "5f60410837d49afcfda25f3223d55468";
    this.url = `https://api.themoviedb.org/3`;
  }

  async getResource(endpointURL = "", queryParams = "") {
    let response;
    try {
      response = await fetch(
        `${this.url + endpointURL}?api_key=${this._apiKey}${queryParams}`
      );
    } catch (error) {
      throw error;
    }

    return response;
  }

  async getByKeywords(keywords, page = 1) {
    let movieList = [];
    try {
      const response = await this.getResource(
        "/search/movie",
        `&query=${keywords}&page=${page}`
      );
      if (response.status === 404) {
        throw new Error();
      }
      movieList = await response.json();
    } catch (error) {
      throw error;
    }
    return movieList;
  }

  async getGenresList() {
    let genreList = [];
    try {
      const response = await this.getResource("/genre/movie/list");
      if (response.status === 404) {
        throw new Error();
      }
      genreList = await response.json();
    } catch (error) {
      throw error;
    }
    return genreList;
  }
}
