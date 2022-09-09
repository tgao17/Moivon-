import React from "react";
import Col from "react-bootstrap/Col";
import { EventLoadingTile } from "../../components/EventLoadingTile";

const AllEventLoadingPlaceholder = ({ tileCount = 10 }) => {
  return (
    <>
      {[...new Array(tileCount)].map((_, skeltonIndex) => {
        return (
          <Col md={6} lg={4} className="mb-3">
            <EventLoadingTile key={`skeltonIndex_${skeltonIndex}`} />
          </Col>
        );
      })}
    </>
  );
};

export default AllEventLoadingPlaceholder;
