import React from "react";
import styles from "./index.module.css";

const Loader = () => {
  return (
    <div className={styles.loader}>
      <img src="/img/loader.gif" alt="loader" width={50} />
    </div>
  );
};

export default Loader;
