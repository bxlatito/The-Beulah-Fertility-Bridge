import hero_section from "../assets/hero_section.png";
import hand_holding from "../assets/hand_holding.jpeg";
import church from "../assets/church.jpeg";
import dr_snake from "../assets/dr_snake.jpeg";
import doctor_lady from "../assets/doctor_lady.png";
import { Link } from "react-router-dom";
import { FaHeart, FaUsers, FaBookOpen } from "react-icons/fa";
import tobi from "../assets/Tobi_photo.jpeg";
import bible from "../assets/bible.jpg";
import Seo from "../components/Seo";

function Home() {
  const buttonStyle =
    "inline-flex items-center justify-center bg-[#8F6C54] text-white px-5 py-3 rounded-xl text-sm hover:bg-[#79563F] transition";

  const journeyButtonStyle =
    "inline-flex items-center justify-center bg-white text-[#62422C] px-4 py-2 rounded-lg text-xs hover:bg-[#EEE6E2] transition";

  return (
    <>
      <Seo
        title="Beulah Fertility Bridge Foundation | Faith and Fertility Support in Nigeria"
        description="Faith-based fertility education, support and community for couples and individuals in Nigeria."
        path="/"
      />

      {/* HERO SECTION */}
      <div className="relative mt-17">
        <img
          src={hero_section}
          alt="Family looking at the sun"
          className="w-full h-80 sm:h-100 md:h-115 lg:h-125 object-cover"
        />

        <div className="absolute bg-black/35 inset-0 flex flex-col gap-4 md:gap-5 justify-center items-center text-center px-4">
          <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl w-full md:w-8/12">
            Faith and Fertility Care Can Walk Hand In Hand
          </h1>

          <p className="text-white w-full md:w-8/12 text-sm sm:text-base lg:text-lg">
            stigma-free fertility education and compassionate support for
            couples rooted in faith and guided by evidence
          </p>

          <div className="flex flex-row justify-center items-center flex-wrap gap-3 md:gap-5 mt-5">
            <Link
              to="/get-support"
              className="bg-black text-white hover:text-[#BE9D8C] border-2 border-white px-5 py-3 rounded-xl transition"
            >
              Get Support
            </Link>

            <Link
              to="/about"
              className="bg-black text-white hover:text-[#BE9D8C] border-2 border-white px-5 py-3 rounded-xl transition"
            >
              Our Mission
            </Link>
          </div>
        </div>
      </div>

      {/* INTRODUCTION */}
      <div className="flex flex-col md:flex-row mt-7 gap-5 md:gap-17 px-5 md:px-15">
        <p className="text-black w-full md:w-1/2 text-base md:text-lg">
          Walking with you through fertility, with faith and support at every
          step
        </p>

        <p className="text-[#8F6C54] w-full md:w-1/2 text-sm pr-0 md:pr-15">
          Whether you are a couple, a faith leader or a healthcare professional,
          find clear information and compassionate support to help you make
          informed decisions.
        </p>
      </div>

      {/* AUDIENCE CARDS */}
      <div className="flex flex-col md:flex-row flex-wrap justify-center items-stretch gap-8 md:gap-12 mx-5 mt-10">
        {/* COUPLES */}
        <div className="w-full sm:w-85.5 max-w-full flex flex-col">
          <img
            src={hand_holding}
            alt="couple holding hands"
            className="w-full h-70.5 object-cover"
          />

          <div className="w-full min-h-70.5 bg-[#EEE6E2] px-5 py-8 flex flex-col items-center text-[#62422C] gap-5">
            <p className="text-center text-lg">For Couples</p>

            <p className="text-center flex-1">
              Plain-language answers about infertility and treatment, and a
              safe, confidential way to ask for support.
            </p>

            <Link to="/get-support" className={buttonStyle}>
              Get Support
            </Link>
          </div>
        </div>

        {/* FAITH LEADERS */}
        <div className="w-full sm:w-85.5 max-w-full flex flex-col">
          <img
            src={church}
            alt="church"
            className="w-full h-70.5 object-cover"
          />

          <div className="w-full min-h-70.5 bg-[#EEE6E2] px-5 py-8 flex flex-col items-center text-[#62422C] gap-5">
            <p className="text-center text-lg">For Faith Leaders</p>

            <p className="text-center flex-1">
              Understand how faith and assisted conception can coexist, so you
              can walk with couples in your community with knowledge and
              compassion.
            </p>

            <Link to="/get-involved" className={buttonStyle}>
              Partner with us
            </Link>
          </div>
        </div>

        {/* MEDICAL PROFESSIONALS */}
        <div className="w-full sm:w-85.5 max-w-full flex flex-col">
          <img
            src={dr_snake}
            alt="doctor logo"
            className="w-full h-70.5 object-cover"
          />

          <div className="w-full min-h-70.5 bg-[#EEE6E2] px-5 py-8 flex flex-col items-center text-[#62422C] gap-5">
            <p className="text-center text-lg">For Medical Professionals</p>

            <p className="text-center flex-1">
              Partner with us on responsible, evidence-based education and on
              bridging the gap between clinical care and the faith communities
              couples belong to.
            </p>

            <Link to="/get-involved" className={buttonStyle}>
              Partner with us
            </Link>
          </div>
        </div>
      </div>

      {/* YOU ARE NOT ALONE */}
      <div className="relative mt-17 w-11/12 md:w-8/10 mx-auto">
        <img
          src={doctor_lady}
          alt="doctor and woman"
          className="w-full h-100 md:h-140 object-cover rounded-4xl"
        />

        <div className="absolute bg-black/35 inset-0 flex flex-col gap-4 md:gap-5 justify-center items-center text-center rounded-4xl px-4">
          <h2 className="text-white text-3xl md:text-5xl w-full md:w-8/12">
            You Are <span className="text-[#BE9D8C]">Not Alone</span>
          </h2>

          <p className="text-white w-full md:w-8/12 text-sm md:text-lg">
            Isaiah 62:4 "Thou shalt no more be termed Forsaken; neither shall
            thy land any more be termed Desolate: but thou shalt be called
            Hephzibah, and thy land shall be married."
          </p>

          <Link
            to="/contact"
            className="bg-[#BE9D8C] text-white hover:bg-[#8F6C54] border-2 border-white px-5 py-3 rounded-xl transition mt-5"
          >
            Contact Us
          </Link>
        </div>
      </div>

      {/* UNDERSTAND YOUR JOURNEY */}
      <h2 className="text-center text-3xl md:text-4xl mt-20 px-4">
        Understand Your Journey
      </h2>

      <div className="flex flex-col md:flex-row flex-wrap justify-center items-stretch gap-8 md:gap-12 mx-5 mt-10">
        {/* INFERTILITY */}
        <div className="w-full sm:w-85.5 max-w-full">
          <div className="w-full h-101 bg-[#EEE6E2] px-5 flex flex-col items-center gap-5 text-[#62422C] py-10 rounded-4xl">
            <p className="text-center text-lg">What is Infertility?</p>

            <p className="text-center flex-1">
              Infertility is when a couple is unable to conceive a child after
              12 months of regular, unprotected intercourse (or 6 months if the
              woman is over 35).
            </p>

            <div className="w-4/5 mx-auto bg-white text-black text-center text-sm p-2 rounded-xl">
              It is a medical condition. You are not alone and it is not your
              fault.
            </div>

            <Link to="/learn" className={buttonStyle}>
              Learn More
            </Link>
          </div>
        </div>

        {/* SUBFERTILITY */}
        <div className="w-full sm:w-85.5 max-w-full">
          <div className="w-full h-101 bg-[#EEE6E2] px-5 flex flex-col items-center gap-5 text-[#62422C] py-10 rounded-4xl">
            <p className="text-center text-lg">What is Subfertility?</p>

            <p className="text-center flex-1">
              Subfertility means it takes longer than expected to conceive a
              child, but pregnancy may still be possible, with or without
              medical support.
            </p>

            <div className="w-4/5 mx-auto bg-white text-black text-center text-sm p-2 rounded-xl">
              Every journey is different.
            </div>

            <Link to="/learn" className={buttonStyle}>
              Learn More
            </Link>
          </div>
        </div>

        {/* CAUSES */}
        <div className="w-full sm:w-85.5 max-w-full">
          <div className="w-full h-101 bg-[#EEE6E2] px-5 flex flex-col items-center gap-5 text-[#62422C] py-10 rounded-4xl">
            <p className="text-center text-lg">What Can Cause Infertility?</p>

            <p className="text-center">
              Infertility can be caused by a range of factors, including:
            </p>

            <ol className="text-sm list-decimal pl-5 w-full flex-1 space-y-2">
              <li>Hormonal conditions</li>
              <li>Ovulation or egg-related issues</li>
              <li>Sperm-related factors</li>
              <li>Blocked or damaged fallopian tubes</li>
              <li>Age</li>
              <li>Underlying medical conditions</li>
            </ol>

            <Link to="/learn" className={buttonStyle}>
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* FAITH SECTION */}
      <h2 className="text-center text-4xl md:text-6xl mt-20 md:mt-30 px-4">
        Your Faith <span className="text-[#8F6C54]">Matters</span>
      </h2>

      <p className="text-center text-lg md:text-2xl w-11/12 md:w-8/12 mx-auto mt-10">
        Exploring fertility care does not mean a lack of faith. Many people
        choose to seek medical support while trusting God and staying grounded
        in their beliefs.
      </p>

      <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 mt-10">
        <Link
          to="/get-involved"
          className="flex flex-col items-center gap-2 hover:text-[#8F6C54]"
        >
          <FaHeart className="text-4xl" />
          <p>Pray</p>
        </Link>

        <Link
          to="/get-support"
          className="flex flex-col items-center gap-2 hover:text-[#8F6C54]"
        >
          <FaUsers className="text-4xl" />
          <p>Seek Support</p>
        </Link>

        <Link
          to="/learn"
          className="flex flex-col items-center gap-2 hover:text-[#8F6C54]"
        >
          <FaBookOpen className="text-4xl" />
          <p>Learn</p>
        </Link>
      </div>

      {/* FOUNDER MESSAGE */}
      <div className="flex flex-col md:flex-row justify-center items-center w-11/12 md:w-10/12 mx-auto bg-[#959595] p-6 md:p-12 mt-20 md:mt-25 rounded-4xl">
        <div className="flex flex-col justify-center items-center gap-5 w-full md:w-1/2">
          <img
            src={tobi}
            alt="founder image"
            className="w-full max-w-180 h-80 md:h-115 object-contain rounded-xl"
          />

          <p>Olabode Oluwatobiloba, MSc</p>
        </div>

        <div className="flex flex-col justify-center items-center px-2 md:px-10 gap-7 md:gap-10 text-center w-full md:w-1/2 mt-8 md:mt-0">
          <p className="text-2xl md:text-3xl">A Message From The Founder</p>

          <p>
            Through my journey in reproductive science and my walk with God, I
            became increasingly aware of the challenges faced by individuals and
            couples navigating infertility, particularly within faith
            communities.
          </p>

          <p>
            I believe it is time to replace silence and stigma with
            understanding, compassion and meaningful support. What began as a
            prayer and a vision is now a commitment to making a difference, one
            life and one family at a time.
          </p>

          <Link
            to="/about"
            className="inline-flex items-center justify-center px-5 py-3 text-black bg-white rounded-xl text-sm hover:bg-gray-300 transition"
          >
            See More
          </Link>
        </div>
      </div>

      {/* GET INVOLVED */}
      <div className="mt-20 relative w-full min-h-170">
        <img
          src={bible}
          alt="bible"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="relative z-10 min-h-170 bg-black/50 flex flex-col gap-5 justify-start items-start text-left px-5 md:px-10 pb-10">
          <h2 className="text-white text-3xl md:text-5xl w-full md:w-8/12 pt-10 md:pt-15">
            Be Part Of The Journey
          </h2>

          <p className="text-white w-full md:w-8/12 pt-3 md:pt-7 text-sm md:text-lg">
            This vision cannot grow alone. It needs people willing to pray,
            encourage, share their wisdom and help open doors.
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap justify-center items-stretch gap-5 md:gap-8 mt-5 md:mt-10 w-full">
            {/* PRAY */}
            <div className="w-full sm:w-63.75 min-h-70 bg-white/77 rounded-3xl p-6 flex flex-col justify-start items-center text-center gap-6">
              <h2 className="text-[#8F6C54] text-xl">Pray with Us</h2>

              <p className="flex-1">
                Stand with couples on this journey. Join us in prayer and
                encouragement.
              </p>

              <Link to="/get-involved" className={journeyButtonStyle}>
                Send a prayer
              </Link>
            </div>

            {/* VOLUNTEER */}
            <div className="w-full sm:w-63.75 min-h-70 bg-white/77 rounded-3xl p-6 flex flex-col justify-start items-center text-center gap-6">
              <h2 className="text-[#8F6C54] text-xl">Volunteer</h2>

              <p className="flex-1">
                Lend your time and skills to education, outreach and community
                conversations.
              </p>

              <Link to="/get-involved" className={journeyButtonStyle}>
                Volunteer with us
              </Link>
            </div>

            {/* PARTNER */}
            <div className="w-full sm:w-63.75 min-h-70 bg-white/77 rounded-3xl p-6 flex flex-col justify-start items-center text-center gap-6">
              <h2 className="text-[#8F6C54] text-xl">Partner</h2>

              <p className="flex-1">
                Churches, clinics and healthcare professionals: work with us on
                responsible education and support.
              </p>

              <Link to="/get-involved" className={journeyButtonStyle}>
                Partner with us
              </Link>
            </div>

            {/* DONATE */}
            <div className="w-full sm:w-63.75 min-h-70 bg-white/77 rounded-3xl p-6 flex flex-col justify-start items-center text-center gap-6">
              <h2 className="text-[#8F6C54] text-xl">Donate</h2>

              <p className="flex-1">
                Help us work towards supporting eligible couples with the cost
                of fertility investigations and treatment.
              </p>

              <Link to="/donate" className={journeyButtonStyle}>
                Donate
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
