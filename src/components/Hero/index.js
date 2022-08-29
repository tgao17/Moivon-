import React from "react";
import styles from "./index.module.css";
import Button from "../../components/Button";
import { Link } from "react-router-dom";
function Hero() {
  const HandleScroll = () => {
    let a = document.querySelector(".wrapper-home");
    a.classList.remove("d-none");
  };
  return (
    <>
      <section
        className={`${styles.hero} d-flex justify-content-center align-items-center flex-column`}
      >
        <div className={styles.HeroContent}>
          <p className={styles.HeroPara}>
            FINDING YOUR NEXT CREATIVE EVENT SHOULD BE SO EASY
          </p>
          <div className={styles.SubPara}>
            <span className={styles.HeroSubPara}>
              Welcome to Moivon, your one source for uncovering art, creative,
              and design events. Explore our curated list, made for you, and
              fall in love in each!
            </span>
          </div>
          <div
            className={`${styles.heroIcons} d-flex gap-4 align-items-center flex-wrap`}
          >
            <Button type="primary" to="/all-events" as={Link}>
              Explore Now
            </Button>
            <span>
              <img src="/img/HeroVideo.svg" alt="video" /> Video of our events
            </span>
          </div>
        </div>
        <img
          src="/img/Arrow1.svg"
          alt="scroll-btn"
          className={styles.scrollBtn}
          onClick={HandleScroll}
        ></img>
      </section>
    </>
  );
}
export default Hero;
