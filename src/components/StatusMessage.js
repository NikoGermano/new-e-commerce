import React from "react";
import { FiAlertTriangle } from "react-icons/fi";

// Shared layout for empty, error and not-found states.
const StatusMessage = ({ icon, title, children, actions }) => (
  <div className="status-message">
    {icon && (
      <div className="status-message__icon" aria-hidden="true">
        {icon}
      </div>
    )}
    <h2 className="status-message__title">{title}</h2>
    {children && <div className="status-message__text">{children}</div>}
    {actions && <div className="status-message__actions">{actions}</div>}
  </div>
);

export const LoadError = ({ onRetry }) => (
  <StatusMessage
    icon={<FiAlertTriangle />}
    title="We couldn't load products"
    actions={
      <button className="btn btn--primary" onClick={onRetry}>
        Try again
      </button>
    }
  >
    Check your connection and try again.
  </StatusMessage>
);

export default StatusMessage;
