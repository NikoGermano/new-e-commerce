import React from "react";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import StatusMessage from "../components/StatusMessage";

const NotFound = () => (
  <div className="container page">
    <StatusMessage
      icon={<FiSearch />}
      title="We looked everywhere"
      actions={
        <Link to="/" className="btn btn--primary">
          Go to the home page
        </Link>
      }
    >
      The page you're looking for doesn't exist or has moved.
    </StatusMessage>
  </div>
);

export default NotFound;
