import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Card, Image, Typography, Rate } from "antd";
import { StarFilled } from "@ant-design/icons";
import format from "date-fns/format";
import parse from "date-fns/parse";
import Overview from "../overview";
import { GenreConsumer } from "../genre-context";

const getRatingColor = (raiting) => {
  if (raiting < 3) {
    return "#E90000";
  }
  if (raiting >= 3 && raiting < 5) {
    return "#E97E00";
  }
  if (raiting >= 5 && raiting < 7) {
    return "#E9D100";
  }
  if (raiting >= 7) {
    return "#66E900";
  }
  return null;
};

function FilmCard({
  title,
  overview,
  poster,
  date,
  raiting,
  id,
  ownMark,
  changeRaiting,
  rated,
  genreIds,
}) {
  const { Title, Text } = Typography;
  return (
    <GenreConsumer>
      {(genresList) => {
        const getGenresById = (ids) => {
          const genres = [...genresList];
          return ids.map((genreId) => {
            return genres.find((genre) => genre.id === genreId).name;
          });
        };

        return (
          <Card hoverable bodyStyle={{ padding: 0 }}>
            <Row style={{ maxWidth: 450 }} wrap={false}>
              <Col>
                <Image
                  width={183}
                  height={281}
                  src={`https://image.tmdb.org/t/p/w500${poster}`}
                />
              </Col>
              <Col
                style={{
                  width: 268,
                  padding: "0 20px",
                  position: "relative",
                  paddingTop: 12,
                }}
              >
                <Title level={4} style={{ maxWidth: 200 }}>
                  {title}
                </Title>
                {date && (
                  <Text
                    type="secondary"
                    style={{ display: "block", marginBottom: 10 }}
                  >
                    {format(
                      parse(date, "yyyy-MM-dd", new Date()),
                      "MMMM d, yyyy"
                    )}
                  </Text>
                )}
                <div
                  style={{
                    marginBottom: 7,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    gap: 8,
                  }}
                >
                  {getGenresById(genreIds).map((genre, index) => {
                    if (index > 1) {
                      return null;
                    }
                    return (
                      <Text key={`${genre + id}`} keyboard>
                        {genre}
                      </Text>
                    );
                  })}
                </div>
                <Overview overview={overview} />
                <Rate
                  style={{ display: "block" }}
                  character={<StarFilled style={{ fontSize: 15 }} />}
                  count={10}
                  defaultValue={0}
                  allowClear={false}
                  allowHalf
                  onChange={(value) => {
                    changeRaiting(value, id);
                  }}
                  value={ownMark}
                  disabled={rated}
                />
                <div
                  className="rating"
                  style={{
                    position: "absolute",
                    borderRadius: "100%",
                    border: "2px solid",
                    borderColor: getRatingColor(raiting),
                    width: 30,
                    height: 30,
                    top: 12,
                    right: 9,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <span>{raiting}</span>
                </div>
              </Col>
            </Row>
          </Card>
        );
      }}
    </GenreConsumer>
  );
}

FilmCard.propTypes = {
  title: PropTypes.string.isRequired,
  overview: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  poster: PropTypes.string,
  raiting: PropTypes.number,
  id: PropTypes.number.isRequired,
  ownMark: PropTypes.number,
  changeRaiting: PropTypes.func.isRequired,
  rated: PropTypes.bool,
  genreIds: PropTypes.arrayOf(PropTypes.number).isRequired,
};

FilmCard.defaultProps = {
  title: "",
  overview: "",
  date: "",
  poster: "",
  raiting: 0.0,
  id: 0,
  ownMark: 0,
  changeRaiting: () => {},
  genreIds: [],
};

export default FilmCard;
