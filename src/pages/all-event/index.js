import React, { useState } from "react";
import Event from "../../components/Event";
import styles from "./index.module.css";

import Container from "react-bootstrap/Container";
import { useQuery } from "@tanstack/react-query";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Heading from "../../components/Heading";
import Button from "../../components/Button";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { fetchAllEvent } from "../../services/Events";
import { ALL_QUERIES } from "../../utils/endpoints";

function AllEvent() {
  const [key, setKey] = useState("AllEvent");

  const { data, isLoading, isError, error } = useQuery(
    ALL_QUERIES.QUERY_ALL_EVENTS(),
    fetchAllEvent
  );

  if (isLoading) return <p>Loading .... </p>;

  if (isError) return <p>{error}</p>;

  const RenderEvent = () => {
    return (
      <Row>
        {data?.data?.data?.map((event) => (
          <Col md={4} className="mb-3" key={event.id}>
            <Event
              event={{
                id: event.id,
                ...event.attributes,
              }}
            />
          </Col>
        ))}
      </Row>
    );
  };

  const ALL_COMPONENT = {
    AllEvent: RenderEvent,
    Classic: RenderEvent,
    Gallery: RenderEvent,
    Feature: RenderEvent,
    Design: RenderEvent,
    Individual: RenderEvent,
  };

  const randomTabContent = () => {
    const DyanmicComponet = ALL_COMPONENT[key];
    return <DyanmicComponet />;
  };

  return (
    <>
      <section className="section">
        <Container>
          <Row>
            <Col md={12}>
              <div className={styles.navHead + " mb-4"}>
                <div
                  className={`d-flex align-items-center gap-5 ${styles.topHead}`}
                >
                  <Heading mb="0" variant="subHeading">
                    Events
                  </Heading>
                  <Tabs
                    id="controlled-tab-example"
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                    className={`mb-3 customTab`}
                  >
                    <Tab eventKey="AllEvent" title="All events"></Tab>
                    <Tab eventKey="Classic" title="CLASSIC MUSEUM"></Tab>
                    <Tab eventKey="Gallery" title="GALLERY"></Tab>
                    <Tab eventKey="Feature" title="FEATURE VENUE"></Tab>
                    <Tab eventKey="Design" title="DESIGN CONVETION"></Tab>
                    <Tab eventKey="Individual" title="INDIVIDUAL"></Tab>
                  </Tabs>
                </div>
                <div className={styles.sortBtn}>
                  <Button type="outline">Sort</Button>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>{randomTabContent()}</Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default AllEvent;
