import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Event from "../../components/Event";
import styles from "./index.module.css";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import { AiFillCaretUp } from "react-icons/ai";
import Heading from "../../components/Heading";
import Button from "../../components/Button";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import RouteTitle from "../../components/RouteTitle/RouteTitle";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchAllEvent } from "../../services/EventService";
import { ALL_QUERIES } from "../../utils/endpoints";
import Loader from "../../components/Loader";
import { calculateTotalPagesCount, toTitleCase } from "../../utils/helpers";
import {
  useNavigate,
  useSearchParams,
  useLocation,
  createSearchParams,
  Link,
} from "react-router-dom";
import { fetchAllGenres } from "../../services/GenreService";
import EventLoadingTile from "../../components/EventLoadingTile";

const PER_PAGE = 10;

export const ALL_EVENTS_FILTERS = {
  latest: {
    key: "latest",
  },
  earliest: { key: "earliest" },
  alphabetical: { key: "title", icon: (props) => <AiFillCaretUp {...props} /> },
  price: { key: "price", icon: (props) => <AiFillCaretUp {...props} /> },
};

const toggleOrderBy = (order_by = "desc") => {
  let newOrderBy = "";
  if (order_by === "asc") {
    newOrderBy = "desc";
  } else if (order_by === "desc") {
    newOrderBy = "asc";
  }
  return newOrderBy;
};

function AllEvent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const queryParams = Object.fromEntries([...searchParams]) || {};
  const {
    genre = "all",
    sortBy = ALL_EVENTS_FILTERS.latest.text,
    orderBy,
  } = queryParams;

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
    ALL_QUERIES.QUERY_ALL_EVENTS({ genre, sort: sortBy, order: orderBy }),
    ({ pageParam = 1 }) =>
      fetchAllEvent({
        page: pageParam,
        perPage: PER_PAGE,
        genreId: genre,
        sort: sortBy,
        order: orderBy,
      }),
    {
      getNextPageParam: (lastPageResponse, allPages) => {
        const totalEvents = lastPageResponse?.data?.totalEvent;
        const totalPages = calculateTotalPagesCount(PER_PAGE, totalEvents);
        const nextPage = allPages.length + 1;
        return nextPage <= totalPages ? nextPage : undefined;
      },
    }
  );

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

  const onFilterChange = (sort_by, order_by) => {
    const dbField = ALL_EVENTS_FILTERS[sort_by]?.key;
    navigate({
      pathname: location.pathname,
      search: `?${createSearchParams({
        ...queryParams,
        genre,
        sortBy: dbField,
        orderBy: order_by,
      })}`,
    });
  };

  const onChangeSort = (sortingKey) => {
    const newOrderBy = toggleOrderBy(orderBy);
    onFilterChange(sortingKey, newOrderBy);
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
                  <Dropdown className={styles.dropdownBtn} align="end">
                    <Dropdown.Toggle variant="none" className={styles.sortBtn}>
                      <Button type="outline">Sort</Button>
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {Object.entries(ALL_EVENTS_FILTERS).map(
                        ([field, values], idx) => {
                          const { key, icon: Icon } = values;
                          return (
                            <Dropdown.Item
                              as="button"
                              className={styles.filterItem}
                              key={`filters_${idx}`}
                              onClick={() => {
                                const newOrderBy = toggleOrderBy(orderBy);
                                onFilterChange(field, newOrderBy);
                              }}
                              active={sortBy === key}
                            >
                              {toTitleCase(field)}
                              {Icon && (
                                <Icon
                                  style={{
                                    transform:
                                      sortBy === key
                                        ? orderBy === "asc"
                                          ? "rotate(180deg)"
                                          : 0
                                        : 0,
                                  }}
                                />
                              )}
                            </Dropdown.Item>
                          );
                        }
                      )}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              {isLoading ? (
                <div className="d-flex justify-content-center align-items-center flex-wrap gap-3">
                  <EventLoadingTile tileCount={9} />
                </div>
              ) : (
                <>
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
