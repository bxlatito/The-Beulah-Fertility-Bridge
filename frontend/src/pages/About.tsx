import tobi from "../assets/Tobi_photo.jpeg";
import bible from "../assets/bible.jpg";
import family_sihlouette from "../assets/family_sihlouette.jpg";
import { useState, type FormEvent } from "react";
import { postJson, ApiError, type FieldErrors } from "../lib/api";

import { FaInstagram, FaLinkedin } from "react-icons/fa";

function About() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  async function handleContactSubmit(e: FormEvent<HTMLFormElement>) {
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
        subject: "General enquiry",
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
      <p className="text-xs text-red-700 -mt-2">{fieldErrors[name]}</p>
    ) : null;

  const beliefs = [
    {
      title: "No shame in seeking help",
      description:
        "Seeking fertility treatment should never be a reason to feel ashamed or to question your faith.",
    },
    {
      title: "Belonging, not withdrawal",
      description:
        "The church and community should offer love, encouragement and support, not silence.",
    },
    {
      title: "Understanding over stigma",
      description:
        "We want to replace silence and stigma with understanding, compassion and meaningful support.",
    },
  ];

  const waysToHelp = [
    {
      title: "Prayer",
      description:
        "Creating spaces where people can find encouragement and share their faith journey.",
    },
    {
      title: "Education",
      description:
        "Providing clear and accessible information about infertility and its treatment.",
    },
    {
      title: "Advocacy",
      description:
        "Challenging misconceptions and encouraging conversations around fertility.",
    },
    {
      title: "Support",
      description:
        "Connecting individuals and couples with understanding and compassionate care.",
    },
    {
      title: "Access",
      description:
        "Working towards opportunities that make fertility care more accessible.",
    },
  ];

  return (
    <>
      {/* NAVBAR AND HERO */}
      <div className="relative mt-17">
        <section className="relative h-80 sm:h-100 md:h-115 lg:h-125 flex items-center justify-center text-center px-5">
          {/* HERO IMAGE */}
          <img
            src={family_sihlouette}
            alt="hero image"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/50" />

          <div className="relative z-10 flex flex-col items-center">
            <div className="flex items-center justify-center gap-5">
              <div className="hidden sm:block h-12" />

              <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-semibold">
                The Beulah Fertility Bridge
              </h1>
            </div>

            <p className="text-white text-xs md:text-sm mt-12">
              Olabode Oluwatobiloba, MSc · Founder
            </p>
          </div>
        </section>
      </div>

      {/* OUR STORY */}
      <section className="bg-[#F8F8F8] px-5 md:px-10 lg:px-16 py-14 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-start">
            <div>
              <p className="text-sm text-[#79563F]">Our Story</p>

              <h2 className="text-2xl md:text-3xl mt-6 leading-tight">
                Born From
                <br />
                something deeply
                <br />
                personal
              </h2>
            </div>

            <div className="text-right">
              <p className="text-sm md:text-base leading-6">
                Beulah Fertility Bridge Foundation grew out of a love for
                reproductive science, a walk with God, and a growing desire to
                make a difference for people facing infertility.
              </p>

              <p className="text-xs md:text-sm leading-6 mt-6 text-[#62422C]">
                While researching religion and medically assisted reproduction
                in Nigeria, our founder saw how faith and medical conceptions
                can leave people caught between their beliefs and their desire
                to conceive. The conversations that followed showed that there
                was real need for honest, judgement-free support and that they
                needed to be happening in our churches, homes and communities.
              </p>
            </div>
          </div>

          {/* WHY BEULAH */}
          <div className="relative mt-14 md:mt-20 h-52 md:h-64 rounded-2xl overflow-hidden flex items-center px-6 md:px-12">
            <img
              src={bible}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-black/55" />

            <div className="relative z-10 w-full md:w-1/2">
              <h2 className="text-white text-2xl md:text-3xl">Why Beulah?</h2>

              <p className="text-white text-xs md:text-sm leading-6 mt-5">
                The name comes from a weekly declaration inspired by Isaiah
                62:4. To our founder, it speaks of hope, restoration and finding
                our identity in God, even in life's most difficult seasons.
              </p>
            </div>

            <div className="hidden md:flex relative z-10 ml-auto w-5/12 min-h-28 border-2 border-white rounded-2xl items-center justify-center text-center p-5">
              <div>
                <p className="text-white italic text-lg">
                  "And thy land Beulah."
                </p>

                <p className="text-white text-[9px] mt-4">ISAIAH 62:4 (KJV)</p>
              </div>
            </div>
          </div>

          {/* OUR BELIEFS */}
          <div className="mt-16 md:mt-24">
            <h2 className="text-xl md:text-2xl">Our Beliefs</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              {beliefs.map((belief, index) => (
                <div key={index}>
                  <h3 className="text-base text-center border-b border-[#79563F] pb-4">
                    {belief.title}
                  </h3>

                  <p className="text-sm leading-6 text-[#62422C] mt-5">
                    {belief.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* HOW WE WANT TO HELP */}
          <div className="mt-16 md:mt-20">
            <h2 className="text-xl md:text-2xl">How we want to help you</h2>

            <div className="max-w-5xl mx-auto mt-10 border-t border-[#79563F]">
              {waysToHelp.map((item, index) => (
                <div key={index} className="border-b border-[#79563F] py-4">
                  <div className="flex items-start gap-4">
                    <span className="text-sm">●</span>

                    <div>
                      <h3 className="text-sm">{item.title}</h3>

                      <p className="text-xs text-[#62422C] mt-2">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* VISION AND MISSION */}
          <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12 mt-16 md:mt-20">
            <div className="border border-[#79563F] rounded-2xl px-6 py-10 text-center">
              <h2 className="text-2xl text-[#79563F]">Vision</h2>

              <p className="text-sm leading-6 mt-6 text-[#62422C]">
                To see faith and assisted conception understood as compatible
                sources of hope and support, so that couples facing infertility
                can find dignity, relief from stigma, meaningful support and
                connection in seeking appropriate reproductive healthcare
                without shame or fear.
              </p>
            </div>

            <div className="border border-[#79563F] rounded-2xl px-6 py-10 text-center">
              <h2 className="text-2xl text-[#79563F]">Mission</h2>

              <p className="text-sm leading-6 mt-6 text-[#62422C]">
                To demonstrate that faith in God and assisted conception can
                work hand in hand. Through biblical encouragement,
                evidence-based reproductive health education, advocacy, referral
                and practical assistance, and more partnerships, BFBF seeks to
                challenge misconceptions and help couples make informed
                fertility-care decisions.
              </p>
            </div>
          </div>

          {/* FOUNDER MESSAGE */}
          <div className="mt-20 md:mt-28">
            <div className="grid grid-cols-1 md:grid-cols-[0.8fr_1.2fr] gap-10 md:gap-16 items-start">
              {/* FOUNDER IMAGE */}
              <div className="max-w-xs mx-auto md:mx-0">
                <img
                  src={tobi}
                  alt="Olabode Oluwatobiloba"
                  className="w-full h-auto object-contain"
                />

                <h3 className="text-sm mt-4">Olabode Oluwatobiloba, MSc</h3>

                <p className="text-xs mt-2 text-[#62422C]">
                  Founder, Beulah Fertility Bridge Foundation
                </p>

                <p className="text-xs mt-2 text-[#62422C]">
                  2024 Andy Glew Prize Recipient, Association of Reproductive
                  and Clinical Scientists (ARCS)
                </p>
              </div>

              {/* FOUNDER MESSAGE INTRODUCTION */}
              <div>
                <h2 className="text-xl md:text-2xl text-[#79563F]">
                  A Message from our founder
                </h2>

                <p className="text-sm leading-6 mt-8">
                  Hello, I'm Olabode Oluwatobiloba, MSc, Founder of Beulah
                  Fertility Bridge Foundation. Beulah Fertility Bridge
                  Foundation was born from something deeply personal to me: my
                  love for reproductive science, my walk with God, and a growing
                  desire to make a difference in the lives of people facing
                  infertility.
                </p>

                <p className="text-sm leading-6 mt-8">
                  During my MSc in Human Clinical Embryology and Assisted
                  Conception at the University of Dundee, I researched the
                  relationship between religion and medically assisted
                  reproduction in Nigeria. I became increasingly aware of how
                  faith and cultural expectations could shape people's decisions
                  about fertility treatment, sometimes leaving them caught
                  between their beliefs and their desire to have a child.
                </p>
              </div>
            </div>

            {/* FULL FOUNDER MESSAGE */}
            <div className="mt-12 text-sm leading-7 space-y-7">
              <p>
                I presented my research at the 2024 Association of Reproductive
                and Clinical Scientists (ARCS) Symposium, where I was honoured
                to receive the Andy Glew Prize for Best Presentation. But beyond
                the award, what stayed with me were the conversations it
                sparked. I began to realise that this was not simply a research
                topic; these were real people, real struggles and conversations
                that needed to be happening in our churches, homes and
                communities.
              </p>

              <p className="italic text-[#79563F]">
                These were real people, real struggles.
              </p>

              <p>
                Having worked in reproductive laboratories in Nigeria and the
                United Kingdom, I have seen the hope that fertility treatment
                can bring, but also the uncertainty, disappointment and
                emotional weight that can accompany the journey. I often thought
                about those who might be going through it in silence, without
                the understanding or support they deserve.
              </p>

              <p>
                I took this burden to God in prayer, and over time, the vision
                for Beulah Fertility Bridge Foundation began to take shape.
              </p>

              <p>
                The name Beulah came from a weekly declaration I listened to,
                inspired by Isaiah 62:4 (KJV): "And thy land Beulah." To me, it
                speaks of hope, restoration and finding our identity in God,
                even in life's most difficult seasons.
              </p>

              <p>
                At the heart of this foundation is a belief I hold deeply: no
                one should have to choose between their faith in God and seeking
                medical help to build a family.
              </p>

              <p>
                I believe that seeking fertility treatment should never be a
                reason to feel ashamed, question one's faith, or withdraw from
                the church and community that should offer love, encouragement
                and support. Faith and reproductive science can walk hand in
                hand, and I want to help create a space where people can embrace
                both without fear of judgement.
              </p>

              <p>
                My hope is that through Beulah Fertility Bridge Foundation, we
                can begin to change the conversations surrounding infertility,
                particularly within our faith communities, replacing silence and
                stigma with understanding, compassion and meaningful support.
              </p>

              <blockquote className="border-l-2 border-[#79563F] pl-4 italic text-[#79563F]">
                And so, I decided to begin with what I have.
              </blockquote>

              <p>
                That is how Beulah Fertility Bridge Foundation began: with
                faith, a heart willing to serve, and the hope that even a small
                beginning can make a meaningful difference in someone's life.
              </p>
            </div>
          </div>

          {/* CONTACT ME */}
          <section className="mt-20 md:mt-28">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
              {/* CONTACT INFORMATION */}
              <div>
                <h2 className="text-2xl md:text-3xl">Contact me</h2>

                <p className="text-sm leading-6 mt-6 text-[#62422C]">
                  Whether you'd like to learn more about Beulah Fertility Bridge
                  Foundation, explore opportunities to collaborate, or simply
                  share your thoughts, I'd be glad to hear from you.
                </p>

                <div className="border-l-2 border-[#79563F] pl-5 mt-10 space-y-5">
                  <p className="text-sm">
                    <a href="mailto:info@beulahfertilitybridge.com">
                      Email: info@beulahfertilitybridge.com
                    </a>
                  </p>

                  <a
                    href="#"
                    className="flex items-center gap-2 text-sm hover:text-[#8F6C54]"
                  >
                    <FaInstagram className="text-[#E1306C]" />
                    @beulahfertilitybridge
                  </a>

                  <a
                    href="#"
                    className="flex items-center gap-2 text-sm hover:text-[#8F6C54]"
                  >
                    <FaLinkedin className="text-[#0A66C2]" />
                    @beulahfertilitybridge
                  </a>
                </div>
              </div>

              {/* CONTACT FORM */}
              <div className="bg-white border-2 border-black rounded-2xl p-5 sm:p-7 w-full max-w-lg mx-auto">
                <form
                  onSubmit={handleContactSubmit}
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

                  <textarea
                    name="message"
                    placeholder="Message"
                    rows={5}
                    required
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
                      Thank you. Your message has been sent. We will reply
                      within 5 working days.
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
        </div>
      </section>
    </>
  );
}

export default About;
