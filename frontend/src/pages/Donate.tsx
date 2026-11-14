import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { postJson, ApiError } from "../lib/api";
import Seo from "../components/Seo";

// Flip to true only once a payment gateway is connected on the backend.
// While false, the form records a donation INTENTION and charges nothing.
const PAYMENT_READY = false;

type Currency = "NGN" | "USD";

const CURRENCIES: Record<
  Currency,
  { symbol: string; presets: number[]; min: number }
> = {
  NGN: { symbol: "₦", presets: [5000, 10000, 25000, 50000], min: 500 },
  USD: { symbol: "$", presets: [10, 25, 50, 100], min: 1 },
};

const ACCENT_BG = "bg-[#8F6C54] hover:bg-[#6B513D] text-white";
const ACCENT_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8F6C54]";
const FIELD =
  "w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-900 " +
  ACCENT_RING;

interface DonationResult {
  id: string;
  reference: string;
  status: "pending";
}

async function submitDonation(data: {
  amount: number;
  currency: Currency;
  name: string;
  email: string;
  message: string;
}): Promise<DonationResult> {
  const result = await postJson<DonationResult>("/api/donate", {
    amount: data.amount,
    currency: data.currency,
    name: data.name.trim() || undefined,
    email: data.email.trim() || undefined,
    message: data.message.trim() || undefined,
    consent: true,
  });
  // When a gateway exists, this is where you redirect to its checkout page
  // using the reference (see the payment plan).
  return result;
}

export default function Donate() {
  const [currency, setCurrency] = useState<Currency>("NGN");
  const [preset, setPreset] = useState<number | null>(
    CURRENCIES.NGN.presets[1],
  );
  const [custom, setCustom] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [reference, setReference] = useState<string | null>(null);

  const { symbol, presets, min } = CURRENCIES[currency];
  const amount = custom ? Number(custom) : (preset ?? 0);

  function chooseCurrency(c: Currency) {
    setCurrency(c);
    setPreset(CURRENCIES[c].presets[1]);
    setCustom("");
    setError("");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (loading) return;
    setError("");

    if (!Number.isFinite(amount) || amount < min) {
      return setError(
        `Enter an amount of at least ${symbol}${min.toLocaleString()}.`,
      );
    }
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      return setError("Enter a valid email address, or leave it blank.");
    }
    if (!consent) {
      return setError(
        "Please confirm the consent box so we can acknowledge your gift.",
      );
    }

    setLoading(true);
    try {
      const result = await submitDonation({
        amount,
        currency,
        name,
        email,
        message,
      });
      setReference(result.reference);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.fieldErrors && Object.keys(err.fieldErrors).length
            ? Object.values(err.fieldErrors)[0]
            : err.message
          : "Something went wrong and your gift was not recorded. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (reference) {
    return (
      <section className="mx-auto max-w-xl px-6 pt-32 pb-20 text-center">
        <h1 className="text-3xl font-semibold text-stone-900">
          {PAYMENT_READY
            ? "Thank you for your gift"
            : "Thank you for your kindness"}
        </h1>
        <p className="mt-4 text-stone-700">
          {PAYMENT_READY
            ? `We have received your gift of ${symbol}${amount.toLocaleString()}.`
            : `We have recorded your intention to give ${symbol}${amount.toLocaleString()}. Online payment is not switched on yet, so nothing has been charged.`}
        </p>
        <p className="mt-3 text-sm text-stone-600">
          Your reference: <strong>{reference}</strong>
          {email
            ? ` A confirmation is on its way to ${email}.`
            : " Please keep this reference."}
        </p>
        <Link
          to="/"
          className={`mt-8 inline-block rounded-md px-6 py-3 ${ACCENT_BG} ${ACCENT_RING}`}
        >
          Back to home
        </Link>
      </section>
    );
  }

  return (
    <>
      <Seo
        title="Donate | Beulah Fertility Bridge Foundation"
        description="Support the work of the Beulah Fertility Bridge Foundation."
        path="/donate"
      />
      <section className="mx-auto max-w-2xl px-6 pt-32 pb-20">
        <h1 className="text-4xl font-semibold text-stone-900">
          Give to the bridge
        </h1>
        <p className="mt-4 max-w-prose text-stone-700">
          Your gift helps couples facing infertility find prayer, trusted
          information and care. Give once, in any amount.
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-10 space-y-8">
          <fieldset>
            <legend className="mb-2 font-medium text-stone-900">
              Currency
            </legend>
            <div className="flex gap-2">
              {(Object.keys(CURRENCIES) as Currency[]).map((c) => (
                <label key={c} className="cursor-pointer">
                  <input
                    type="radio"
                    name="currency"
                    value={c}
                    checked={currency === c}
                    onChange={() => chooseCurrency(c)}
                    className="peer sr-only"
                  />
                  <span className="block rounded-md border border-stone-300 px-4 py-2 peer-checked:border-[#8F6C54] peer-checked:bg-[#8F6C54] peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#8F6C54]">
                    {c}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-2 font-medium text-stone-900">Amount</legend>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {presets.map((p) => (
                <label key={p} className="cursor-pointer">
                  <input
                    type="radio"
                    name="amount"
                    value={p}
                    checked={!custom && preset === p}
                    onChange={() => {
                      setPreset(p);
                      setCustom("");
                    }}
                    className="peer sr-only"
                  />
                  <span className="block rounded-md border border-stone-300 py-3 text-center peer-checked:border-[#8F6C54] peer-checked:bg-[#8F6C54] peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#8F6C54]">
                    {symbol}
                    {p.toLocaleString()}
                  </span>
                </label>
              ))}
            </div>
            <label className="mt-4 block">
              <span className="mb-1 block text-sm text-stone-700">
                Or enter another amount
              </span>
              <input
                type="number"
                inputMode="decimal"
                min={min}
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                placeholder={`${symbol}${min.toLocaleString()} or more`}
                className={FIELD}
              />
            </label>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="mb-2 font-medium text-stone-900">
              Your details (optional)
            </legend>
            <label className="block">
              <span className="mb-1 block text-sm text-stone-700">Name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                className={FIELD}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm text-stone-700">
                Email, for your confirmation
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className={FIELD}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm text-stone-700">Message</span>
              <textarea
                rows={3}
                maxLength={500}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={FIELD}
              />
            </label>
          </fieldset>

          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 h-4 w-4 accent-[#8F6C54]"
            />
            <span className="text-sm text-stone-700">
              I agree to BFBF using my details to process and acknowledge this
              gift, as described in the{" "}
              <Link to="/privacy-notice" className="underline">
                Privacy Notice
              </Link>
              .
            </span>
          </label>

          <div role="alert" aria-live="polite">
            {error && (
              <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-800">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-md px-6 py-3 font-medium disabled:opacity-60 ${ACCENT_BG} ${ACCENT_RING}`}
          >
            {loading
              ? "Sending…"
              : `Give ${amount > 0 ? symbol + amount.toLocaleString() : ""}`.trim()}
          </button>
        </form>
      </section>
    </>
  );
}
