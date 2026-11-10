import { SITE } from '../content/site'
import { useYears } from '../lib/years'
import { JsonLd, Seo } from '../components/ui'
import { CoverFan, CtaBand } from '../components/course'
import AboutHero from '../components/about/AboutHero'
import Timeline from '../components/about/Timeline'
import Founder from '../components/about/Founder'
import ProofStrip from '../components/about/ProofStrip'
import AwardsWall from '../components/about/AwardsWall'
import FacilityGrid from '../components/about/FacilityGrid'

export default function About() {
  const years = useYears()
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    url: `${SITE.url}/about`,
    mainEntity: {
      '@type': 'EducationalOrganization',
      name: SITE.name,
      url: SITE.url,
      foundingDate: String(SITE.since),
      founder: { '@type': 'Person', name: SITE.founder },
      address: { '@type': 'PostalAddress', streetAddress: 'Babu Plaza, 2nd Floor', addressLocality: 'Adoni', addressRegion: 'Andhra Pradesh', addressCountry: 'IN' },
    },
  }
  return (
    <>
      <Seo path="/about" title={`About RPC: ${years} years of computer education in Adoni`} description={`Founded in ${SITE.since} by ${SITE.founder}. ISO 9001:2015 certified, AP Govt DET permission since 2006, MSME registered, 5-time Education Excellence Award winners.`} />
      <JsonLd data={jsonLd} />
      <AboutHero />
      <Timeline />
      <Founder />
      <ProofStrip />
      <AwardsWall />
      <FacilityGrid />
      <CtaBand title={<>Come and see<br />the classrooms.</>} text={`Visit us at ${SITE.addressShort}, or send a message. We will help you pick the course, the batch and the start date.`} artNode={<CoverFan slugs={['oam', 'cca', 'c']} />} />
    </>
  )
}
