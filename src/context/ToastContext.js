import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiCheckCircle, FiX } from "react-icons/fi";
import "../styles/toast.css";

const ToastContext = createContext(null);
const DISMISS_AFTER_MS = 4000;

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timer = useRef(null);

  const dismiss = useCallback(() => {
    clearTimeout(timer.current);
    setToast(null);
  }, []);

  const showToast = useCallback((next) => {
    clearTimeout(timer.current);
    setToast({ ...next, key: Date.now() });
    timer.current = setTimeout(() => setToast(null), DISMISS_AFTER_MS);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className="toast-region" role="status" aria-live="polite">
        {toast && (
          <div className="toast" key={toast.key}>
            {toast.image && <img className="toast__img" src={toast.image} alt="" />}
            <div className="toast__body">
              <p className="toast__title">
                <FiCheckCircle aria-hidden="true" /> {toast.title}
              </p>
              {toast.message && <p className="toast__message">{toast.message}</p>}
              {toast.action && (
                <Link className="toast__action" to={toast.action.to} onClick={dismiss}>
                  {toast.action.label}
                </Link>
              )}
            </div>
            <button className="icon-btn toast__close" onClick={dismiss} aria-label="Dismiss">
              <FiX />
            </button>
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside <ToastProvider>");
  return context;
}
