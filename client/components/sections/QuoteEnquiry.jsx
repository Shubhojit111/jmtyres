/* Existing green/white enquiry panel, now saved server-side before an optional WhatsApp redirect. */
"use client";
import { ArrowUpRight, CircleCheck, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";
import SectionTag from "@/components/ui/SectionTag";
import { business } from "@/lib/data/business";
import { enquiryTopics, whatsappLink } from "@/lib/data/enquiry";
export default function QuoteEnquiry() {
  const [topic, setTopic] = useState("new-tyres"),
    [vehicle, setVehicle] = useState(""),
    [tyreSize, setTyreSize] = useState(""),
    [quantity, setQuantity] = useState(""),
    [name, setName] = useState(""),
    [phone, setPhone] = useState(""),
    [email, setEmail] = useState(""),
    [vehicleType, setVehicleType] = useState(""),
    [message, setMessage] = useState(""),
    [saved, setSaved] = useState(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const requirement = [
    enquiryTopics.find((item) => item.id === topic)?.label ||
      "Tyre or wheel care",
    tyreSize && `Size ${tyreSize}`,
    quantity && `Quantity ${quantity}`,
    vehicle && `Vehicle ${vehicle}`,
  ]
    .filter(Boolean)
    .join(" · ");
  const waMessage = `Hello J.M. Tyre Services. I saved enquiry ${saved?.id || ""} on the website.\nName: ${name}\nPhone: ${phone}\nRequirement: ${requirement}\nMessage: ${message}\nPlease confirm suitable options and current terms.`;
  async function submit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          vehicleType: vehicleType || vehicle,
          requirement,
          message,
        }),
      });
      const data = await response.json();
      if (!response.ok)
        throw Error(data.error || "Could not save your enquiry.");
      setSaved(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section
      aria-labelledby="enquiry-title"
      className="enquiry-section section-inset [display:grid] [grid-template-columns:minmax(0,.94fr)_minmax(0,1.06fr)] [gap:38px] [margin-top:52px] [padding:40px] [border-radius:23px] [background:linear-gradient(130deg,#eaf1eb_0%,#f3f6f2_78%)] max-[1250px]:[gap:22px] max-[1250px]:[padding:28px] max-[970px]:[gap:18px] max-[720px]:[grid-template-columns:1fr] max-[720px]:[gap:17px] max-[720px]:[margin-top:30px] max-[720px]:[padding:21px_16px] max-[720px]:[border-radius:16px] max-[375px]:[padding:16px_11px] [margin-left:16px] [margin-right:16px] max-[720px]:[margin-left:9px] max-[720px]:[margin-right:9px]"
      id="enquire"
    >
      <div className="enquiry-intro [min-width:0] [padding:12px_0_6px] [&_h2]:[margin:24px_0_0] [&_h2]:[max-width:560px] [&_h2]:[font-size:43px] [&_h2]:[line-height:1.07] [&_h2]:[letter-spacing:-.075em] [&_h2]:[font-weight:800] [&>p]:[max-width:460px] [&>p]:[margin:18px_0_0] [&>p]:[font-size:16px] [&>p]:[line-height:1.5] [&>p]:[font-weight:550] [&>p]:[color:#354a3b] max-[1250px]:[&_h2]:[font-size:35px] max-[1250px]:[&>p]:[font-size:14px] max-[970px]:[&_h2]:[font-size:30px] max-[970px]:[&>p]:[font-size:13px] max-[720px]:[padding:5px_4px_0] max-[720px]:[&_h2]:[margin-top:15px] max-[720px]:[&_h2]:[font-size:30px] max-[720px]:[&>p]:[margin-top:11px] max-[720px]:[&>p]:[font-size:13px]">
        <SectionTag>Ask the local team</SectionTag>
        <h2 id="enquiry-title">
          The right tyre starts
          <br />
          with the right details.
        </h2>
        <p>
          Tell us what you need. Your enquiry is saved for the team; WhatsApp is
          optional afterward.
        </p>
        <ol className="enquiry-steps [display:flex] [flex-direction:column] [gap:0] [padding:0] [margin:28px_0_0] [list-style:none] [&_li]:[display:grid] [&_li]:[grid-template-columns:31px_minmax(0,1fr)] [&_li]:[gap:0_12px] [&_li]:[min-height:61px] [&_li]:[padding:12px_0] [&_li]:[border-top:1px_solid_#d0ddd3] [&_li>span]:[grid-row:span_2] [&_li>span]:[font-size:13px] [&_li>span]:[font-weight:800] [&_li>span]:[color:#38704b] [&_strong]:[font-size:13px] [&_strong]:[line-height:1.3] [&_strong]:[font-weight:800] [&_small]:[margin-top:3px] [&_small]:[color:#5b7263] [&_small]:[font-size:11px] [&_small]:[font-weight:600] max-[720px]:[margin-top:17px] max-[720px]:[&_li]:[min-height:48px] max-[720px]:[&_li]:[padding:8px_0]">
          <li>
            <span>01</span>
            <strong>Choose your need</strong>
            <small>Tyres or practical wheel care</small>
          </li>
          <li>
            <span>02</span>
            <strong>Submit the enquiry</strong>
            <small>Saved in the shop dashboard</small>
          </li>
          <li>
            <span>03</span>
            <strong>We reply with next steps</strong>
            <small>Fitment, stock and pricing are confirmed by the shop</small>
          </li>
        </ol>
        <a
          className="enquiry-directions [display:inline-flex] [align-items:center] [gap:4px] [margin-top:19px] [color:#215b39] [font-size:12px] [font-weight:800] [text-decoration:underline] [text-underline-offset:4px] max-[720px]:[margin-top:12px] max-[720px]:[font-size:11px]"
          href={business.mapHref}
          rel="noopener noreferrer"
          target="_blank"
        >
          Check current hours and directions on Google Maps{" "}
          <ArrowUpRight aria-hidden="true" size={15} />
        </a>
      </div>
      <form
        aria-label="Send a tyre or wheel-care enquiry"
        className="enquiry-form [min-width:0] [padding:26px] [border:1px_solid_#e1e9e0] [border-radius:19px] [background:#fff] [box-shadow:0_15px_45px_rgba(24,49,31,.06)] max-[1250px]:[padding:21px] max-[720px]:[padding:17px] max-[720px]:[border-radius:14px]"
        onSubmit={submit}
      >
        <strong className="enquiry-form-title [display:block] [font-size:19px] [letter-spacing:-.055em] [font-weight:800] max-[720px]:[font-size:17px]">
          What can we help with?
        </strong>
        <div
          aria-label="Service requested"
          className="enquiry-options [display:grid] [grid-template-columns:repeat(2,minmax(0,1fr))] [gap:9px] [margin-top:15px] [&_button]:[min-height:41px] [&_button]:[padding:7px_10px] [&_button]:[border:1px_solid_#d7e3d8] [&_button]:[border-radius:11px] [&_button]:[background:#f6f8f5] [&_button]:[font-size:12px] [&_button]:[font-weight:750] [&_button]:[text-align:left] [&_button]:[transition:background_.2s_ease,_color_.2s_ease] [&_button:hover]:[background:#e2eee1] [&_button.active]:[border-color:#173b27] [&_button.active]:[background:#1c4930] [&_button.active]:[color:#fff] max-[970px]:[&_button]:[font-size:11px] max-[720px]:[&_button]:[min-height:40px] max-[720px]:[&_button]:[padding:7px] max-[720px]:[&_button]:[font-size:10.5px]"
          role="group"
        >
          {enquiryTopics.map((item) => (
            <button
              aria-pressed={topic === item.id}
              className={topic === item.id ? "active" : ""}
              data-topic={item.id}
              key={item.id}
              onClick={() => setTopic(item.id)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="enquiry-fields [display:grid] [grid-template-columns:repeat(2,minmax(0,1fr))] [gap:14px] [margin-top:20px] [&_label]:[display:flex] [&_label]:[flex-wrap:wrap] [&_label]:[align-content:flex-start] [&_label]:[gap:0_5px] [&_label]:[min-width:0] [&_label]:[font-size:12px] [&_label]:[font-weight:800] [&_label>span]:[color:#819084] [&_label>span]:[font-size:10px] [&_label>span]:[font-weight:650] [&_input]:[display:block] [&_input]:[width:100%] [&_input]:[height:44px] [&_input]:[margin-top:8px] [&_input]:[padding:0_12px] [&_input]:[border:1px_solid_#dce4dd] [&_input]:[border-radius:10px] [&_input]:[background:#fbfcfa] [&_input]:[color:#1a2c20] [&_input]:[font-size:12px] [&_input]:[font-weight:600] [&_select]:[display:block] [&_select]:[width:100%] [&_select]:[height:44px] [&_select]:[margin-top:8px] [&_select]:[padding:0_12px] [&_select]:[border:1px_solid_#dce4dd] [&_select]:[border-radius:10px] [&_select]:[background:#fbfcfa] [&_select]:[color:#1a2c20] [&_select]:[font-size:12px] [&_select]:[font-weight:600] [&_input:focus]:[border-color:#568661] [&_select:focus]:[border-color:#568661] [&_.enquiry-quantity]:[grid-column:1/-1] max-[720px]:[gap:11px] max-[720px]:[margin-top:15px] max-[375px]:[grid-template-columns:1fr] max-[375px]:[&_.enquiry-quantity]:[grid-column:1]">
          <label htmlFor="enquiry-name">
            Your name <span>required</span>
            <input
              autoComplete="name"
              id="enquiry-name"
              maxLength={90}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              required
              value={name}
            />
          </label>
          <label htmlFor="enquiry-phone">
            Phone <span>required</span>
            <input
              autoComplete="tel"
              id="enquiry-phone"
              maxLength={22}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Contact number"
              required
              type="tel"
              value={phone}
            />
          </label>
          <label htmlFor="enquiry-email">
            Email <span>required</span>
            <input
              autoComplete="email"
              id="enquiry-email"
              maxLength={254}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              type="email"
              value={email}
            />
          </label>
          <label htmlFor="enquiry-type">
            Vehicle type <span>optional</span>
            <select
              id="enquiry-type"
              onChange={(e) => setVehicleType(e.target.value)}
              value={vehicleType}
            >
              <option value="">Select if known</option>
              <option>Car / SUV</option>
              <option>Bike / scooter</option>
              <option>Commercial</option>
            </select>
          </label>
          <label htmlFor="enquiry-vehicle">
            Vehicle <span>if known</span>
            <input
              autoComplete="off"
              id="enquiry-vehicle"
              maxLength={60}
              onChange={(e) => setVehicle(e.target.value)}
              placeholder="e.g. Honda City"
              type="text"
              value={vehicle}
            />
          </label>
          <label htmlFor="enquiry-size">
            Tyre size <span>if known</span>
            <input
              autoComplete="off"
              id="enquiry-size"
              maxLength={30}
              onChange={(e) => setTyreSize(e.target.value)}
              placeholder="e.g. 205/55 R16"
              type="text"
              value={tyreSize}
            />
          </label>
          {topic === "new-tyres" && (
            <label className="enquiry-quantity" htmlFor="enquiry-quantity">
              How many tyres? <span>optional</span>
              <select
                id="enquiry-quantity"
                onChange={(e) => setQuantity(e.target.value)}
                value={quantity}
              >
                <option value="">Not sure yet</option>
                {[1, 2, 3, 4].map((x) => (
                  <option key={x} value={x}>
                    {x} {x === 1 ? "tyre" : "tyres"}
                  </option>
                ))}
              </select>
            </label>
          )}
          <label className="enquiry-quantity" htmlFor="enquiry-message">
            What should we know? <span>required</span>
            <textarea
              className="mt-2 block min-h-[95px] w-full rounded-[10px] border border-[#dce4dd] bg-[#fbfcfa] p-3 text-[12px] font-semibold"
              id="enquiry-message"
              maxLength={2000}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us what help you need"
              required
              value={message}
            />
          </label>
        </div>
        <details className="enquiry-help [margin:15px_0] [font-size:11px] [color:#40584a] [&_summary]:[cursor:pointer] [&_summary]:[width:fit-content] [&_summary]:[font-weight:750] [&_summary]:[text-decoration:underline] [&_summary]:[text-underline-offset:3px] [&_p]:[margin:7px_0_0] [&_p]:[line-height:1.5]">
          <summary>Where is my tyre size?</summary>
          <p>
            Look on the tyre sidewall for a code like{" "}
            <strong>205/55 R16</strong>. You can send a sidewall photo in
            WhatsApp after saving the enquiry.
          </p>
        </details>
        {error && (
          <p className="mb-3 text-[12px] text-red-800" role="alert">
            {error}
          </p>
        )}
        {!saved ? (
          <button
            className="enquiry-send [display:flex] [align-items:center] [justify-content:center] [gap:10px] [width:100%] [min-height:48px] [border-radius:11px] [background:#153b29] [color:#fff] [font-size:13px] [font-weight:800] [&:hover]:[background:#286947] [&>svg:last-child]:[margin-left:auto] [&>svg:last-child]:[margin-right:15px] [&>svg:first-child]:[margin-left:auto] max-[375px]:[font-size:11px]"
            disabled={busy}
            type="submit"
          >
            {busy ? "Saving enquiry…" : "Send enquiry"}{" "}
            <ArrowUpRight aria-hidden="true" size={17} />
          </button>
        ) : (
          <div
            className="rounded-xl border border-[#c6dfc6] bg-[#eef7eb] p-4"
            role="status"
          >
            <strong className="text-[13px] text-[#245a38]">
              Enquiry saved · {saved.id}
            </strong>
            <p className="mt-2 text-[11px] leading-relaxed text-[#4c6654]">
              The team can view it in the admin panel. Email attempts are logged
              as demo until SMTP is configured. If you wish, open WhatsApp and
              tap Send there too.
            </p>
            <a
              className="enquiry-send mt-3 [display:flex] [align-items:center] [justify-content:center] [gap:10px] [width:100%] [min-height:48px] [border-radius:11px] [background:#153b29] [color:#fff] [font-size:13px] [font-weight:800] [&:hover]:[background:#286947] [&>svg:last-child]:[margin-left:auto] [&>svg:last-child]:[margin-right:15px] [&>svg:first-child]:[margin-left:auto] max-[375px]:[font-size:11px]"
              href={whatsappLink(waMessage)}
              rel="noopener noreferrer"
              target="_blank"
            >
              <MessageCircle aria-hidden="true" size={18} />
              Optional: continue in WhatsApp{" "}
              <ArrowUpRight aria-hidden="true" size={16} />
            </a>
          </div>
        )}
        <p className="enquiry-disclaimer [display:flex] [align-items:flex-start] [gap:8px] [margin:13px_0_0] [color:#59695e] [font-size:10.5px] [line-height:1.45] [font-weight:600] [&>svg]:[flex:0_0_auto] [&>svg]:[margin-top:1px] [&>svg]:[color:#287449]">
          <CircleCheck aria-hidden="true" size={17} />
          <span>
            Submission records your enquiry in the database. A WhatsApp draft is
            optional and is only sent if you tap <strong>Send</strong> in
            WhatsApp. The shop still confirms fitment, availability and final
            pricing.
          </span>
        </p>
        <a
          className="enquiry-call [display:inline-flex] [align-items:center] [gap:7px] [margin-top:14px] [color:#1b5735] [font-size:12px] [font-weight:800] [text-decoration:underline] [text-underline-offset:3px]"
          href={business.phoneHref}
        >
          <Phone aria-hidden="true" size={16} />
          Urgent question? Call {business.phoneDisplay}
        </a>
      </form>
    </section>
  );
}
