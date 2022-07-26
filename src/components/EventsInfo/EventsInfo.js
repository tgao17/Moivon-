import React from "react";
import styles from "./eventinfo.module.css";

import Button from "../Button";

function EventsInfo() {
  return (
    <>
      <div className={styles.gridDiv}>
        <div className={`${styles.galleryBtn} ${styles.borderRight}`}>
          <Button>Gallery</Button>
        </div>
        <div className={`${styles.dateDiv}  ${styles.borderRight}`}>
          <span className={styles.title}>Date</span>
          <span className={styles.date}>30 june</span>
        </div>
        <div className={`${styles.locationDiv}  ${styles.borderRight}`}>
          <span className={styles.title}>Location</span>
          <span className={styles.location}>Bourbon st, 40</span>
        </div>
      </div>
    </>
  );
}
export default EventsInfo;
