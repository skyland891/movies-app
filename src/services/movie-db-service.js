export default class MovieDBService {
  constructor() {
    this._apiKey = "5f60410837d49afcfda25f3223d55468";
    this.url = `https://api.themoviedb.org/3`;
  }

  async getResource(endpointURL, queryParams) {
    const response = await fetch(
      `${this.url + endpointURL}?api_key=${this._apiKey}${queryParams}`
    );
    return response;
  }

  async getByKeywords(keywords) {
    const response = await this.getResource(
      "/search/movie",
      `&query=${keywords}&page=1`
    );
    const movieList = await response.json();
    return movieList;
  }
}
