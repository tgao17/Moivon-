import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import styles from "./index.module.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "../Button";
import { BiMenuAltRight } from "react-icons/bi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SCROLL_INTO_VIEW_OPTIONS } from "../../utils/constants";
import NavigationDropdown from "../NavigationDropdown";
import Mask from "../Mask";

function ScrollingHeader({ genres = [], setMenuMask }, headerRef) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [maskState, setMaskState] = React.useState(0);
  const [collapse, setCollapse] = React.useState(false);

  React.useEffect(() => {
    // window.addEventListener('scroll', function() {
    //   if ((pathname === '/' && window.scrollY <= 100))
    //     hideCollapse();
    // })
    const menus = document.getElementsByClassName('navbar-collapse');
    for (let i = 0; i < menus.length; i ++) {
      menus[i].addEventListener('mousewheel', (e)=> {e.preventDefault()})
      menus[i].addEventListener('touchmove', (e)=> {e.preventDefault()})
    }
  }, [])

  function hideCollapse() {
    if (collapse || document.getElementsByClassName('scrolling-header collapseC').length) {
      document.getElementById('navbar-toggle1').click();
    }
  }

  function setMenuCollapse(collapse) {
    setCollapse(collapse);
    setMenuMask(collapse);
  }

  function goTo(url) {
    hideCollapse();
    setMaskState(1);
    setTimeout(() => {
      setMaskState(2);
      setTimeout(() => {
        setMaskState(3);
        navigate(url);
        setTimeout(() => {
          setMaskState(0);
        }, 2000)
      }, 1500);
    }, 100);
  }

  return (
    <>
      <div className={maskState===1?'m-active':(maskState===2?'m-active state1':(maskState===3?'m-active state2':''))}>
        <Mask />
      </div>
      <header className={"scrolling-header " + (collapse ? styles.collapseC + ' collapseC' : '')}>
        <Navbar
          // fixed-top for sticky header, active for adding black background
          className={"navbar scroll-up active " + (pathname.includes('event-detail') ? 'event-detail' : '')}
          bg="transparent"
          expand="lg"
          ref={headerRef}
        >
          <Container>
            <Navbar.Toggle id="navbar-toggle1" className={styles.collapseButton} aria-controls="basic-navbar-nav" onClick={() => setMenuCollapse(!collapse)}>
              {/* <BiMenuAltRight /> */}
              <div className={styles.collapseIcon}></div>
            </Navbar.Toggle>
            <Navbar.Brand
              className={styles.logo}
              onClick={() => {
                hideCollapse();
                pathname === "/"
                  ? window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
                  : goTo("/")
              }}
            >
              <img src="/img/moivon.png" alt="logo" width={45} />
            </Navbar.Brand>
            <div className={styles.navBarCustom}>
              <div className={`d-flex align-items-center gap-4 ${styles.last}`}>
                <div
                  className={
                    styles.customIcon + " align-items-center gap-3"
                  }
                >
                  <img src="/img/Search.svg" alt="Search" width={18} />
                  <Dropdown className={styles.dropdownBtn}>
                    <Dropdown.Toggle variant="none" id="dropdown-basic">
                      ENG
                    </Dropdown.Toggle>
                  </Dropdown>
                </div>
                <a className={styles.uploadButton}>
                  <Button type="primary" onClick={() => goTo("/upload-event" )}>Upload Event</Button>
                </a>
                <a className={styles.uploadButtonTablet}>
                  <Button type="primary" onClick={() => goTo("/upload-event" )}>UPLOAD</Button>
                </a>
              </div>
              <Navbar.Collapse className={styles.navbarCollapse} id="basic-navbar-nav">
                <Nav className={styles.navLink + " me-auto"}>
                  <NavigationDropdown
                    title="All Events"
                    customClass={styles.navDropdown}
                    id="basic-nav-dropdown"
                    goTo={goTo}
                    options={
                      (window.innerWidth <= 992) ? [
                        ...genres.map((option) => ({
                          _id: option._id,
                          link: `/all-events?genre=${option._id}`,
                          value: option?.genre,
                        })),
                      ] : [
                        { _id: "all", link: "/all-events", value: "All Events" },
                        ...genres.map((option) => ({
                          _id: option._id,
                          link: `/all-events?genre=${option._id}`,
                          value: option?.genre,
                        })),                        
                      ]
                    }
                  />
                  <Nav.Link
                    to="/"
                    as={Link}
                    onClick={() => {
                      hideCollapse();
                      setTimeout(() => {
                        document
                          .getElementById("about-page")
                          .scrollIntoView(SCROLL_INTO_VIEW_OPTIONS);
                      }, 200);
                    }}
                  >
                    About Us
                  </Nav.Link>
                  <Nav.Link
                    to="/"
                    as={Link}
                    onClick={() => {
                      hideCollapse();
                      setTimeout(() => {
                        document
                          .getElementById("contact-page")
                          .scrollIntoView(SCROLL_INTO_VIEW_OPTIONS);
                      }, 200);
                    }}
                  >
                    Contact Us
                  </Nav.Link>
                  <Nav.Link
                    href="#"
                    eventKey="disabled"
                    // className={`${
                    //   transparent ? styles.transparent : styles.disabledLink
                    // }`}
                    className={styles.disabledLink}
                    disabled
                  >
                    Calendar <span className={styles.soon}>SOON</span>
                  </Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </div>
          </Container>
        </Navbar>
      </header>
    </>
  );
}

const ForwardedScrollingHeader = React.forwardRef(ScrollingHeader);

export default ForwardedScrollingHeader;
