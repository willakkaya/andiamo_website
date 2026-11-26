import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation, useSearch } from "wouter";
import { useLocationProperty } from "wouter/use-browser-location";
import { useEffect, useRef } from "react";
import { MotionConfig } from "framer-motion";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import OurStory from "./pages/OurStory";
import TheVault from "./pages/TheVault";
import CorporateDining from "./pages/CorporateDining";
import Contact from "./pages/Contact";
import Gallery from "./pages/Gallery";
import BanquetCatering from "./pages/BanquetCatering";
import PrivateEvents from "./pages/PrivateEvents";
import HolidayParties from "./pages/HolidayParties";
import RehearsalDinners from "./pages/RehearsalDinners";

const currentHash = () => window.location.hash;

// One scroll manager for the whole site: a URL with a #hash lands on that
// element (hard load, cross-page <Link>, or in-page anchor); anything else
// lands at the top. Runs again once webfonts settle, since the swap shifts
// layout — unless the visitor has already started scrolling.
//
// A hard load is different. The pages are prerendered, so by the time this
// script runs the page is already on screen and the reader is where they
// belong: the top, a restored position after a reload, or wherever they have
// scrolled to while the script was loading. Moving them then would throw them
// back to the top mid-read. So until the visitor navigates somewhere else we
// only settle on a #hash target, and only when the reader is still at it or
// still at the very top (browsers often have not scrolled to it yet).
//
// "Until the visitor navigates" is tracked by URL, not by "first run": while
// React takes over the prerendered page the query string and hash arrive a
// moment after the first render, so this effect runs two or three times for
// the same load. Any address with a query string, which is every ad click,
// would otherwise count as a navigation and be sent to the top.
function ScrollManager() {
  const [pathname] = useLocation();
  const search = useSearch();
  const hash = useLocationProperty(currentHash, () => "");
  // The address of the hard load, until the visitor leaves it.
  const loadUrl = useRef<string | null>(null);
  useEffect(() => {
    const target = () => {
      let id = hash.slice(1);
      try {
        id = decodeURIComponent(id);
      } catch {
        // malformed escape in the hash — fall back to the raw string
      }
      return id ? document.getElementById(id) : null;
    };
    const go = () => {
      const el = target();
      if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
      else window.scrollTo({ top: 0, behavior: "instant" });
    };
    const here = window.location.pathname + window.location.search + window.location.hash;
    if (loadUrl.current === null) loadUrl.current = here;
    const isLoad = loadUrl.current === here;
    if (!isLoad) loadUrl.current = ""; // navigated: nothing after this is the load
    const atTarget = () => {
      const el = target();
      return !!el && (window.scrollY === 0 || Math.abs(el.getBoundingClientRect().top) < window.innerHeight);
    };
    const settle = !isLoad || atTarget();
    if (settle) go();

    let live = true;
    let moved = false;
    const mark = () => {
      moved = true;
    };
    const events = ["wheel", "touchstart", "keydown"];
    events.forEach((e) => window.addEventListener(e, mark, { once: true, passive: true }));
    document.fonts?.ready.then(() => {
      if (live && !moved && hash && settle) go();
    });
    return () => {
      live = false;
      events.forEach((e) => window.removeEventListener(e, mark));
    };
  }, [pathname, search, hash]);
  return null;
}

function PageviewTracker() {
  const [location] = useLocation();
  useEffect(() => {
    if (typeof window.gtag === "function") {
      window.gtag("event", "page_view", {
        page_path: location,
        page_location: window.location.href,
        page_title: document.title,
      });
    }
  }, [location]);
  return null;
}

function Router() {
  return (
    <>
      <ScrollManager />
      <PageviewTracker />
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/menu"} component={Menu} />
        <Route path={"/our-story"} component={OurStory} />
        <Route path={"/the-vault"} component={TheVault} />
        <Route path={"/private-dining"} component={CorporateDining} />
        <Route path={"/contact"} component={Contact} />
        <Route path={"/gallery"} component={Gallery} />
        <Route path={"/private-events"} component={PrivateEvents} />
        <Route path={"/banquet-catering"} component={BanquetCatering} />
        <Route path={"/holiday-parties"} component={HolidayParties} />
        <Route path={"/rehearsal-dinners"} component={RehearsalDinners} />
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <MotionConfig reducedMotion="user">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </MotionConfig>
    </ErrorBoundary>
  );
}

export default App;
