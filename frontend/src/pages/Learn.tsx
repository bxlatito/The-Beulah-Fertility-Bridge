import { useState } from "react";
import { Link } from "react-router-dom";

import hand_heart from "../assets/holding_heart.jpg";
import open_bible from "../assets/open_bible.jpg";
import embryo from "../assets/embryo.jpg";
import adoption from "../assets/adoption.jpg";
import pregnancy from "../assets/pregnancy.jpg";
import sunset from "../assets/sunset.jpg";

function Learn() {
  const [menuOpen, setMenuOpen] = useState(false);

  const sections = [
    { id: "basics", title: "Basics" },
    { id: "causes", title: "Causes" },
    { id: "options", title: "Your Options" },
    { id: "myths", title: "Myths vs Facts" },
    { id: "faqs", title: "FAQs" },
  ];

  const navigateToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setMenuOpen(false);
  };

  const causes = [
    {
      number: "1",
      title: "Hormonal conditions",
      description:
        "Hormones control ovulation and the reproductive cycle. When they are out of balance, conceiving can be harder.",
      link: "https://www.nhs.uk/conditions/infertility/causes/",
    },
    {
      number: "2",
      title: "Ovulation or egg-related issues",
      description:
        "Eggs may not be released regularly, or their number or quality may be reduced.",
      link: "https://www.mayoclinic.org/diseases-conditions/infertility/symptoms-causes/syc-20354317",
    },
    {
      number: "3",
      title: "Sperm-related factors",
      description:
        "Low sperm count, poor movement or an unusual shape can make it harder for sperm to reach and fertilise an egg.",
      link: "https://www.nhs.uk/conditions/male-infertility/",
    },
    {
      number: "4",
      title: "Blocked or damaged fallopian tubes",
      description:
        "If the tubes are blocked, the egg and sperm may not be able to meet.",
      link: "https://www.hopkinsmedicine.org/health/conditions-and-diseases/fallopian-tube-obstruction",
    },
    {
      number: "5",
      title: "Age",
      description:
        "Fertility naturally declines with age, especially for women over 35, though men are affected too.",
      link: "https://www.acog.org/womens-health/faqs/having-a-baby-after-age-35",
    },
    {
      number: "6",
      title: "Underlying medical conditions",
      description:
        "Conditions such as PCOS, endometriosis, infections or other health problems can affect fertility in women and men.",
      link: "https://www.nhs.uk/conditions/infertility/causes/",
    },
  ];

  const options = [
    {
      title: "Assisted conception",
      description:
        "Treatments such as IUI and IVF, where medical support helps a pregnancy begin.",
      image: embryo,
      link: "https://www.nhs.uk/conditions/ivf/",
    },
    {
      title: "Third-party reproduction",
      description: "Using donated eggs, sperm or a surrogate.",
      image: pregnancy,
      link: "https://www.hfea.gov.uk/fertility-treatment/donation/",
    },
    {
      title: "Alternative paths to parenthood",
      description:
        "Adoption, fostering and other ways of building a family.",
      image: adoption,
      link: "https://www.gov.uk/adoption",
    },
  ];

  const faqs = [
    {
      question: "When should we see a doctor?",
      answer:
        "Consider seeing a doctor if pregnancy has not occurred after 12 months of regular, unprotected intercourse, or after 6 months if the woman is over 35. Seek advice sooner if you have known fertility concerns.",
    },
    {
      question: "Do both of us need to be tested?",
      answer:
        "Yes. Infertility can involve either partner, so both individuals may need appropriate fertility investigations.",
    },
    {
      question: "Is fertility treatment against my faith?",
      answer:
        "The relationship between faith and fertility treatment is a personal matter. We encourage you to seek medical information, reflect on your beliefs and discuss any concerns with trusted people.",
    },
  ];

  return (
    <>
      {/* NAVBAR AND HERO */}
      <div className="relative mt-17">

        <section className="relative h-80 sm:h-100 md:h-115 lg:h-125 bg-[#39332D] flex flex-col justify-center items-center text-center px-5">
          {/* HERO IMAGE PLACEHOLDER - ADD YOUR IMAGE HERE */}
          <div className="absolute inset-0 bg-[#39332D]">
            <img
              src={open_bible}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute bg-black/55 inset-0"></div>
          </div>

          <div className="relative z-10 w-full">
            <div className="flex items-center justify-center gap-5 mb-10">
              <div className="h-12 md:h-16 " />

              <h1 className="text-white text-2xl sm:text-3xl md:text-4xl">
                Understand your journey
              </h1>
            </div>

            <p className="text-white text-lg sm:text-xl md:text-2xl leading-relaxed max-w-4xl mx-auto">
              Clear, reliable information about fertility, in plain language and
              free from shame. Whatever stage you're at, we hope this helps you
              feel informed, supported and less alone.
            </p>
          </div>
        </section>
      </div>

      {/* FIND WHAT YOU NEED */}
      <section className="bg-[#F8F8F8] px-5 md:px-12 lg:px-20 py-12 md:py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div>
            <h2 className="text-xl md:text-2xl ">
              Find what you need...
            </h2>

            <p className="mt-5 text-sm text-gray-700">
              Start anywhere. Each topic is written in plain language.
            </p>
          </div>

          <div className="border-t border-[#8F6C54]">
            {[
              {
                title: "Infertility Basics",
                description:
                  "Definitions, timelines and what to seek help for.",
                id: "basics",
              },
              {
                title: "Causes",
                description: "Factors in women and men that can make it hard.",
                id: "causes",
              },
              {
                title: "Treatment options",
                description:
                  "What support, IVF, IUI and more explained simply.",
                id: "options",
              },
            ].map((item, index) => (
              <button
                key={index}
                onClick={() => navigateToSection(item.id)}
                className="w-full flex gap-4 items-start py-4 border-b border-[#8F6C54] text-left hover:bg-[#F0E8E3] transition px-2"
              >
                <span className="mt-1" aria-hidden="true">•</span>

                <div>
                  <h3 className=" text-sm text-[#62422C]">
                    {item.title}
                  </h3>

                  <p className="text-xs text-gray-600 mt-1">
                    {item.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT BANNER */}
      <section className="relative h-40 md:h-52 flex justify-center items-center text-center px-5">
        {/* IMAGE PLACEHOLDER - ADD YOUR IMAGE HERE */}
        <div className="absolute inset-0 bg-[#B7AAA0]">
          <img src={hand_heart} alt="" className="w-full h-full object-cover" />
          <div className="absolute bg-black/35 inset-0"></div>
        </div>

        <div className="relative z-10">
          <h2 className="text-white text-2xl md:text-4xl ">
            Do you want to ask specifics?
          </h2>

          <Link
            to="/contact"
            className="inline-block mt-7 border-2 border-white text-white rounded-xl px-8 py-3 text-sm  hover:bg-white hover:text-[#62422C] transition"
          >
            Contact Us
          </Link>
        </div>
      </section>

      {/* MOBILE SIDE NAVIGATION */}
      <div className="lg:hidden bg-[#F0E8E3] px-5 py-4">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-full flex justify-between items-center text-sm  text-[#62422C]"
        >
          On This Page
          <span aria-hidden="true">{menuOpen ? "−" : "+"}</span>
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

      {/* MAIN CONTENT WITH SIDEBAR */}
      <div className="flex items-stretch bg-[#F8F8F8]">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:block w-56 shrink-0 bg-[#F0E8E3]">
          <div className="sticky top-24 px-6 py-20">
            <h3 className="text-sm  mb-5 text-[#62422C]">
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

        {/* MAIN LEARN CONTENT */}
        <main className="flex-1 min-w-0 px-5 sm:px-8 md:px-12 lg:px-14 py-12">
          {/* INFERTILITY BASICS */}
          <section id="basics" className="max-w-5xl mx-auto mb-20 scroll-mt-28">
            <h2 className="text-xl md:text-2xl  underline decoration-[#8F6C54] underline-offset-8">
              Infertility Basics
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 mt-8">
              <div className="border-2 border-[#8F6C54] rounded-2xl p-6 text-center">
                <h3 className="">
                  What is <span className="text-[#8F6C54]">Infertility?</span>
                </h3>

                <p className="text-sm leading-6 mt-5 text-gray-700">
                  Infertility is when a couple is unable to conceive a child
                  after 12 months of regular, unprotected intercourse (or 6
                  months if the woman is over 35).
                </p>

                <a
                  href="https://www.who.int/news-room/fact-sheets/detail/infertility"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Read more about infertility from the World Health Organization"
                  className="inline-block mt-5 text-sm  hover:text-[#8F6C54]"
                >
                  Read More <span aria-hidden="true">→</span>
                </a>
              </div>

              <div className="border-2 border-[#8F6C54] rounded-2xl p-6 text-center">
                <h3 className="">
                  What is <span className="text-[#8F6C54]">Subfertility?</span>
                </h3>

                <p className="text-sm leading-6 mt-5 text-gray-700">
                  Subfertility means reduced fertility: conception may take
                  longer than expected, or may need medical support, but it is
                  not the same as sterility.
                </p>

                <a
                  href="https://www.nhs.uk/conditions/infertility/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Read more about subfertility from the NHS"
                  className="inline-block mt-5 text-sm  hover:text-[#8F6C54]"
                >
                  Read More <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </section>

          {/* INFERTILITY CAUSES */}
          <section id="causes" className="max-w-5xl mx-auto mb-24 scroll-mt-28">
            <h2 className="text-xl md:text-2xl  underline decoration-[#8F6C54] underline-offset-8">
              Infertility Causes
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 mt-10">
              {causes.map((cause) => (
                <div key={cause.number}>
                  <div className="flex gap-2 items-center border-b border-[#8F6C54] pb-2">
                    <span className="text-2xl text-[#8F6C54]">
                      {cause.number}
                    </span>

                    <h3 className=" text-base">{cause.title}</h3>
                  </div>

                  <p className="text-sm text-[#62422C] leading-6 mt-5">
                    {cause.description}
                  </p>

                  <a
                    href={cause.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Read more about ${cause.title}`}
                    className="block text-right mt-5 text-sm  hover:text-[#8F6C54]"
                  >
                    Read More <span aria-hidden="true">→</span>
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* TREATMENT OPTIONS */}
          <section
            id="options"
            className="max-w-5xl mx-auto mb-24 scroll-mt-28"
          >
            <h2 className="text-xl md:text-2xl  underline decoration-[#8F6C54] underline-offset-8">
              What are my options?
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {options.map((option, index) => (
                <div key={index}>
                  <img
                    src={option.image}
                    alt={option.title}
                    className="w-full h-52 object-cover rounded-t-lg"
                  />

                  <h3 className=" mt-4">{option.title}</h3>

                  <p className="text-sm leading-6 mt-3 text-gray-700">
                    {option.description}
                  </p>

                  <a
                    href={option.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Read more about ${option.title}`}
                    className="block text-right mt-4 text-xs  text-[#8F6C54] hover:underline"
                  >
                    Read More <span aria-hidden="true">→</span>
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* MYTHS VS FACTS */}
          <section id="myths" className="max-w-5xl mx-auto mb-24 scroll-mt-28">
            <h2 className="text-xl md:text-2xl  underline decoration-[#8F6C54] underline-offset-8">
              Myths Vs Facts
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              <div className="flex flex-col justify-center">
                <h3 className="">
                  Clearing up common misconceptions
                </h3>

                <p className="text-sm text-gray-700 mt-3">
                  There is a lot of information surrounding fertility. Let's
                  separate fact from fiction.
                </p>

                <a
                  href="https://www.cdc.gov/infertility/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Read more fertility facts from the CDC"
                  className="mt-5  text-sm hover:text-[#8F6C54]"
                >
                  Read More <span aria-hidden="true">→</span>
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    myth: "Infertility is always the woman's problem.",
                    fact: "Both partners can experience fertility issues and should be assessed.",
                  },
                  {
                    myth: "Seeking medical help shows a lack of faith.",
                    fact: "Many people in faith communities seek medical care while remaining grounded in their beliefs.",
                  },
                  {
                    myth: "Subfertility means you will never conceive.",
                    fact: "Pregnancy may still be possible, with or without medical support.",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-2 rounded-2xl overflow-hidden text-center text-[10px] lg:text-[11px]"
                  >
                    <div className="bg-[#62422C] text-white p-4 flex flex-col justify-center">
                      <h3 className=" mb-3">Myth</h3>
                      <p>{item.myth}</p>
                    </div>

                    <div className="bg-[#F0E8E3] text-[#62422C] p-4 flex flex-col justify-center">
                      <h3 className=" mb-3">Fact</h3>
                      <p>{item.fact}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FAITH BANNER */}
          <section className="max-w-5xl mx-auto mb-24">
            {/* IMAGE PLACEHOLDER - ADD YOUR IMAGE HERE */}
            <div className="relative min-h-80 md:min-h-100 bg-[#8A7665] rounded-3xl overflow-hidden flex justify-center items-center text-center px-5 py-12">
              <div className="absolute inset-0 bg-black/30">
                <img
                  src={sunset}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute bg-black/55 inset-0"></div>
              </div>

              <div className="relative z-10 max-w-3xl">
                <h2 className="text-2xl md:text-4xl text-white ">
                  Trust in God
                </h2>

                <p className="text-white text-base md:text-xl leading-7 mt-6">
                  Exploring fertility care does not mean a lack of faith. Many
                  people choose to seek medical support while trusting God and
                  staying grounded in their beliefs.
                </p>

                <Link
                  to="/contact"
                  className="inline-block mt-8 border-2 border-white rounded-xl px-8 py-3 text-white text-sm  hover:bg-white hover:text-[#62422C] transition"
                >
                  Contact us
                </Link>
              </div>
            </div>
          </section>

          {/* FAQS */}
          <section id="faqs" className="max-w-5xl mx-auto mb-12 scroll-mt-28">
            <h2 className="text-xl md:text-2xl underline decoration-[#8F6C54] underline-offset-8">
              FAQs
            </h2>

            <div className="mt-8 border-t border-[#8F6C54]">
              {faqs.map((faq, index) => (
                <details
                  key={index}
                  className="border-b border-[#8F6C54] py-5 group"
                >
                  <summary className="flex justify-between items-center gap-4 cursor-pointer text-sm md:text-base">
                    {faq.question}

                    <span className="text-[#8F6C54] text-xl group-open:rotate-45 transition-transform">
                      +
                    </span>
                  </summary>

                  <p className="mt-4 text-sm leading-7 text-gray-700">
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

export default Learn;