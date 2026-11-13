import { useState, type FormEvent } from "react";
import puzzle from "../assets/puzzle_img.jpg";
import { postJson, ApiError, type FieldErrors } from "../lib/api";

import { Link } from "react-router-dom";

function GetSupport() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  async function handleSupportSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    const form = e.currentTarget;
    const d = new FormData(form);
    const text = (key: string) => String(d.get(key) ?? "").trim() || undefined;

    setLoading(true);
    setError(null);
    setSent(false);
    setFieldErrors({});

    try {
      await postJson("/api/support", {
        name: String(d.get("name") ?? ""),
        email: String(d.get("email") ?? ""),
        phone: text("phone"),
        who_for: String(d.get("who_for") ?? ""),
        support_types: d.getAll("supportType").map(String),
        financial_need: text("financial_need"),
        journey: text("journey"),
        consent: d.get("consent") === "on",
      });
      form.reset();
      setSent(true);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        setFieldErrors(err.fieldErrors);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  const sections = [
    { id: "prayer", title: "Prayer" },
    { id: "information", title: "Information" },
    { id: "trusted-care", title: "Trusted care" },
    { id: "financial-support", title: "Financial support" },
    { id: "ask-support", title: "Ask for support" },
    { id: "faqs", title: "FAQs" },
  ];

  const navigateToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setMenuOpen(false);
  };

  return (
    <>
      {/* HERO SECTION */}
      <div className="relative mt-17">

        <div className="relative">
          <img
            src={puzzle}
            alt="Hands bringing puzzle pieces together"
            className="w-full h-80 sm:h-100 md:h-120 lg:h-140 object-cover"
          />

          <div className="absolute inset-0 bg-black/45 flex justify-center items-center px-4">
            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl">
              Get Support
            </h1>
          </div>
        </div>
      </div>

      {/* MOBILE SIDE NAVIGATION */}
      <div className="lg:hidden bg-[#F0E8E3] px-5 py-4">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-full flex justify-between items-center text-sm text-[#62422C]"
        >
          On This Page
          <span>{menuOpen ? "−" : "+"}</span>
        </button>

        {menuOpen && (
          <div className="flex flex-col gap-4 mt-5 text-sm">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => navigateToSection(section.id)}
                className="text-left hover:text-[#8F6C54]"
              >
                {section.title}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* MAIN PAGE LAYOUT */}
      <div className="flex items-stretch bg-[#F8F8F8]">

        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:block w-56 shrink-0 bg-[#F0E8E3]">
          <div className="sticky top-24 px-6 py-14">
            <h3 className="text-sm text-[#62422C] mb-5">
              On This Page
            </h3>

            <nav className="flex flex-col gap-4 border-l border-[#8F6C54] pl-3 text-sm">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => navigateToSection(section.id)}
                  className="text-left text-gray-700 hover:text-[#8F6C54] transition-colors"
                >
                  {section.title}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 min-w-0 px-5 sm:px-8 md:px-12 lg:px-14 py-12">

          {/* INTRODUCTION */}
          <section className="max-w-5xl mx-auto mb-16">
            <h2 className="text-xl md:text-2xl text-black underline decoration-[#8F6C54] underline-offset-8">
              Hello, and welcome. You are not alone here
            </h2>

            <p className="mt-7 text-sm md:text-base text-[#62422C] font-medium leading-7">
              Whatever brought you to this page, whether you are just
              starting to ask questions or have been waiting a long time,
              we are glad you came. Choose the kind of help that feels
              right, and tell us a little about yourself when you are ready.
            </p>

            <p className="mt-3 text-xs md:text-sm text-gray-700 leading-6">
              Everything you share with us is confidential. You do not
              need to share your religious beliefs or detailed medical
              history to ask for help.
            </p>
          </section>

          {/* PRAYER AND ENCOURAGEMENT */}
          <section
            id="prayer"
            className="max-w-5xl mx-auto mb-20 scroll-mt-28"
          >
            <h2 className="text-xl md:text-2xl underline decoration-[#8F6C54] underline-offset-8">
              Prayer and encouragement
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mt-8 items-center">

              <p className="text-sm md:text-base text-[#62422C] leading-7 font-medium">
                Navigating infertility can feel lonely, even when you
                have people around you. Sometimes, all you need is
                someone to pray with you, share words of hope, or
                simply listen with understanding and without judgement.
                You don't have to walk this journey alone.
              </p>

              <div className="bg-[#F0E8E3] rounded-3xl p-6">
                <h3 className="text-[#62422C] mb-3">
                  You can ask us for
                </h3>

                <ul className="list-disc pl-5 text-sm space-y-3 text-gray-800">
                  <li>
                    A place in a confidential prayer group session,
                    open to people of all beliefs.
                  </li>
                  <li>
                    A written prayer, scripture or voice note of
                    encouragement.
                  </li>
                  <li>
                    A kind, unhurried conversation with no pressure
                    to decide anything.
                  </li>
                </ul>

                <button
                  onClick={() => navigateToSection("ask-support")}
                  className="mt-5 border border-black bg-white rounded-lg px-5 py-2 text-sm hover:bg-[#8F6C54] hover:text-white transition"
                >
                  Ask for prayer
                </button>
              </div>

            </div>
          </section>

          {/* INFORMATION AND GUIDANCE */}
          <section
            id="information"
            className="max-w-5xl mx-auto mb-20 scroll-mt-28"
          >
            <h2 className="text-xl md:text-2xl underline decoration-[#8F6C54] underline-offset-8">
              Information and guidance
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mt-8 items-center">

              <p className="text-sm md:text-base text-[#62422C] leading-7 font-medium">
                If you are not sure where to start, or something you
                have been told does not feel clear, ask us. We will
                explain things in plain language and help you work out
                what to ask next.
              </p>

              <div className="bg-[#F0E8E3] rounded-3xl p-6">
                <h3 className="text-[#62422C] mb-3">
                  You can ask us for
                </h3>

                <ul className="list-disc pl-5 text-sm space-y-3 text-gray-800">
                  <li>
                    Simple explanations of tests, IUI, IVF and other
                    fertility pathways.
                  </li>
                  <li>
                    Questions to take to your doctor and to your
                    pastor.
                  </li>
                  <li>
                    Help seeing how faith and fertility care can
                    work together.
                  </li>
                </ul>

                <button
                  onClick={() => navigateToSection("ask-support")}
                  className="mt-5 border border-black bg-white rounded-lg px-5 py-2 text-sm hover:bg-[#8F6C54] hover:text-white transition"
                >
                  Ask a question
                </button>
              </div>

            </div>
          </section>

          {/* TRUSTED FERTILITY CARE */}
          <section
            id="trusted-care"
            className="max-w-5xl mx-auto mb-20 scroll-mt-28"
          >
            <h2 className="text-xl md:text-2xl underline decoration-[#8F6C54] underline-offset-8">
              Trusted fertility care
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mt-8 items-center">

              <p className="text-sm md:text-base text-[#62422C] leading-7 font-medium">
                When you feel ready for the next step, we can help
                you find qualified, properly regulated providers,
                so you do not have to search alone.
              </p>

              <div className="bg-[#F0E8E3] rounded-3xl p-6">
                <h3 className="text-[#62422C] mb-3">
                  You can ask us for
                </h3>

                <ul className="list-disc pl-5 text-sm space-y-3 text-gray-800">
                  <li>
                    A shortlist of clinics that can help you through
                    this process.
                  </li>
                  <li>
                    Help getting ready for a first appointment.
                  </li>
                  <li>
                    Understanding what medical decisions may involve
                    and your provider.
                  </li>
                </ul>

                <button
                  onClick={() => navigateToSection("ask-support")}
                  className="mt-5 border border-black bg-white rounded-lg px-5 py-2 text-sm hover:bg-[#8F6C54] hover:text-white transition"
                >
                  Ask for a referral
                </button>
              </div>

            </div>
          </section>

          {/* FINANCIAL SUPPORT */}
          <section
            id="financial-support"
            className="max-w-5xl mx-auto mb-20 scroll-mt-28"
          >
            <h2 className="text-xl md:text-2xl underline decoration-[#8F6C54] underline-offset-8">
              Financial support
            </h2>

            <p className="mt-7 text-sm md:text-base text-[#62422C] leading-7 font-medium">
              Cost keeps many couples from the care they need. If the
              cost of fertility care is standing in your way, you can
              ask us for financial help.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-7">

              <div className="bg-[#F0E8E3] rounded-3xl p-6">
                <h3 className="text-lg text-[#62422C] mb-4">
                  What the support can help with
                </h3>

                <ul className="list-disc pl-5 text-sm space-y-3">
                  <li>Fertility investigations and tests</li>
                  <li>Specialist consultations</li>
                  <li>Part or all of a treatment cost (confirm scope)</li>
                </ul>
              </div>

              <div className="bg-[#F0E8E3] rounded-3xl p-6">
                <h3 className="text-lg text-[#62422C] mb-4">
                  Who can apply
                </h3>

                <ul className="list-disc pl-5 text-sm space-y-3">
                  <li>Individuals or couples facing infertility</li>
                  <li>
                    Those who cannot meet the full cost of care
                    (confirm region and criteria)
                  </li>
                  <li>
                    People of any belief. Faith is not a requirement.
                  </li>
                </ul>
              </div>

              <div className="bg-[#F0E8E3] rounded-3xl p-6 sm:col-span-2 lg:col-span-1">
                <h3 className="text-lg text-[#62422C] mb-4">
                  How it works
                </h3>

                <ol className="list-decimal pl-5 text-sm space-y-3">
                  <li>Tell us about your need in the form below.</li>
                  <li>
                    We review your request fairly and confidentially.
                  </li>
                  <li>
                    We let you know the outcome and next steps.
                  </li>
                </ol>
              </div>

            </div>

            <div className="mt-6 border-2 border-[#8F6C54] rounded-2xl p-5 flex flex-col md:flex-row gap-5 justify-between items-center">
              <p className="text-sm text-gray-800 leading-6">
                Support depends on available funds and eligibility.
                We cannot promise funding or any treatment outcome,
                and we will always be honest with you about what
                we can offer.
              </p>

              <button
                onClick={() => navigateToSection("ask-support")}
                className="shrink-0 bg-black text-white rounded-lg px-6 py-3 text-sm hover:bg-[#8F6C54] transition"
              >
                Apply for financial support
              </button>
            </div>
          </section>

          {/* TELL US ABOUT YOU / SUPPORT FORM */}
          <section
            id="ask-support"
            className="max-w-5xl mx-auto mb-24 scroll-mt-28"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">

              {/* FORM INTRODUCTION */}
              <div>
                <h2 className="text-xl md:text-2xl underline decoration-[#8F6C54] underline-offset-8">
                  Tell us about you
                </h2>

                <p className="mt-7 text-sm md:text-base text-[#62422C] leading-7">
                  There is no wrong way to start. Share as much or
                  as little as you like, and a real person on our
                  team will read your message and reply to you
                  personally.
                </p>

                <h3 className="font-semibold mt-8 mb-5">
                  What happens after you send
                </h3>

                <div className="space-y-6">

                  <div className="flex gap-4 items-start">
                    <span className="text-2xl font-bold text-[#8F6C54]">1</span>
                    <p className="text-sm leading-6">
                      You receive a confirmation that we have
                      your message.
                    </p>
                  </div>

                  <div className="flex gap-4 items-start">
                    <span className="text-2xl font-bold text-[#8F6C54]">2</span>
                    <p className="text-sm leading-6">
                      We reply within 5 working days by your
                      preferred method.
                    </p>
                  </div>

                  <div className="flex gap-4 items-start">
                    <span className="text-2xl font-bold text-[#8F6C54]">3</span>
                    <p className="text-sm leading-6">
                      Together we decide the right kind of help:
                      prayer, information, a referral or financial
                      support.
                    </p>
                  </div>

                  <div className="flex gap-4 items-start">
                    <span className="text-2xl font-bold text-[#8F6C54]">4</span>
                    <p className="text-sm leading-6">
                      There is no obligation. You stay in control
                      at every step.
                    </p>
                  </div>

                </div>
              </div>

              {/* SUPPORT FORM */}
              <form
                onSubmit={handleSupportSubmit}
                className="border-2 border-black rounded-3xl p-5 md:p-7 flex flex-col gap-4 bg-white"
              >

                <input
                  type="text"
                  name="name"
                  placeholder="What should we call you?"
                  className="border border-black rounded-lg p-3 text-sm outline-none focus:border-[#8F6C54]"
                  required
                />
                {fieldErrors.name && (
                  <p className="text-xs text-red-700">{fieldErrors.name}</p>
                )}

                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className="border border-black rounded-lg p-3 text-sm outline-none focus:border-[#8F6C54]"
                  required
                />
                {fieldErrors.email && (
                  <p className="text-xs text-red-700">{fieldErrors.email}</p>
                )}

                <input
                  type="tel"
                  name="phone"
                  placeholder="WhatsApp or phone number (optional)"
                  className="border border-black rounded-lg p-3 text-sm outline-none focus:border-[#8F6C54]"
                />
                {fieldErrors.phone && (
                  <p className="text-xs text-red-700">{fieldErrors.phone}</p>
                )}

                <div>
                  <label className="text-xs text-[#62422C]">
                    I am reaching out...
                  </label>

                  <select
                    name="who_for"
                    className="w-full border border-black rounded-lg p-3 mt-2 text-sm bg-white"
                    defaultValue="For myself"
                  >
                    <option value="For myself">For myself</option>
                    <option value="For my partner">For my partner</option>
                    <option value="For someone else">For someone else</option>
                    <option value="Just seeking information">
                      Just seeking information
                    </option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-[#62422C]">
                    What kind of help would feel right? (Choose any)
                  </label>

                  <div className="flex flex-wrap gap-2 mt-3">

                    {[
                      "Prayer",
                      "Information",
                      "Trusted care",
                      "Financial support",
                    ].map((item) => (
                      <label
                        key={item}
                        className="border border-[#8F6C54] rounded-full px-3 py-2 text-xs cursor-pointer has-checked:bg-[#8F6C54] has-checked:text-white"
                      >
                        <input
                          type="checkbox"
                          name="supportType"
                          value={item}
                          className="sr-only"
                        />
                        {item}
                      </label>
                    ))}

                  </div>
                </div>

                <div>
                  <label className="text-xs text-[#62422C]">
                    If financial support: what would help most?
                  </label>

                  <select
                    name="financial_need"
                    className="w-full border border-black rounded-lg p-3 mt-2 text-sm bg-white"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    <option>Tests, investigations or treatment</option>
                    <option>Specialist consultation</option>
                    <option>Help understanding treatment costs</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-[#62422C]">
                    Tell us about your journey. Please avoid detailed
                    medical history.
                  </label>

                  <textarea
                    name="journey"
                    rows={5}
                    maxLength={1500}
                    placeholder="Share as much or as little as you like (optional)"
                    className="w-full border border-black rounded-lg p-3 mt-2 text-sm resize-none outline-none focus:border-[#8F6C54]"
                  />
                  {fieldErrors.journey && (
                    <p className="text-xs text-red-700">{fieldErrors.journey}</p>
                  )}
                </div>

                <label className="flex gap-2 items-start text-xs leading-5">
                  <input
                    type="checkbox"
                    name="consent"
                    required
                    className="mt-1"
                  />
                  <span>
                    I agree to BFBF contacting me about this enquiry
                    and have read the{" "}
                    <Link
                      to="/privacy-notice"
                      className="underline text-[#8F6C54]"
                    >
                      Privacy Notice
                    </Link>.
                  </span>
                </label>

                {error && (
                  <p role="alert" className="text-sm text-red-700">
                    {error}
                  </p>
                )}
                {sent && (
                  <p role="status" className="text-sm text-green-800">
                    Thank you. We have received your enquiry and sent a
                    confirmation to your email. We will reply within 5
                    working days.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-black text-white rounded-lg px-6 py-3 text-sm hover:bg-[#8F6C54] transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending…" : "Send my enquiry"}
                </button>

              </form>
            </div>
          </section>

          {/* MEDICAL EMERGENCY NOTICE */}
          <section className="max-w-5xl mx-auto mb-20">
            <h2 className="text-xl md:text-2xl underline decoration-[#8F6C54] underline-offset-8">
              Good to know before you send
            </h2>

            <div className="mt-8 border-2 border-[#8F6C54] rounded-2xl p-6">

              <h3 className="text-lg text-[#62422C]">
                If this is a medical emergency
              </h3>

              <p className="mt-3 text-sm leading-7 text-gray-800">
                Severe pain, heavy bleeding or any urgent health
                concern needs immediate medical care. Please go
                to your nearest hospital or call your local
                emergency number. Do not wait for a reply from us.
              </p>

              <p className="mt-3 text-sm leading-7 text-gray-800">
                BFBF provides education and support, not medical
                advice, diagnosis or treatment. Our information
                is educational and does not replace guidance
                from a qualified healthcare provider.
              </p>

            </div>
          </section>

          {/* FAQS */}
          <section
            id="faqs"
            className="max-w-5xl mx-auto mb-16 scroll-mt-28"
          >
            <h2 className="text-xl md:text-2xl underline decoration-[#8F6C54] underline-offset-8">
              FAQs
            </h2>

            <div className="mt-8 border-t border-[#8F6C54]">

              {[
                {
                  question: "Is my enquiry confidential?",
                  answer:
                    "Yes. We collect only what we need to reply, and we handle it according to our Privacy Notice.",
                },
                {
                  question: "Do I have to be a Christian to ask for help?",
                  answer:
                    "No. Our identity is Christian, but support does not depend on your beliefs or on taking part in any religious activity.",
                },
                {
                  question: "Can BFBF help with the cost of fertility care?",
                  answer:
                    "Yes. Eligible people can ask for help with the cost of investigations, consultations or treatment. Choose Financial support in the form and we will take you through the next steps.",
                },
                {
                  question: "Does applying guarantee funding?",
                  answer:
                    "No. Support depends on eligibility and available funds, and we cannot promise any treatment outcome. We will be honest with you about the decision.",
                },
                {
                  question: "How long will it take to hear back?",
                  answer:
                    "We aim to reply within 5 working days. If your situation is urgent or medical, please contact a healthcare provider directly.",
                },
                {
                  question: "Will you tell me what to decide?",
                  answer:
                    "No. We share information and encouragement. Decisions about care remain with you and your qualified providers.",
                },
              ].map((faq, index) => (
                <details
                  key={index}
                  className="border-b border-[#8F6C54] py-5 group"
                >
                  <summary className="text-sm md:text-base cursor-pointer flex justify-between items-center gap-4">
                    {faq.question}

                    <span className="text-[#8F6C54] text-xl group-open:rotate-45 transition-transform">
                      +
                    </span>
                  </summary>

                  <p className="mt-4 text-sm text-gray-700 leading-7">
                    {faq.answer}
                  </p>
                </details>
              ))}

            </div>
          </section>

        </main>
      </div>

    </>
  );
}

export default GetSupport;