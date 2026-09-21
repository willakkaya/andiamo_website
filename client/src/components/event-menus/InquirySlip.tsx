import { useState } from "react";
import { submitForm } from "@/lib/formspree";
import { trackContactSubmit, trackPhoneClick } from "@/lib/analytics";
import { TIERS } from "@/data/eventMenus";

/* The event inquiry as a bank slip: ruled paper, underline-only fields,
   one block button. The room can be preset by the page ("Hold The Vault"). */

const ROOMS = ["The Vault", "The dining room", "The whole bank", "Not sure yet"];
const MENUS = [
  ...TIERS.filter((t) => t.meal === "dinner").map((t) => `$${t.price} ${t.name.toLowerCase()}`),
  "Not sure yet",
];

const LABEL = "block font-body text-[11px] font-medium uppercase tracking-[0.2em] text-charcoal/70 mb-1.5";
const FIELD =
  "w-full border-0 border-b border-charcoal bg-transparent rounded-none px-0 py-1.5 font-accent text-xl text-charcoal lining-nums placeholder:text-charcoal/60 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-charcoal";

interface Props {
  source: string; // Formspree `source` and the analytics label
  subject: string; // Formspree `_subject`
  slipNo: string;
  room: string;
  onRoomChange: (room: string) => void;
}

export default function InquirySlip({ source, subject, slipNo, room, onRoomChange }: Props) {
  const [form, setForm] = useState({
    eventDate: "",
    guestCount: "",
    menu: "",
    company: "",
    name: "",
    email: "",
    phone: "",
  });
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    const ok = await submitForm({ ...form, room: room || "Not sure yet", _subject: subject, source });
    if (ok) {
      setState("sent");
      trackContactSubmit(source);
    } else {
      setState("error");
    }
  };

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="bg-background border border-charcoal/30 p-1.5">
      <div className="border border-charcoal/15 px-6 py-8 sm:px-10 sm:py-10">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-charcoal/30 pb-4 mb-8">
          <p className="font-display text-xl md:text-2xl text-charcoal">Andiamo in Banca &middot; Events desk</p>
          <p className="font-accent lining-nums text-sm tracking-[0.3em] uppercase text-gold-dark">Slip No. {slipNo}</p>
        </div>

        {state === "sent" ? (
          <div className="py-6" role="status">
            <p className="font-display text-2xl md:text-3xl text-charcoal">Slip received.</p>
            <p className="font-accent text-charcoal/75 text-lg leading-relaxed mt-3 max-w-xl">
              The events desk will reply with availability and a written proposal. If the date is close,
              call{" "}
              <a href="tel:+16507458811" onClick={() => trackPhoneClick(source)} className="link-line text-charcoal lining-nums">
                (650) 745-8811
              </a>
              .
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-x-8 gap-y-7">
              <div className="sm:col-span-4">
                <label htmlFor={`${source}-date`} className={LABEL}>Date wanted</label>
                <input id={`${source}-date`} type="date" min={today} required value={form.eventDate} onChange={set("eventDate")} className={FIELD} />
              </div>
              <div className="sm:col-span-3">
                <label htmlFor={`${source}-guests`} className={LABEL}>Number of guests</label>
                <input id={`${source}-guests`} type="number" inputMode="numeric" min={1} max={200} required value={form.guestCount} onChange={set("guestCount")} className={FIELD} />
              </div>
              <div className="sm:col-span-5">
                <label htmlFor={`${source}-room`} className={LABEL}>Room</label>
                <select id={`${source}-room`} value={room} onChange={(e) => onRoomChange(e.target.value)} className={`${FIELD} appearance-none`}>
                  <option value="">Choose a room</option>
                  {ROOMS.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div className="sm:col-span-6">
                <label htmlFor={`${source}-menu`} className={LABEL}>Menu</label>
                <select id={`${source}-menu`} value={form.menu} onChange={set("menu")} className={`${FIELD} appearance-none`}>
                  <option value="">Choose a menu</option>
                  {MENUS.map((m) => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div className="sm:col-span-6">
                <label htmlFor={`${source}-company`} className={LABEL}>Company</label>
                <input id={`${source}-company`} type="text" autoComplete="organization" value={form.company} onChange={set("company")} className={FIELD} />
              </div>
              <div className="sm:col-span-4">
                <label htmlFor={`${source}-name`} className={LABEL}>Your name</label>
                <input id={`${source}-name`} type="text" autoComplete="name" required value={form.name} onChange={set("name")} className={FIELD} />
              </div>
              <div className="sm:col-span-4">
                <label htmlFor={`${source}-email`} className={LABEL}>Email</label>
                <input id={`${source}-email`} type="email" autoComplete="email" required value={form.email} onChange={set("email")} className={FIELD} />
              </div>
              <div className="sm:col-span-4">
                <label htmlFor={`${source}-phone`} className={LABEL}>Telephone</label>
                <input id={`${source}-phone`} type="tel" autoComplete="tel" value={form.phone} onChange={set("phone")} className={FIELD} />
              </div>
            </div>

            <button
              type="submit"
              disabled={state === "sending"}
              className="mt-10 px-10 py-4 bg-charcoal text-cream font-body text-[12px] font-medium tracking-[0.2em] uppercase hover:bg-espresso transition-colors duration-300 disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-charcoal"
            >
              {state === "sending" ? "Sending" : "Present this slip"}
            </button>
            <p className="font-accent text-charcoal/70 text-base mt-4">
              Nothing is charged and nothing is fixed until we have spoken.
            </p>
            {state === "error" && (
              <p role="alert" className="font-accent text-base text-burgundy mt-3">
                That did not send. Please call the events desk at (650) 745-8811.
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
