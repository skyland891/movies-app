import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Card, Image, Typography } from "antd";
import format from "date-fns/format";
import parse from "date-fns/parse";
import Overview from "../overview";

function FilmCard({ title, overview, poster, date }) {
  const { Title, Text } = Typography;
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
        <Col style={{ width: 268, padding: "0 20px" }}>
          <Title level={4}>{title}</Title>
          {date && (
            <Text
              type="secondary"
              style={{ display: "block", marginBottom: 10 }}
            >
              {format(parse(date, "yyyy-MM-dd", new Date()), "MMMM d, yyyy")}
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
            <Text keyboard>Action</Text>
            <Text keyboard>Drama</Text>
          </div>
          <Overview overview={overview} />
        </Col>
      </Row>
    </Card>
  );
}

FilmCard.propTypes = {
  title: PropTypes.string.isRequired,
  overview: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  poster: PropTypes.string,
};

FilmCard.defaultProps = {
  title: "",
  overview: "",
  date: "",
  poster: "",
};

export default FilmCard;
