import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import { useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import OurStory from "./pages/OurStory";
import TheVault from "./pages/TheVault";
import CorporateDining from "./pages/CorporateDining";
import Contact from "./pages/Contact";
import Gallery from "./pages/Gallery";
import BanquetCatering from "./pages/BanquetCatering";
import HolidayParties from "./pages/HolidayParties";
import RehearsalDinners from "./pages/RehearsalDinners";

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);
  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/menu"} component={Menu} />
        <Route path={"/our-story"} component={OurStory} />
        <Route path={"/the-vault"} component={TheVault} />
        <Route path={"/corporate-dining"} component={CorporateDining} />
        <Route path={"/contact"} component={Contact} />
        <Route path={"/gallery"} component={Gallery} />
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
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </ErrorBoundary>
  );
}

export default App;
