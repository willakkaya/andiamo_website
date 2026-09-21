import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation, useSearch } from "wouter";
import { useLocationProperty } from "wouter/use-browser-location";
import { useEffect } from "react";
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
function ScrollManager() {
  const [pathname] = useLocation();
  const search = useSearch();
  const hash = useLocationProperty(currentHash);
  useEffect(() => {
    const go = () => {
      let id = hash.slice(1);
      try {
        id = decodeURIComponent(id);
      } catch {
        // malformed escape in the hash — fall back to the raw string
      }
      const el = id ? document.getElementById(id) : null;
      if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
      else window.scrollTo({ top: 0, behavior: "instant" });
    };
    go();

    let live = true;
    let moved = false;
    const mark = () => {
      moved = true;
    };
    const events = ["wheel", "touchstart", "keydown"];
    events.forEach((e) => window.addEventListener(e, mark, { once: true, passive: true }));
    document.fonts?.ready.then(() => {
      if (live && !moved && hash) go();
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
