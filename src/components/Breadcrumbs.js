import React from "react";
import { Link } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";

const Breadcrumbs = ({ items }) => (
  <nav className="breadcrumbs" aria-label="Breadcrumb">
    <ol>
      {items.map((item, i) => (
        <li key={i}>
          {i > 0 && <FiChevronRight aria-hidden="true" />}
          {item.to ? (
            <Link to={item.to}>{item.label}</Link>
          ) : (
            <span aria-current="page">{item.label}</span>
          )}
        </li>
      ))}
    </ol>
  </nav>
);

export default Breadcrumbs;
