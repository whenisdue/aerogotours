import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Brand } from "../components/Brand";
import { SiteHeader } from "../components/SiteHeader";
import { findDestination } from "../data/destinations";

export function DestinationPage() {
  const { slug } = useParams();
  const destination = findDestination(slug);

  if (!destination) {
    return <div className="public-site destination-site">
      <SiteHeader />
      <main className="destination-not-found page-shell">
        <span className="eyebrow">A LITTLE DETOUR</span>
        <h1>We couldn’t find that place.</h1>
        <p>There are plenty of other places to imagine.</p>
        <Link className="text-link" to="/">Back to AeroGo <ArrowLeft size={16} /></Link>
      </main>
      <DestinationFooter />
    </div>;
  }

  return <div className="public-site destination-site">
    <SiteHeader />
    <main>
      <section className="destination-hero" aria-labelledby="destination-title">
        <img className="destination-hero__image" src={destination.heroImage} alt={destination.imageAlt} fetchPriority="high" />
        <div className="destination-hero__shade" />
        <div className="page-shell destination-hero__content">
          <Link className="destination-hero__back" to="/" aria-label="Back to AeroGo homepage"><ArrowLeft size={15} /> AeroGo</Link>
          <div>
            <span className="eyebrow eyebrow--light"><span className="eyebrow-mark" /> A PLACE TO IMAGINE</span>
            <h1 id="destination-title">{destination.name}</h1>
            <p>{destination.tagline}</p>
          </div>
        </div>
      </section>

      <section className="destination-intro page-shell">
        <span className="eyebrow">A FEELING, NOT A CHECKLIST</span>
        <div className="destination-intro__copy">
          {destination.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </section>

      {(destination.slug === "japan" || destination.slug === "thailand" || destination.slug === "south-korea") && <section className="destination-dream-entry page-shell" aria-labelledby="destination-dream-title">
        <div className="destination-dream-entry__copy"><span className="eyebrow">A DIFFERENT WAY TO BEGIN</span><h2 id="destination-dream-title">Imagine your trip to {destination.name}</h2><p>See what a vacation here could look like before you make any plans.</p></div>
        <Link className="button destination-dream-entry__button" to={`/dream/${destination.slug}`}>Explore a Dream Trip <ArrowUpRight size={17} /></Link>
      </section>}

      <section className="destination-moments">
        <div className="page-shell">
          <div className="destination-section-heading">
            <span className="eyebrow">A FEW WAYS IT COULD FEEL</span>
            <h2>What a trip could feel like.</h2>
          </div>
          <div className="destination-moments__grid">
            {destination.moments.map((moment, index) => <article className="destination-moment" key={moment.title}>
              <span className="destination-moment__number">0{index + 1}</span>
              <h3>{moment.title}</h3>
              <p>{moment.description}</p>
            </article>)}
          </div>
        </div>
      </section>

      <section className="destination-journey page-shell">
        <div className="destination-section-heading destination-section-heading--journey">
          <div><span className="eyebrow">A LOOSE STARTING POINT</span><h2>A trip could look like…</h2></div>
          <p>Just inspiration. The best version of your trip can take a different shape.</p>
        </div>
        <ol className="destination-journey__list">
          {destination.journey.map((day) => <li key={day.day}>
            <span>DAY {day.day}</span>
            <div><h3>{day.title}</h3><p>{day.description}</p></div>
          </li>)}
        </ol>
      </section>

      <section className="destination-cta">
        <div className="page-shell destination-cta__inner">
          <span className="eyebrow eyebrow--light">WHENEVER YOU’RE READY</span>
          <h2>Thinking about {destination.name}?</h2>
          <p>Tell us what kind of trip you have in mind. We’ll help you compare the options and organize the details.</p>
          <Link className="button destination-cta__button" to="/#inquiry">Tell us about your trip <ArrowUpRight size={17} /></Link>
          <Link className="destination-cta__browse" to="/">Keep daydreaming <ArrowRight size={15} /></Link>
        </div>
      </section>
    </main>
    <DestinationFooter />
  </div>;
}

function DestinationFooter() {
  return <footer className="site-footer"><div className="page-shell site-footer__inner"><Brand light /><span>Thoughtful travel planning, made simpler.</span><span className="site-footer__domain">aerogotours.com</span><span className="site-footer__legal">© 2026 AeroGo Travel &amp; Tours · Sample prototype</span></div></footer>;
}
