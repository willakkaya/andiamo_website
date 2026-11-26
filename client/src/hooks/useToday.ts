import { useEffect, useState } from "react";

/**
 * Today's date as YYYY-MM-DD, or undefined until the page is running in the
 * browser. The pages are prerendered at build time, so anything read from the
 * clock during render would be frozen at the build date and would not match
 * what the browser renders; this fills it in after hydration instead.
 */
export function useToday(): string | undefined {
  const [today, setToday] = useState<string>();
  useEffect(() => {
    setToday(new Date().toISOString().slice(0, 10));
  }, []);
  return today;
}
