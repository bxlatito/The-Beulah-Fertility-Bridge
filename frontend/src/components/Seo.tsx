import { Helmet } from "react-helmet-async";

const SITE = "https://beulahfertilitybridge.com";

type Props = {
  title: string;
  description: string;
  path: string; // "/" for home, "/about" for About, and so on
};

export default function Seo({ title, description, path }: Props) {
  const url = path === "/" ? `${SITE}/` : `${SITE}${path}`;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
    </Helmet>
  );
}