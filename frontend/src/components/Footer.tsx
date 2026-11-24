import ringless_logo from "../assets/ringless_logo.png"
import { Link } from 'react-router-dom'
import { FaInstagram, FaFacebook, FaLinkedin } from 'react-icons/fa';

function Footer() {
  return (
    <>
      <div className="flex flex-col md:flex-row bg-black bottom-0 right-0">

        <div className="w-full md:w-1/3 flex flex-col justify-center items-center gap-5 text-center text-white p-5">
            <img src={ringless_logo} alt="BFBF logo" className="w-40.75 h-25.75"/>
            <p>BEULAH FERTILITY BRIDGE FOUNDATION</p>
            <p>Bridging faith, science and hope. A Christ-centred initiative connecting faith, assisted conception, reproductive health education and compassionate support.</p>
            <p>© 2026 Beulah Fertility Bridge Foundation. All rights reserved.</p>
        </div>

        <div className="w-full md:w-1/3 flex flex-col justify-evenly items-center gap-10 md:gap-20 text-center border-y md:border-y-0 md:border-x p-5 border-white">

            <div className="flex flex-col justify-center items-center gap-5 text-white">
                <p className="text-[#8F6C54]">GET IN TOUCH</p>
                <p>info@beulahfertilitybridge.com</p>
                <p className='hover:text-[#8F6C54] w-fit text-white text-sm'><Link to='/contact'>contact form</Link></p>
            </div>

            <div className="flex flex-col justify-center items-center gap-5">
                <p className="text-[#8F6C54]">POLICIES</p>
                <p className='hover:text-[#8F6C54] w-fit text-white text-sm'><Link to='/privacy-notice'>Privacy Notice</Link></p>
                <p className='hover:text-[#8F6C54] w-fit text-white text-sm'><Link to='/safeguarding'>Safeguarding</Link></p>
                <p className='hover:text-[#8F6C54] w-fit text-white text-sm'><Link to='/disclaimer'>Discalimer</Link></p>
            </div>

        </div>

        <div className="w-full md:w-1/3 flex flex-col justify-evenly items-center gap-10 md:gap-20 text-center p-5">

            <div className="flex items-center gap-5 pt-8">

                <a href="https://www.instagram.com/beulahfertilitybridge/" target="_blank" rel="noopener noreferrer">
                    <FaInstagram className="text-3xl hover:text-[#8F6C54] text-white" />
                </a>

                <a href="https://www.facebook.com/share/1AQPfjXRHn/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer">
                    <FaFacebook className="text-3xl hover:text-[#8F6C54] text-white" />
                </a>

                <a href="https://www.linkedin.com/company/beulah-fertility-bridge-foundation/" target="_blank" rel="noopener noreferrer">
                    <FaLinkedin className="text-3xl hover:text-[#8F6C54] text-white" />
                </a>

            </div>

            <div className="flex flex-col items-center gap-3">
                <p className="text-[#8F6C54]">EXPLORE</p>
                <p className='hover:text-[#8F6C54] w-fit text-white text-sm'><Link to='/'>Home</Link></p>
                <p className='hover:text-[#8F6C54] w-fit text-white text-sm'><Link to='/get-support'>Get Support</Link></p>
                <p className='hover:text-[#8F6C54] w-fit text-white text-sm'><Link to='/learn'>Learn</Link></p>
                <p className='hover:text-[#8F6C54] w-fit text-white text-sm'><Link to='/what-we-do'>What We Do</Link></p>
                <p className='hover:text-[#8F6C54] w-fit text-white text-sm'><Link to='/get-involved'>Get Involved</Link></p>
                <p className='hover:text-[#8F6C54] w-fit text-white text-sm'><Link to='/about'>About</Link></p>
                <p className='hover:text-[#8F6C54] w-fit text-white text-sm'><Link to='/contact'>Contact</Link></p>
                <p className='hover:text-[#8F6C54] w-fit text-white text-sm'><Link to='/donate'>Donate</Link></p>
            </div>

        </div>

      </div>
    </>
  );
}

export default Footer;