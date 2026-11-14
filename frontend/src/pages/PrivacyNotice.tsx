import law from "../assets/law.jpg";
import Seo from "../components/Seo";
import PolicyLayout, { type Section } from "./PolicyLayout";

const sections: Section[] = [
  {
    id: "who-we-are",
    title: "Who we are",
    toc: "Who we are",
    blocks: [
      {
        type: "p",
        text: "Beulah Fertility Bridge Foundation (BFBF) is a Christ-centred nonprofit initiative. This notice explains how we handle personal information when you use this website, contact us or ask for support.",
      },
    ],
  },
  {
    id: "what-we-collect",
    title: "What we collect",
    toc: "What we collect",
    blocks: [
      {
        type: "ul",
        items: [
          "Contact details you give us: your name, email and, if you choose, a phone or WhatsApp number.",
          "The message you send and the kind of help you ask for.",
          "If you ask about financial support, only the information needed to review your request are your Name, Email Address, and Phone Number, And a description of your situation and we'll answer within 5 working days.",
          "Basic website usage information, with your consent where required.",
          "Please do not send detailed medical history. We do not need it to reply to you.",
        ],
      },
    ],
  },
  {
    id: "how-we-use-it",
    title: "How we use it",
    toc: "How we use it",
    blocks: [
      {
        type: "ul",
        items: [
          "To reply to your message and provide the help you ask for.",
          "To review financial support requests fairly and consistently.",
          "To keep this website working and improve it.",
          "To meet legal and safeguarding obligations.",
          "We do not sell your information, and we do not use support enquiries for marketing.",
        ],
      },
    ],
  },
  {
    id: "who-sees-it",
    title: "Who sees it",
    toc: "Who sees it",
    blocks: [
      {
        type: "ul",
        items: [
          "Only the people on our team who need it to respond to you.",
          "Trusted service providers who help us run the website, forms and email, Our technical team.",
          "A healthcare partner, only if you ask for a referral and give your permission.",
          "Authorities, only where the law requires it or someone may be at risk.",
        ],
      },
    ],
  },
  {
    id: "keeping-it-safe",
    title: "Keeping it safe",
    toc: "Keeping it safe",
    blocks: [
      {
        type: "p",
        text: "We limit access, use secure systems and collect as little as we can.",
      },
      {
        type: "p",
        text: "We keep enquiries for 6 months after we last contact you. After that we delete or anonymise them.",
      },
    ],
  },
  {
    id: "your-rights",
    title: "Your rights",
    toc: "Your rights",
    blocks: [
      {
        type: "ul",
        items: [
          "Under the Nigeria Data Protection Act 2023 you can ask to see, correct or delete your information, object to how we use it, or withdraw consent at any time.",
          "Email info@beulahfertilitybridge.com and we will respond within 5 working days.",
          "You may also complain to the Nigeria Data Protection Commission.",
        ],
      },
    ],
  },
];

function PrivacyNotice() {
  return (
    <>
      <Seo
        title="Privacy Notice | Beulah Fertility Bridge Foundation"
        description="How the Beulah Fertility Bridge Foundation collects, uses and protects your personal information."
        path="/privacy-notice"
      />
      <PolicyLayout
        heroImage={law}
        title="Privacy notice"
        subtitle="How we collect, use and protect your information. Last updated: Dec 2026"
        sections={sections}
        related={[
          {
            title: "Safeguarding",
            description:
              "Our commitment to the safety and dignity of everyone we serve.",
            label: "Read safeguarding",
            href: "/safeguarding",
          },
          {
            title: "Disclaimer",
            description: "What our information is, and what it is not.",
            label: "Read disclaimer",
            href: "/disclaimer",
          },
        ]}
      />
    </>
  );
}

export default PrivacyNotice;
