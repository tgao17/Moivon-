import React from "react";
import EventsInfo from "../EventsInfo";
import Text from "../Text";
import styles from "./index.module.css";

const EventAccordion = ({ event, isExpanded, onExpand }) => {
  return (
    <>
      <div className="border-b">
        <h3
          className={`text-truncate ${styles.title}`}
          title={event.title}
          onClick={onExpand}
        >
          {event.title}
        </h3>
        {isExpanded && (
          <div className={`pb-3 ${styles.evnts}`}>
            <Text>{event.description}</Text>
            <EventsInfo event={event} />
          </div>
        )}
      </div>
    </>
  );
};

export default EventAccordion;
