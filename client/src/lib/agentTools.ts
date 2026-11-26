import type { FormEvent, FormHTMLAttributes } from "react";

/**
 * WebMCP, declarative form (https://developer.chrome.com/docs/ai/webmcp/declarative-api).
 *
 * Two attributes on a <form> tell an AI agent that is already on the page what
 * the form is for, so it can fill the visible fields for the person it is
 * working for. The fields' `name` attributes and <label>s become the tool's
 * parameters. We do not set `toolautosubmit`: the agent fills the form and the
 * person presses the button.
 *
 * Status, November 2026: experimental. These form attributes work in the
 * Chrome and Edge origin trials and in the browser built into the ChatGPT
 * desktop app, which is the only assistant that reads them today. They were
 * taken out of the W3C draft in October 2026 (Chrome intends to ship the
 * JavaScript API, document.modelContext.registerTool, first), so they may
 * change or go away. Browsers that do not know them ignore them, and nothing
 * else on the site depends on them: the forms work the same with or without.
 * This file is the only place that knows about WebMCP; delete the two
 * attributes here to switch it off everywhere.
 */
export function agentTool(toolname: string, tooldescription: string): FormHTMLAttributes<HTMLFormElement> {
  return { toolname, tooldescription } as FormHTMLAttributes<HTMLFormElement>;
}

type AgentSubmitEvent = SubmitEvent & {
  agentInvoked?: boolean;
  respondWith?: (result: Promise<unknown>) => void;
};

/**
 * When an agent (not a person) triggered the submit, hand it a plain-language
 * result so it can tell its user what happened. Must be called during the
 * submit event, after preventDefault(). Does nothing for ordinary submits.
 */
export function replyToAgent(e: FormEvent<HTMLFormElement>, sending: Promise<boolean>, sent: string): void {
  const native = e.nativeEvent as AgentSubmitEvent;
  if (!native.agentInvoked || typeof native.respondWith !== "function") return;
  native.respondWith(
    sending.then((ok) => (ok ? sent : "This did not send. Please call the restaurant at (650) 745-8811.")),
  );
}

const NOT_A_BOOKING =
  "This sends a request to the restaurant. It does not confirm a booking and nothing is charged.";

export const EVENT_INQUIRY_TOOL = agentTool(
  "request_private_event",
  `Send a private event or group dining inquiry to Andiamo in Banca, 301 Linden Avenue, South San Francisco. ${NOT_A_BOOKING} The events desk replies within one day with availability and a proposal. To book an ordinary table, use the OpenTable reservation link on this page instead.`,
);
export const EVENT_INQUIRY_SENT =
  "The inquiry was sent to the events desk at Andiamo in Banca. It is a request, not a confirmed booking. The restaurant replies within one day at the email or phone number given.";

export const CATERING_INQUIRY_TOOL = agentTool(
  "request_catering_order",
  `Ask Andiamo in Banca about a catering order of trays for delivery or pickup. ${NOT_A_BOOKING} The restaurant calls or emails back to confirm the order. Catering can also be ordered online through the ezCater link on this page.`,
);
export const CATERING_INQUIRY_SENT =
  "The catering request was sent to Andiamo in Banca. It is a request, not a confirmed order. The restaurant will call or email to confirm.";

export const CONTACT_TOOL = agentTool(
  "send_message_to_restaurant",
  `Send a general message to Andiamo in Banca. ${NOT_A_BOOKING} To book a table, use the OpenTable reservation link on this page instead.`,
);
export const CONTACT_SENT = "The message was sent to Andiamo in Banca. The restaurant replies by email or phone.";
