import { useEffect, useRef, useState } from "react";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.1,
});

export default function GlobalLoading() {
  const location = useLocation();
  const prevPath = useRef(location.pathname);
  const [hasNavigated, setHasNavigated] = useState(false);

  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const isQueryLoading = isFetching > 0 || isMutating > 0;

  useEffect(() => {
    if (location.pathname !== prevPath.current) {
      prevPath.current = location.pathname;
      setHasNavigated(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!hasNavigated) return;
    NProgress.start();
    const timeout = setTimeout(() => {
      NProgress.done();
      setHasNavigated(false);
    }, 300);
    return () => clearTimeout(timeout);
  }, [hasNavigated]);

  useEffect(() => {
    if (isQueryLoading) {
      NProgress.start();
    } else {
      NProgress.done();
    }
  }, [isQueryLoading]);

  return null;
}
