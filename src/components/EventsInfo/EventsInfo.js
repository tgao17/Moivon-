import React from "react";
import styles from "./eventinfo.module.css";

import Button from "../Button";
import { format, parseISO } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { getMapsLocation } from "../../utils/helpers";
import { fetchAllGenres } from "../../services/GenreService";
import { ALL_QUERIES } from "../../utils/endpoints";

function EventsInfo({ event }) {
  const { data: allGenres, isLoading: allGenresLoading } = useQuery(
    ALL_QUERIES.QUERY_ALL_GENRES(),
    fetchAllGenres
  );

  const getGenereText = () => {
    if (allGenresLoading) {
      return "";
    }

    const genre = allGenres?.data?.data?.find(
      (g) => g._id === event?.genre?._id
    );
    if (!genre) {
      return "";
    }
    return genre.genre;
  };

  return (
    <>
      <div className={styles.gridDiv}>
        <div className={`${styles.galleryBtn} ${styles.borderRight}`}>
          <Button>{getGenereText()}</Button>
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
