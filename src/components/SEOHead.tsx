import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
}

const SITE_NAME = 'Gurukul Vidyalay & Jr. College';
const BASE_URL = 'https://gvsjc.vercel.app';
const DEFAULT_IMAGE = `${BASE_URL}/middle_school_building.jpg`;

const DEFAULT_DESCRIPTION =
  'Gurukul Vidyalay & Junior College, Chokak (Hatkanangale, Kolhapur) — Maharashtra State Board school offering Pre-Primary, Primary (I–V) & Junior College (XI–XII). Admissions open for 2026-27. Call +91 70832 37878.';

const DEFAULT_KEYWORDS =
  'Gurukul Vidyalay, Gurukul Junior College Chokak, school Kolhapur, Maharashtra State Board, HSC Kolhapur, admission 2026, 11th admission Kolhapur, best school Chokak, GVSJC';

export default function SEOHead({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  canonical,
  ogImage = DEFAULT_IMAGE,
}: SEOHeadProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Chokak, Kolhapur – Admissions 2026-27`;
  const canonicalUrl = canonical ? `${BASE_URL}${canonical}` : BASE_URL;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}
