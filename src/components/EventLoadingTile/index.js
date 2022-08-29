import React from "react";
import ContentLoader from "react-content-loader";

const TileContentLoader = (props) => {
  return (
    <ContentLoader
      speed={2}
      width={384}
      height={391}
      viewBox="0 0 384 391"
      backgroundColor="#343434"
      foregroundColor="#575757"
      {...props}
    >
      <path d="M 0 0 h 384 v 391 H 0 z" />
    </ContentLoader>
  );
};

const EventLoadingTile = ({ tileCount = 1, ...props }) => (
  <>
    {[...new Array(tileCount)].map((_, skeltonIndex) => {
      return <TileContentLoader key={`skel_${skeltonIndex}`} {...props} />;
    })}
  </>
);

export default EventLoadingTile;
