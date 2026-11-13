import { Link } from "react-router-dom";

import writing from "../assets/writing.jpg";
import referal from "../assets/referal.jpg";
import hand_to_sun from "../assets/hand_to_sun.jpg";
import community from "../assets/community.jpg";
import business_meeting from "../assets/business_meeting.jpg";
import conversation from "../assets/conversation.jpg";

function WhatWeDo() {
  const services = [
    {
      title: "Faith and fertility conversations",
      description:
        "Many people feel caught between their faith and their wish for a child. We create space for honest, judgement-free conversations in churches, homes and communities.",
      points: [
        "Discussions on faith and assisted conception",
        "Questions to explore with your partner and your doctor",
        "Reflections that hold faith and science together",
      ],
      imageSide: "left",
      image: conversation,
    },
    {
      title: "Evidence-based education",
      description:
        "Plain-language guides on infertility, causes, tests and treatment options, reviewed by a named medical reviewer and kept up to date.",
      points: [
        "Infertility basics, causes and treatment pathways",
        "Myth-versus-fact explainers",
        "Guides, reviewed and review dates on every guide",
      ],
      imageSide: "right",
      image: writing,
    },
    {
      title: "Emotional and community support",
      description:
        "Infertility can be lonely. We are working towards ways for people to find encouragement, understanding and trusted referrals.",
      points: [
        "A confidential way to ask for support",
        "Guidance on where to find counselling and care",
        "Moderated community spaces, once safeguarding and capacity are in place",
      ],
      imageSide: "left",
      image: community,
    },
    {
      title: "Prayer groups and clinic referrals",
      description:
        "Two ways to feel less alone and take a next step. Join others in prayer and encouragement, and when you are ready, be pointed towards trusted fertility care.",
      points: [
        "Prayer group sessions: safe, confidential space, open to people of all beliefs",
        "Referrals to fertility clinics we have reviewed and partnered with",
      ],
      imageSide: "right",
      image: referal,
    },
    {
      title: "Financial assistance",
      description:
        "Cost keeps many couples from care. We plan to begin with a small pilot that helps eligible couples with investigations or treatment.",
      points: [
        "Clear eligibility and application steps, published first",
        "Transparent reporting on how funds are used",
        "No promises of any treatment outcome",
      ],
      imageSide: "left",
      image: business_meeting,
    },
  ];

  const supporters = [
    {
      title: "Faith leaders and churches",
      description:
        "Invite us to share education and open honest conversations in your community.",
    },
    {
      title: "Healthcare professionals",
      description:
        "Work with us on responsible, evidence-based education and on bridging clinical care and faith communities.",
    },
    {
      title: "Volunteers and supporters",
      description:
        "Lend your time, skills or prayers to help couples feel less alone.",
    },
  ];

  return (
    <>
      {/* NAVBAR AND HERO */}
      <div className="relative mt-17">

        <section className="relative h-80 sm:h-100 md:h-115 lg:h-125 flex items-center justify-center text-center px-5">

          {/* HERO IMAGE */}
          <div className="absolute inset-0">
            <img
              src={hand_to_sun}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>

          <div className="absolute inset-0 bg-black/40" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-5">



            <div className="hidden sm:block h-12" />

            <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-normal">
              How we can help you
            </h1>

          </div>
        </section>
      </div>

      {/* INTRODUCTION */}
      <section className="bg-[#F8F8F8] px-5 py-14 md:py-20">

        <p className="max-w-4xl mx-auto text-center text-base md:text-lg leading-7 text-black font-normal">
          We walk with individuals and couples facing infertility
          through faith conversations, clear education, community
          support and, as we grow, help with access to care.
        </p>

      </section>

      {/* OUR SERVICES */}
      <section className="bg-[#F8F8F8] px-5 md:px-10 lg:px-16 pb-16">

        <div className="max-w-6xl mx-auto flex flex-col gap-10 md:gap-14">

          {services.map((service, index) => (
            <div
              key={index}
              className="relative border-2 border-[#79563F] rounded-2xl p-5 md:p-8 lg:p-10"
            >

              {/* STATUS LABEL */}
              <span className="absolute top-4 right-5 md:top-5 md:right-6 bg-[#558B00] text-white text-[10px] font-normal rounded-full px-3 py-1">
                Active
              </span>

              <div
                className={`flex flex-col ${
                  service.imageSide === "right"
                    ? "md:flex-row-reverse"
                    : "md:flex-row"
                } items-center gap-7 md:gap-12`}
              >

                {/* SERVICE IMAGE */}
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full md:w-1/2 h-52 sm:h-64 md:h-60 lg:h-72 shrink-0 rounded-xl object-cover"
                />

                {/* SERVICE INFORMATION */}
                <div className="w-full md:flex-1 pt-5 md:pt-0">

                  <h2 className="text-xl md:text-2xl text-[#79563F] font-normal">
                    {service.title}
                  </h2>

                  <p className="mt-5 text-sm md:text-base leading-6 text-black font-normal">
                    {service.description}
                  </p>

                  <ul className="mt-6 border-t border-[#79563F]">

                    {service.points.map((point, pointIndex) => (
                      <li
                        key={pointIndex}
                        className="flex items-start gap-4 border-b border-[#79563F] py-2 text-xs md:text-sm text-black font-normal"
                      >
                        <span className="text-black">●</span>
                        <span>{point}</span>
                      </li>
                    ))}

                  </ul>

                  <Link
                    to="/get-support"
                    className="block text-right mt-6 text-sm text-black font-normal hover:text-[#8F6C54]"
                  >
                    Get Started →
                  </Link>

                </div>

              </div>
            </div>
          ))}

        </div>
      </section>

      {/* JOIN US */}
      <section className="bg-[#F0E8E3] px-5 md:px-12 lg:px-20 py-14 md:py-20">

        <div className="max-w-6xl mx-auto">

          <h2 className="text-2xl md:text-3xl text-center font-normal underline decoration-[#8F6C54] underline-offset-8">
            Join Us, We would love your support
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-14">

            {supporters.map((supporter, index) => (
              <div key={index}>

                <h3 className="text-base md:text-lg font-normal border-b-2 border-[#79563F] pb-4">
                  {supporter.title}
                </h3>

                <p className="mt-5 text-sm md:text-base text-[#62422C] leading-7 font-normal">
                  {supporter.description}
                </p>

                <Link
                  to="/get-involved"
                  className="inline-block mt-6 text-sm text-black font-normal hover:text-[#8F6C54]"
                >
                  Get Started →
                </Link>

              </div>
            ))}

          </div>

        </div>
      </section>

    </>
  );
}

export default WhatWeDo;