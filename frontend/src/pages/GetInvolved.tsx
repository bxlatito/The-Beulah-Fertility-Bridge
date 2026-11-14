import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { postJson, ApiError, type FieldErrors } from "../lib/api";
import handshake from "../assets/handshake.jpg";
import worship from "../assets/worship.jpg";
import hand_heart from "../assets/holding_heart.jpg";
import Seo from "../components/Seo";

function GetInvolved() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  async function handleVolunteerSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    const form = e.currentTarget;
    const d = new FormData(form);

    const role = String(d.get("role") ?? "");
    const phone = String(d.get("phone") ?? "").trim();
    const notes = String(d.get("notes") ?? "").trim();

    // The contact endpoint has no phone/role fields, so they go in the message.
    const message = [
      "Volunteer sign-up",
      `How they want to help: ${role}`,
      phone ? `Phone: ${phone}` : null,
      notes ? `Additional information: ${notes}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    setLoading(true);
    setError(null);
    setSent(false);
    setFieldErrors({});

    try {
      await postJson("/api/contact", {
        firstname: String(d.get("firstname") ?? ""),
        lastname: String(d.get("lastname") ?? ""),
        email: String(d.get("email") ?? ""),
        subject: "Volunteering",
        message,
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

  const fieldError = (name: string) =>
    fieldErrors[name] ? (
      <p className="text-xs text-red-700 -mt-2">{fieldErrors[name]}</p>
    ) : null;
  const opportunities = [
    {
      title: "Healthcare Professionals",
      description:
        "Embryologists, reproductive practitioners, geneticists, gynaecologists and researchers can help us keep our education accurate and clear. Review our guides, answer common questions, or share what couples most need to understand.",
    },
    {
      title: "Religious professionals",
      description:
        "Pastors, priests, chaplains and counsellors can help us bring faith and fertility into the same conversation. Join us to shape guidance that supports couples without shame, and to bring honest conversations into your pastoral care.",
    },
    {
      title: "Religious Organizations",
      description:
        "Churches, ministries and Christian networks can invite us to share education with their communities. Together we can host open conversations, prayer gatherings and awareness sessions that replace silence and stigma with understanding.",
    },
  ];

  const easyWays = [
    "Follow @beulahfertilitybridge on Instagram",
    "Ask us for flyers to share in your church or clinic",
    "Share our Learn guides with a friend",
  ];

  return (
    <>
      <Seo
        title="Get Involved | Beulah Fertility Bridge Foundation"
        description="Volunteer or partner with the Beulah Fertility Bridge Foundation."
        path="/get-involved"
      />
      {/* NAVBAR AND HERO */}
      <div className="relative mt-17">
        <section className="relative h-80 sm:h-100 md:h-115 lg:h-125 flex items-center justify-center px-5">
          {/* HERO IMAGE */}
          <div className="absolute inset-0">
            <img
              src={handshake}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute bg-black/55 inset-0"></div>
          </div>

          {/* DARK OVERLAY */}
          <div />

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-5">
            <div className="hidden sm:block h-12" />

            <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-semibold">
              How you can help us
            </h1>
          </div>
        </section>
      </div>

      {/* INTRODUCTION */}
      <section className="bg-[#F8F8F8] px-5 py-12 md:py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
          <h2 className="text-2xl md:text-3xl text-[#79563F] font-medium">
            Help us build the
            <br className="hidden md:block" /> bridge
          </h2>

          <p className="text-center md:text-right text-sm md:text-base leading-6 font-medium">
            No one crosses this alone. Whether you pray, give your time, open
            your church doors or share your skills, there is a place for you in
            this work.
          </p>
        </div>
      </section>

      {/* VOLUNTEER SECTION */}
      <section className="bg-[#EEE4E0] px-5 md:px-10 lg:px-16 py-14 md:py-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* VOLUNTEER INFORMATION */}
          <div>
            <h2 className="text-2xl md:text-3xl text-[#79563F] font-medium">
              Volunteer
            </h2>

            <h3 className="text-base md:text-lg mt-6 font-medium">
              Lend your time and skills
            </h3>

            <p className="text-sm leading-6 mt-2">
              We are a small, growing team. Volunteers help us reach more people
              with care. Tell us how you would like to help and we will be in
              touch.
            </p>

            <ul className="mt-10 border-t border-[#79563F]">
              {[
                "Content and writing",
                "Design and media",
                "Events and prayer planning",
              ].map((item, index) => (
                <li
                  key={index}
                  className="flex items-center gap-5 border-b border-[#79563F] py-5 text-sm"
                >
                  <span>●</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* VOLUNTEER FORM */}
          {/* VOLUNTEER FORM */}
          <div className="bg-white border-2 border-black rounded-2xl p-5 sm:p-8 w-full max-w-lg mx-auto">
            <form
              onSubmit={handleVolunteerSubmit}
              className="flex flex-col gap-4"
            >
              <input
                type="text"
                name="firstname"
                placeholder="Firstname"
                required
                className="w-full border-2 border-black rounded-md px-3 py-3 text-sm outline-none focus:border-[#8F6C54]"
              />
              {fieldError("firstname")}

              <input
                type="text"
                name="lastname"
                placeholder="Lastname"
                required
                className="w-full border-2 border-black rounded-md px-3 py-3 text-sm outline-none focus:border-[#8F6C54]"
              />
              {fieldError("lastname")}

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                required
                className="w-full border-2 border-black rounded-md px-3 py-3 text-sm outline-none focus:border-[#8F6C54]"
              />
              {fieldError("email")}

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number (optional)"
                className="w-full border-2 border-black rounded-md px-3 py-3 text-sm outline-none focus:border-[#8F6C54]"
              />

              <select
                name="role"
                required
                defaultValue=""
                className="w-full border-2 border-black rounded-md px-3 py-3 text-sm outline-none focus:border-[#8F6C54] bg-white"
              >
                <option value="" disabled>
                  How you want to help
                </option>
                <option value="Content and writing">Content and writing</option>
                <option value="Design and media">Design and media</option>
                <option value="Events and prayer planning">
                  Events and prayer planning
                </option>
                <option value="Healthcare support">Healthcare support</option>
                <option value="Other">Other</option>
              </select>

              <textarea
                name="notes"
                placeholder="Anything additional? (Optional)"
                rows={4}
                className="w-full border-2 border-black rounded-md px-3 py-3 text-sm outline-none focus:border-[#8F6C54] resize-none"
              />
              {fieldError("message")}

              <label className="flex items-start gap-2 text-xs">
                <input
                  type="checkbox"
                  name="consent"
                  required
                  className="mt-0.5 w-4 h-4 shrink-0 accent-[#62422C]"
                />
                <span>
                  I agree to BFBF contacting me about volunteering and have read
                  the Privacy notice.
                </span>
              </label>
              {fieldError("consent")}

              {error && (
                <p role="alert" className="text-sm text-red-700">
                  {error}
                </p>
              )}
              {sent && (
                <p role="status" className="text-sm text-green-800">
                  Thank you for offering to help. We will be in touch within 5
                  working days.
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="bg-black text-white rounded-md py-3 px-10 text-sm w-fit min-w-32 mx-auto hover:bg-[#79563F] transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Sending…" : "Send"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* JOIN US */}
      <section className="bg-[#F8F8F8] px-5 md:px-10 lg:px-16 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl text-center text-[#79563F] font-medium border-b border-[#79563F] pb-4">
            We would love for you to join us
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mt-10">
            {opportunities.map((item, index) => (
              <div key={index}>
                <h3 className="text-base text-center font-medium border-b border-[#79563F] pb-3">
                  {item.title}
                </h3>

                <p className="text-sm text-[#62422C] leading-6 mt-5">
                  {item.description}
                </p>

                <Link
                  to="/contact"
                  className="block text-right mt-5 text-sm hover:text-[#8F6C54] transition"
                >
                  Contact us →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRAYER SECTION */}
      <section className="bg-[#F8F8F8] px-5 md:px-10 lg:px-16 py-12 md:py-16">
        <div className="relative max-w-6xl mx-auto min-h-64 md:min-h-80 rounded-3xl overflow-hidden flex items-center justify-center text-center px-5 py-12">
          {/* PRAYER BACKGROUND IMAGE */}
          <img
            src={worship}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/60" />

          <div className="relative z-10 max-w-3xl">
            <h2 className="text-white text-2xl md:text-3xl font-medium">
              We need your prayers
            </h2>

            <p className="text-white text-sm md:text-lg leading-7 mt-6">
              Many couples tell us the loneliest part is carrying this in
              silence. Your prayers remind them they are held, and that hope is
              not foolish.
            </p>

            <Link
              to="/contact"
              className="inline-block bg-white text-black rounded-xl px-7 py-3 mt-8 text-sm hover:bg-[#EEE4E0] transition"
            >
              Send a prayer
            </Link>
          </div>
        </div>
      </section>

      {/* EASY WAYS TO JOIN */}
      <section className="bg-[#EEE4E0] px-5 md:px-10 lg:px-16 py-16 md:py-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-medium">
              Easy ways to join us
            </h2>

            <p className="mt-8 text-base md:text-lg leading-7 max-w-md">
              Someone you know may be quietly struggling. Sharing our work, or
              just a kind word, can be the first step out of silence.
            </p>
          </div>

          <ul className="border-t border-[#79563F]">
            {easyWays.map((item, index) => (
              <li
                key={index}
                className="flex items-start gap-5 border-b border-[#79563F] py-6 text-sm text-[#62422C]"
              >
                <span className="text-black">●</span>
                <span>{item} →</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* DONATION SECTION */}
      <section className="bg-[#F8F8F8] px-5 md:px-10 lg:px-16 py-14 md:py-20">
        <div className="relative max-w-4xl mx-auto min-h-64 md:min-h-80 rounded-3xl overflow-hidden flex items-center justify-center text-center px-5 py-10">
          {/* DONATION BACKGROUND IMAGE */}
          <img
            src={hand_heart}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/35" />

          <div className="relative z-10 max-w-3xl">
            <h2 className="text-white text-xl md:text-2xl font-medium">
              Donate to us anyhow you can
            </h2>

            <p className="text-white text-sm md:text-base leading-6 mt-6">
              Cost keeps many couples from care they need. Your gift helps us
              offer clear, trustworthy education, a safe community of prayer and
              support, and, as resources allow, a pilot that helps eligible
              couples with fertility investigations or treatment.
            </p>

            <Link
              to="/donate"
              className="inline-block bg-white text-black rounded-xl px-10 py-3 mt-6 text-sm hover:bg-[#EEE4E0] transition"
            >
              Donate
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default GetInvolved;
