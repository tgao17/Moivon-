import React from "react";
import EventsInfo from "../EventsInfo";
import Text from "../Text";

const EventAccordion = ({ event, isExpanded, onExpand }) => {
  return (
    <>
      <div className="border-b">
        <h3
          onClick={onExpand}
          // onMouseEnter={() => setShow(true)}
          // onMouseLeave={() => setShow(false)}
        >
          {event.title}
        </h3>
        {isExpanded && (
          <div className={`pb-4`}>
            <Text>{event.description}</Text>
            <EventsInfo btn={event.btnText} />
          </div>
        )}
      </div>
    </>
  );
};

export default EventAccordion;
