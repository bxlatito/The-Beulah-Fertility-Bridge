import law from "../assets/law.jpg";
import Seo from "../components/Seo";
import PolicyLayout, { type Section } from "./PolicyLayout";

const sections: Section[] = [
  {
    id: "our-commitment",
    title: "Our commitment",
    toc: "Our commitment",
    blocks: [
      {
        type: "p",
        text: "BFBF is committed to protecting children and adults at risk. Everyone we work with should be treated with dignity and respect, whatever their beliefs, and should never be pressured, shamed or exploited.",
      },
    ],
  },
  {
    id: "who-it-covers",
    title: "Who it covers",
    toc: "Who it covers",
    blocks: [
      {
        type: "p",
        text: "Our founder, volunteers, contributors, partners and faith leaders, and everyone who takes part in our programmes, events and online spaces.",
      },
    ],
  },
  {
    id: "our-principles",
    title: "Our principles",
    toc: "Our principles",
    blocks: [
      {
        type: "ul",
        items: [
          "Dignity and consent: people decide what they share and what they do.",
          "Confidentiality, except where someone may be at risk of harm.",
          "No pressure to share a faith, join religious activity or choose a treatment.",
          "No promises of treatment outcomes, funding or special access.",
          "Safe online spaces: community spaces open only once moderation and safeguarding capacity are in place.",
          "Clear boundaries between volunteers and the people they support.",
        ],
      },
    ],
  },
  {
    id: "raise-a-concern",
    title: "Raise a concern",
    toc: "Raise a concern",
    blocks: [
      {
        type: "ul",
        items: [
          "If you are worried about someone, email info@beulahfertilitybridge.com with what you have seen or heard. We will acknowledge it within 5 working days, record it securely and act on it.",
          "If someone is in immediate danger, contact the police or local emergency services first: 112 (local emergency number).",
          "Where needed we will refer to the appropriate authorities.",
        ],
      },
    ],
  },
  {
    id: "safer-conduct",
    title: "Safer conduct",
    toc: "Safer conduct",
    blocks: [
      {
        type: "ul",
        items: [
          "Volunteers and partners agree to a code of conduct before they take part.",
          "We carry out checks that are proportionate to the role.",
          "We provide basic safeguarding guidance to everyone who represents BFBF.",
        ],
      },
    ],
  },
  {
    id: "responsibility",
    title: "Responsibility",
    toc: "Responsibility",
    blocks: [
      {
        type: "p",
        text: "This policy is reviewed at least every 12 months and after any serious concern.",
      },
    ],
  },
];

function Safeguarding() {
  return (
    <>
      <Seo
        title="Safeguarding | Beulah Fertility Bridge Foundation"
        description="Our commitment to the safety and dignity of everyone we serve."
        path="/safeguarding"
      />
      <PolicyLayout
        heroImage={law}
        title="Safeguarding"
        subtitle="Our commitment to the safety and dignity of everyone we serve. Last reviewed: Dec 2026"
        sections={sections}
        related={[
          {
            title: "Privacy notice",
            description: "How we collect, use and protect your information.",
            label: "Read privacy notice",
            href: "/privacy-notice",
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

export default Safeguarding;
