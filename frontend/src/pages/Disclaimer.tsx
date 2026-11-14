import law from "../assets/law.jpg";
import Seo from "../components/Seo";
import PolicyLayout, { type Section } from "./PolicyLayout";

const sections: Section[] = [
  {
    id: "educational-only",
    title: "Educational information only",
    toc: "Educational only",
    blocks: [
      {
        type: "p",
        text: "Everything on this website is for education and encouragement. It is not medical advice, diagnosis or treatment, and it does not replace guidance from a qualified healthcare provider.",
      },
      {
        type: "p",
        text: "Contacting BFBF does not create a doctor-patient relationship.",
      },
    ],
  },
  {
    id: "emergencies",
    title: "In an emergency",
    toc: "Emergencies",
    blocks: [
      {
        type: "p",
        text: "If you have severe pain, heavy bleeding or any urgent health concern, go to your nearest hospital or call your local emergency number. Do not wait for a reply from us.",
      },
    ],
  },
  {
    id: "no-promises",
    title: "No promises",
    toc: "No promises",
    blocks: [
      {
        type: "p",
        text: "Every fertility journey is different. We do not promise conception or any particular treatment outcome.",
      },
      {
        type: "p",
        text: "Financial support depends on eligibility and available funds, and is never guaranteed.",
      },
    ],
  },
  {
    id: "faith-content",
    title: "Faith content",
    toc: "Faith content",
    blocks: [
      {
        type: "p",
        text: "We share biblical encouragement and prayer because faith is central to who we are. People hold different views on faith and assisted conception, and we encourage you to speak with your pastor and your doctor.",
      },
      {
        type: "p",
        text: "Support does not depend on taking part in any religious activity.",
      },
    ],
  },
  {
    id: "sources-and-links",
    title: "Sources and links",
    toc: "Sources and links",
    blocks: [
      {
        type: "ul",
        items: [
          "Our guides are reviewed by our medical reviewer, with sources and review dates shown on each guide.",
          "We link to other websites for your convenience. We do not control them and are not responsible for their content.",
          "Personal stories are shared with consent and show individual experiences, not typical results.",
        ],
      },
    ],
  },
  {
    id: "accuracy",
    title: "Accuracy and changes",
    toc: "Accuracy",
    blocks: [
      {
        type: "p",
        text: "We try to keep information accurate and current, but medicine and guidance change. If you spot an error, please tell us through the Contact page.",
      },
      {
        type: "p",
        text: "We may update this disclaimer from time to time.",
      },
    ],
  },
];

function Disclaimer() {
  return (
    <>
      <Seo
        title="Disclaimer | Beulah Fertility Bridge Foundation"
        description="Important information about the educational nature of the content on this website."
        path="/disclaimer"
      />
      <PolicyLayout
        heroImage={law}
        title="Disclaimer"
        subtitle="What our information is, and what it is not. Last updated: Dec 2026"
        sections={sections}
        related={[
          {
            title: "Privacy notice",
            description: "How we collect, use and protect your information.",
            label: "Read privacy notice",
            href: "/privacy-notice",
          },
          {
            title: "Safeguarding",
            description:
              "Our commitment to the safety and dignity of everyone we serve.",
            label: "Read safeguarding",
            href: "/safeguarding",
          },
        ]}
      />
    </>
  );
}

export default Disclaimer;
