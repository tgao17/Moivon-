import React from "react";
import styles from "./eventinfo.module.css";

import Button from "../Button";
import { format, parseISO } from "date-fns";
import { getMapsLocation, isValidURL } from "../../utils/helpers";

function EventsInfo({ event }) {
  return (
    <>
      <div className={styles.gridDiv}>
        <div className={`${styles.galleryBtn} ${styles.borderRight}`}>
          <Button>{event.btnText}</Button>
        </div>
        <div className={`${styles.dateDiv}  ${styles.borderRight}`}>
          <span className={styles.title}>Date</span>
          {event?.startDate && (
            <span className={styles.date}>
              {format(parseISO(event?.startDate), "dd MMM")}
            </span>
          )}
        </div>
        <div
          className={`text-truncate ${styles.locationDiv} ${styles.borderRight}`}
        >
          <a
            href={getMapsLocation(event.location)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className={styles.title}>Location</span>
            <span className={`text-uppercase ${styles.location}`}>
              {/* {isValidURL(event.location) ? "Open Map" : event.location} */}
              {event.location}
            </span>
          </a>
        </div>
      </div>
    </>
  );
}

export default EventsInfo;
