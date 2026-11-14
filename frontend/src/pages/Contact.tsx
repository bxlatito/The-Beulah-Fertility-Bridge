import { useState, type FormEvent } from "react";
import writing from "../assets/writing.jpg";
import { Link } from "react-router-dom";
import { postJson, ApiError, type FieldErrors } from "../lib/api";
import Seo from "../components/Seo";

function Contact() {
  const inputStyle =
    "w-full border-2 border-black rounded-lg px-3 py-3 text-sm outline-none focus:border-[#8F6C54]";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    const form = e.currentTarget;
    const d = new FormData(form);

    setLoading(true);
    setError(null);
    setSent(false);
    setFieldErrors({});

    try {
      await postJson("/api/contact", {
        firstname: String(d.get("firstname") ?? ""),
        lastname: String(d.get("lastname") ?? ""),
        email: String(d.get("email") ?? ""),
        subject: String(d.get("subject") ?? ""),
        message: String(d.get("message") ?? ""),
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
      <p className="text-xs text-red-700 -mt-1">{fieldErrors[name]}</p>
    ) : null;

  const quickLinks = [
    {
      title: "Support for you",
      description:
        "Prayer, information, trusted care or financial support, handled confidentially.",
      link: "/get-support",
      linkText: "Get Support",
    },
    {
      title: "Faith leaders and churches",
      description:
        "Invite us to share education and open honest conversations.",
      link: "/get-involved",
      linkText: "Get Involved",
    },
    {
      title: "Healthcare professionals",
      description: "Partner with us on responsible, evidence-based education.",
      link: "/get-involved",
      linkText: "Get Involved",
    },
    {
      title: "Volunteers and donors",
      description: "Lend your time, skills or prayers, or help fund this work.",
      link: "/get-involved",
      linkText: "Get Involved",
    },
  ];

  return (
    <>
      <Seo
        title="Contact Us | Beulah Fertility Bridge Foundation"
        description="Get in touch with the Beulah Fertility Bridge Foundation. We respond within 5 working days."
        path="/contact"
      />
      <main className="mt-17 bg-[#F7F7F7] text-black">
        {/* Hero Section */}
        <section className="relative w-full h-70 sm:h-80 md:h-85">
          <img
            src={writing}
            alt="An open notebook and pen"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/55 flex flex-col justify-center items-center text-center px-5">
            <h1 className="text-white text-4xl sm:text-5xl mb-4">Contact us</h1>

            <p className="text-white text-base sm:text-lg ">
              Questions, ideas or a kind word. We would be glad to hear from
              you.
            </p>
          </div>
        </section>

        {/* Contact Information and Form */}
        <section className="max-w-6xl mx-auto px-5 md:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-start">
            {/* Left Column */}
            <div>
              <h2 className="text-2xl sm:text-3xl border-b-4 border-[#62422C] pb-2 w-fit mb-5">
                Get in touch
              </h2>

              <p className="text-[#62422C] text-sm sm:text-base  mb-5">
                Whether you would like to learn more about Beulah Fertility
                Bridge Foundation, explore working together, or share your
                thoughts, send us a message and a member of our team will reply.
              </p>

              {/* Contact Details */}
              <div className="bg-[#EEE6E2] rounded-4xl p-6 space-y-5 mb-4">
                <div>
                  <h3 className="text-xs text-[#8F6C54] mb-1">EMAIL</h3>
                  <p className=" text-sm sm:text-base">
                    info@beulahfertilitybridge.com
                  </p>
                </div>

                <div>
                  <h3 className="text-xs text-[#8F6C54] mb-1">INSTAGRAM</h3>
                  <p className=" text-sm sm:text-base">
                    @beulahfertilitybridge
                  </p>
                </div>

                <div>
                  <h3 className="text-xs text-[#8F6C54] mb-1">RESPONSE TIME</h3>
                  <p className=" text-sm sm:text-base">
                    We aim to reply within 5 Working days. Every message is read
                    by a member of the BFBF team.
                  </p>
                </div>

                <div>
                  <h3 className="text-xs text-[#8F6C54] mb-1">FOUNDER</h3>
                  <p className=" text-sm sm:text-base">
                    Olabode Oluwatobiloba, MSc, Founder
                  </p>
                </div>
              </div>

              {/* Personal Support Card */}
              <div className="border-[3px] border-[#62422C] rounded-3xl p-5">
                <h3 className="text-lg text-[#62422C] mb-2">
                  Looking for personal support?
                </h3>

                <p className="text-sm  mb-3">
                  Please use the Get Support form so we can respond to you
                  confidentially and match you with the right help.
                </p>

                <Link
                  to="/get-support"
                  className="inline-flex bg-black text-white px-5 py-2.5 rounded-lg text-sm  hover:bg-[#62422C] transition"
                >
                  Go to Get Support →
                </Link>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div className="border-[3px] border-black rounded-3xl p-5 sm:p-6">
              <h2 className="text-xl text-[#62422C] mb-3">Send us a message</h2>

              <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="firstname"
                  placeholder="Firstname"
                  required
                  className={inputStyle}
                />
                {fieldError("firstname")}

                <input
                  type="text"
                  name="lastname"
                  placeholder="Lastname"
                  required
                  className={inputStyle}
                />
                {fieldError("lastname")}

                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  required
                  className={inputStyle}
                />
                {fieldError("email")}

                <select
                  name="subject"
                  required
                  defaultValue=""
                  className={`${inputStyle} bg-white`}
                >
                  <option value="" disabled>
                    What is your message about?
                  </option>
                  <option value="General enquiry">General enquiry</option>
                  <option value="Partnership">Partnership</option>
                  <option value="Volunteering">Volunteering</option>
                  <option value="Donations">Donations</option>
                  <option value="Media and speaking enquiries">
                    Media and speaking enquiries
                  </option>
                  <option value="Other">Other</option>
                </select>
                {fieldError("subject")}

                <textarea
                  name="message"
                  placeholder="Message"
                  required
                  rows={5}
                  className={`${inputStyle} resize-none`}
                />
                {fieldError("message")}

                <label className="flex items-start gap-2 text-xs ">
                  <input
                    type="checkbox"
                    name="consent"
                    required
                    className="mt-0.5 w-4 h-4 shrink-0 accent-[#62422C]"
                  />

                  <span>
                    I agree to BFBF contacting me about this message and have
                    read the Privacy notice.
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
                    Thank you. Your message has been sent. We will reply within
                    5 working days.
                  </p>
                )}

                <div className="flex justify-center mt-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-black text-white px-8 py-2.5 rounded-lg text-sm  hover:bg-[#62422C] transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? "Sending…" : "Send"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Quick Links */}
          <section className="mt-20">
            <h2 className="text-2xl sm:text-3xl border-b-4 border-[#62422C] pb-2 w-fit mb-6">
              Looking for something specific?
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickLinks.map((item, index) => (
                <div
                  key={index}
                  className="border-[3px] border-[#62422C] rounded-3xl p-4 flex flex-col min-h-38"
                >
                  <h3 className="text-lg text-[#62422C] mb-2">{item.title}</h3>

                  <p className="text-sm  mb-3">{item.description}</p>

                  <Link
                    to={item.link}
                    className="text-sm mt-auto hover:text-[#8F6C54] transition"
                  >
                    {item.linkText} →
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* Privacy and Emergency Information */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-16 mb-1">
            <div className="bg-[#EEE6E2] rounded-4xl p-6">
              <h3 className="text-xl text-[#62422C] mb-2">Your privacy</h3>

              <p className="text-sm ">
                We use your details only to reply to your message. We do not
                sell or share them. Please read our Privacy notice for how we
                store and delete information.
              </p>
            </div>

            <div className="bg-[#EEE6E2] rounded-4xl p-6">
              <h3 className="text-xl text-[#62422C] mb-2">
                Not for emergencies
              </h3>

              <p className="text-sm ">
                This form is not monitored for urgent health concerns. If you
                need urgent medical help, go to your nearest hospital. BFBF does
                not provide medical advice or diagnosis.
              </p>
            </div>
          </section>
        </section>
      </main>
    </>
  );
}

export default Contact;
