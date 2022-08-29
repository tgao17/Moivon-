import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Event from "../../components/Event";
import styles from "./index.module.css";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Heading from "../../components/Heading";
import Button from "../../components/Button";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import RouteTitle from "../../components/RouteTitle/RouteTitle";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchAllEvent } from "../../services/EventService";
import { ALL_QUERIES } from "../../utils/endpoints";
import Loader from "../../components/Loader";
import { calculateTotalPagesCount } from "../../utils/helpers";
import {
  useNavigate,
  useSearchParams,
  useLocation,
  createSearchParams,
} from "react-router-dom";
import { fetchAllGenres } from "../../services/GenreService";

const PER_PAGE = 10;

function AllEvent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const queryParams = Object.fromEntries([...searchParams]) || {};
  const { genre = "all" } = queryParams;

  const { data: allGenres, isLoading: allGenresLoading } = useQuery(
    ALL_QUERIES.QUERY_ALL_GENRES(),
    fetchAllGenres
  );

  const {
    isLoading,
    isError,
    error,
    data: eventsData,
    hasNextPage,
    fetchNextPage,
    isFetching,
  } = useInfiniteQuery(
    ALL_QUERIES.QUERY_ALL_EVENTS({ genre }),
    ({ pageParam = 1 }) =>
      fetchAllEvent({ page: pageParam, perPage: PER_PAGE, genreId: genre }),
    {
      getNextPageParam: (lastPageResponse, allPages) => {
        const totalEvents = lastPageResponse?.data?.totalEvent;
        const totalPages = calculateTotalPagesCount(PER_PAGE, totalEvents);
        const nextPage = allPages.length + 1;
        return nextPage <= totalPages ? nextPage : undefined;
      },
    }
  );

  if (isLoading) return <Loader />;

  const computedDataArray =
    eventsData?.pages?.flatMap((page) => page.data?.data) || [];

  const randomTabContent = () => {
    return (
      <Row>
        {computedDataArray.map((event) => (
          <Col md={4} className="mb-3" key={event._id}>
            <Event event={event} showGalleryOnHover />
          </Col>
        ))}
      </Row>
    );
  };

  const onTabChange = (key) => {
    navigate({
      pathname: location.pathname,
      search: `?${createSearchParams({
        ...queryParams,
        genre: key,
      })}`,
    });
  };

  return (
    <>
      <RouteTitle title="All Events" />
      <section className="section">
        <Container>
          <Row>
            <Col md={12}>
              <div className={" mb-4 " + styles.navHead}>
                <Heading mb="0" variant="subHeading">
                  Events
                </Heading>
                <div
                  className={`align-items-center justify-content-between gap-5 w-100 ${styles.topHead}`}
                >
                  <Tabs
                    id="controlled-tab-example"
                    activeKey={genre}
                    onSelect={onTabChange}
                    className={`mb-3 customTab ${styles.customTabs}`}
                  >
                    <Tab eventKey="all" title="All events"></Tab>
                    {!allGenresLoading &&
                      allGenres?.data?.data?.map((genre) => (
                        <Tab
                          key={genre._id}
                          eventKey={genre._id}
                          title={genre.genre}
                        ></Tab>
                      ))}
                  </Tabs>

                  <div className={styles.sortBtn}>
                    <Button type="outline">Sort</Button>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              {!isLoading && isError ? (
                <p className="no-data">
                  {error?.response?.data?.error || error.toString()}
                </p>
              ) : (
                <>
                  {computedDataArray.length === 0 && !isLoading ? (
                    <p className="no-data">No Event found</p>
                  ) : (
                    <InfiniteScroll
                      dataLength={computedDataArray.length}
                      next={fetchNextPage}
                      hasMore={hasNextPage}
                      loader={<h4>Loading...</h4>}
                    >
                      {randomTabContent()}
                    </InfiniteScroll>
                  )}
                </>
              )}
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default AllEvent;
