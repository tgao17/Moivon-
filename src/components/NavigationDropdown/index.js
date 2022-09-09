import React, { useState } from "react";
import classnames from "classnames";
import { Link } from "react-router-dom";
import NavDropdown from "react-bootstrap/NavDropdown";
import { toTitleCase } from "../../utils/helpers";

const NavigationDropdown = ({
  isTransparent,
  options = [],
  title = "All Event",
  id = "basic-nav-dropdown",
}) => {
  return (
    <NavDropdown
      renderMenuOnMount
      title={title}
      id={id}
      className={classnames("nav_dropdown", {
        transparent: isTransparent,
      })}
    >
      {options.map((option) => (
        <NavDropdown.Item as={Link} to={option.link} className="captialize">
          {toTitleCase(option.value)}
        </NavDropdown.Item>
      ))}
    </NavDropdown>
  );
};

export default NavigationDropdown;
