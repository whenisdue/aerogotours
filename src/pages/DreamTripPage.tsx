import { ArrowLeft, ArrowRight, ArrowUpRight, Building2, CalendarDays, Check, Gauge, MapPin, Mountain, Sparkles, Utensils, Users, WalletCards } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Brand } from "../components/Brand";
import { SiteHeader } from "../components/SiteHeader";
import {
  type DreamDestinationSlug,
  type DreamDuration,
  type DreamGroup,
  type DreamInterest,
  type DreamPace,
  type DreamTripAnswers,
} from "../data/dreamTrips";
import { buildDreamTripHandoff, createDreamTrip, getBudgetGuidance, getDreamDestination, getDurationLabel, getGroupNote, getInterestOptions, getStayAreas } from "../utils/dreamTripEngine";

type DreamView = "questions" | "preview";
type DecisionPanel = "budget" | "family" | "shorter" | "slower" | null;

type DreamDurationOption = { value: DreamDuration; shortLabel: string; label: string; description: string };

const initialAnswers: DreamTripAnswers = {
  group: "sample",
  travelers: 4,
  duration: 7,
  interest: "mix",
  pace: "balanced",
};

const groupOptions: { value: DreamGroup; label: string; description: string; icon: typeof Users }[] = [
  { value: "solo", label: "Just me", description: "A journey shaped around your own curiosity.", icon: Users },
  { value: "couple", label: "Couple", description: "Time to share the moments that matter.", icon: Users },
  { value: "family", label: "Family", description: "Discovery with room for everyone to reset.", icon: Users },
  { value: "friends", label: "Friends", description: "Good food, new stories and shared detours.", icon: Users },
];

const durationOptions: DreamDurationOption[] = [
  { value: 3, shortLabel: "3D2N", label: "3 days / 2 nights", description: "A focused beginning." },
  { value: 4, shortLabel: "4D3N", label: "4 days / 3 nights", description: "A first taste with room to wander." },
  { value: 5, shortLabel: "5D4N", label: "5 days / 4 nights", description: "More room for a nearby change of scenery." },
  { value: 7, shortLabel: "7D6N", label: "7 days / 6 nights", description: "Two regions with time to settle in." },
  { value: 10, shortLabel: "10D9N", label: "10 days / 9 nights", description: "More room for different sides of a place." },
];

const paceOptions: { value: DreamPace; label: string; description: string; icon: typeof Gauge }[] = [
  { value: "slow", label: "Slow and relaxed", description: "Fewer anchors, more room to notice.", icon: Gauge },
  { value: "balanced", label: "A comfortable balance", description: "A little structure with breathing room.", icon: CalendarDays },
  { value: "full", label: "See as much as possible", description: "More choices for days that feel full.", icon: MapPin },
];

const questionLabels = ["People", "Length", "Interests", "Pace"];

export function DreamTripPage({ destinationSlug }: { destinationSlug?: DreamDestinationSlug }) {
  const params = useParams();
  const navigate = useNavigate();
  const config = getDreamDestination(destinationSlug ?? params.slug);
  const [view, setView] = useState<DreamView>("preview");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<DreamTripAnswers>(initialAnswers);
  const [hasCustomized, setHasCustomized] = useState(false);
  const [openDecision, setOpenDecision] = useState<DecisionPanel>(null);
  const preview = useMemo(() => config ? createDreamTrip(config.slug, answers) : null, [answers, config]);

  if (!config || !preview) return <DreamTripNotFound />;

  const setDecision = (panel: DecisionPanel) => {
    setOpenDecision((current) => current === panel ? null : panel);
  };

  const chooseGroup = (group: DreamGroup) => {
    setAnswers((current) => ({
      ...current,
      group,
      travelers: group === "solo" ? 1 : group === "couple" ? 2 : current.travelers < 3 ? 4 : current.travelers,
    }));
  };

  const continueQuestionnaire = () => {
    if (step === questionLabels.length - 1) {
      setView("preview");
      setHasCustomized(true);
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }
    setStep((current) => current + 1);
  };

  const goBack = () => {
    if (step === 0) {
      setView("preview");
      return;
    }
    setStep((current) => current - 1);
  };

  const startOver = () => {
    setStep(0);
    setView("questions");
    setOpenDecision(null);
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  };

  const handoffToInquiry = () => {
    const handoff = buildDreamTripHandoff(answers, preview, hasCustomized);
    try {
      window.sessionStorage.setItem("aerogo.dreamTripInquiry", JSON.stringify(handoff));
    } catch {
      // Private browsing modes can disable session storage; the inquiry remains available manually.
    }
    navigate("/#inquiry");
  };

  const changeDuration = (duration: DreamDuration) => {
    if (duration !== answers.duration) setHasCustomized(true);
    setAnswers((current) => ({ ...current, duration }));
  };

  const relaxTrip = () => {
    if (answers.pace !== "slow") setHasCustomized(true);
    setAnswers((current) => ({ ...current, pace: "slow" }));
  };

  return <div className="public-site dream-page">
    <SiteHeader />
    {view === "questions" && <DreamQuestionnaire config={config} answers={answers} step={step} onGroup={chooseGroup} onAnswers={setAnswers} onBack={goBack} onContinue={continueQuestionnaire} />}
    {view === "preview" && <DreamPreview config={config} answers={answers} preview={preview} personalized={hasCustomized} openDecision={openDecision} onDecision={setDecision} onCustomize={() => { setStep(0); setView("questions"); setOpenDecision(null); window.scrollTo({ top: 0, left: 0, behavior: "auto" }); }} onDuration={changeDuration} onRelax={relaxTrip} onChangeTrip={startOver} onHandoff={handoffToInquiry} />}
    <DreamFooter />
  </div>;
}

function DreamQuestionnaire({ config, answers, step, onGroup, onAnswers, onBack, onContinue }: {
  config: NonNullable<ReturnType<typeof getDreamDestination>>;
  answers: DreamTripAnswers;
  step: number;
  onGroup: (group: DreamGroup) => void;
  onAnswers: React.Dispatch<React.SetStateAction<DreamTripAnswers>>;
  onBack: () => void;
  onContinue: () => void;
}) {
  const canContinue = step !== 0 || answers.group !== "sample";
  const interestOptions = getInterestOptions(config.slug).map((option) => ({ ...option, icon: option.value === "food" ? Utensils : option.value === "nature" ? Mountain : option.value === "city" ? Building2 : Sparkles }));

  return <main className="dream-questionnaire" aria-labelledby="dream-question-title">
    <div className="page-shell dream-questionnaire__inner">
      <Link className="dream-back dream-back--dark" to={`/destinations/${config.slug}`}><ArrowLeft size={15} /> Back to {config.name}</Link>
      <div className="dream-progress" role="status" aria-live="polite">
        <span>QUESTION {String(step + 1).padStart(2, "0")} OF 04</span>
        <div className="dream-progress__track" aria-hidden="true">{questionLabels.map((label, index) => <span className={index <= step ? "is-active" : ""} key={label} />)}</div>
        <span>{questionLabels[step]}</span>
      </div>
      <section className="dream-question-card">
        {step === 0 && <GroupQuestion answers={answers} onGroup={onGroup} onTravelers={(travelers) => onAnswers((current) => ({ ...current, travelers }))} />}
        {step === 1 && <ChoiceQuestion<DreamDuration> title="How long would you like to stay?" description="Choose the amount of time that feels possible right now." options={durationOptions} value={answers.duration} onChange={(duration) => onAnswers((current) => ({ ...current, duration }))} />}
        {step === 2 && <ChoiceQuestion<DreamInterest> title="What sounds most like your kind of trip?" description="There is no wrong answer. This simply gives the journey a starting mood." options={interestOptions} value={answers.interest} onChange={(interest) => onAnswers((current) => ({ ...current, interest }))} />}
        {step === 3 && <ChoiceQuestion<DreamPace> title="How do you like to travel?" description="We will use this to shape how much each day tries to hold." options={paceOptions} value={answers.pace} onChange={(pace) => onAnswers((current) => ({ ...current, pace }))} />}
        <div className="dream-question-card__footer">
          <button className="dream-text-button" type="button" onClick={onBack}><ArrowLeft size={16} /> Back</button>
          <button className="button dream-button dream-button--forest" type="button" onClick={onContinue} disabled={!canContinue}>{step === 3 ? "Show my trip" : "Continue"} <ArrowRight size={17} /></button>
        </div>
      </section>
    </div>
  </main>;
}

function GroupQuestion({ answers, onGroup, onTravelers }: { answers: DreamTripAnswers; onGroup: (group: DreamGroup) => void; onTravelers: (travelers: number) => void }) {
  return <div>
    <span className="eyebrow">QUESTION 01</span>
    <h1 id="dream-question-title">Who's coming along?</h1>
    <p className="dream-question-card__description">Tell us who you imagine sharing these days with.</p>
    <div className="dream-choice-grid">{groupOptions.map(({ value, label, description, icon: Icon }) => <button className={`dream-choice ${answers.group === value ? "is-selected" : ""}`} type="button" aria-pressed={answers.group === value} key={value} onClick={() => onGroup(value)}><span className="dream-choice__icon"><Icon size={20} /></span><span><strong>{label}</strong><small>{description}</small></span>{answers.group === value && <Check className="dream-choice__check" size={17} />}</button>)}</div>
    {(answers.group === "family" || answers.group === "friends") && <label className="dream-travelers">How many travelers? <select value={answers.travelers} onChange={(event) => onTravelers(Number(event.target.value))}>{[3, 4, 5, 6, 7, 8].map((count) => <option value={count} key={count}>{count === 8 ? "8 or more" : count} travelers</option>)}</select></label>}
  </div>;
}

function ChoiceQuestion<T extends string | number>({ title, description, options, value, onChange }: { title: string; description: string; options: { value: T; label: string; description: string; icon?: typeof Users }[]; value: T; onChange: (value: T) => void }) {
  return <div>
    <span className="eyebrow">QUESTION</span>
    <h1 id="dream-question-title">{title}</h1>
    <p className="dream-question-card__description">{description}</p>
    <div className="dream-choice-grid">{options.map((option) => {
      const Icon = option.icon;
      return <button className={`dream-choice ${value === option.value ? "is-selected" : ""}`} type="button" aria-pressed={value === option.value} key={String(option.value)} onClick={() => onChange(option.value)}><span className="dream-choice__icon">{Icon ? <Icon size={20} /> : <CalendarDays size={20} />}</span><span><strong>{option.label}</strong><small>{option.description}</small></span>{value === option.value && <Check className="dream-choice__check" size={17} />}</button>;
    })}</div>
  </div>;
}

function DreamPreview({ config, answers, preview, personalized, openDecision, onDecision, onCustomize, onDuration, onRelax, onChangeTrip, onHandoff }: {
  config: NonNullable<ReturnType<typeof getDreamDestination>>;
  answers: DreamTripAnswers;
  preview: ReturnType<typeof createDreamTrip>;
  personalized: boolean;
  openDecision: DecisionPanel;
  onDecision: (panel: DecisionPanel) => void;
  onCustomize: () => void;
  onDuration: (duration: DreamDuration) => void;
  onRelax: () => void;
  onChangeTrip: () => void;
  onHandoff: () => void;
}) {
  const shorterDurations = durationOptions.filter((option) => option.value < answers.duration);
  const heroDay = preview.days[1] ?? preview.days[0];

  return <main className="dream-preview" aria-labelledby="dream-preview-title">
    <section className="dream-preview__hero">
      <img src={heroDay.image} alt={heroDay.imageAlt} fetchPriority="high" />
      <div className="dream-preview__hero-shade" />
      <div className="page-shell dream-preview__hero-inner">
        <div className="dream-preview__hero-top"><Link className="dream-back" to={`/destinations/${config.slug}`}><ArrowLeft size={15} /> {config.name} inspiration</Link><button className="dream-outline-button" type="button" onClick={onChangeTrip}><span>Change my trip</span><ArrowRight size={15} /></button></div>
        <div className="dream-preview__hero-copy"><span className="eyebrow eyebrow--light"><span className="eyebrow-mark" /> DREAM TRIP PREVIEW{personalized ? "" : " · SAMPLE"}</span><h1 id="dream-preview-title">{preview.title}</h1><p>{preview.subtitle}</p></div>
      </div>
    </section>

    <section className="dream-duration-picker page-shell" aria-labelledby="dream-duration-title">
      <div className="dream-duration-picker__intro"><span className="eyebrow">SHAPE THE LENGTH</span><h2 id="dream-duration-title">How long could you stay?</h2><p>{getDurationLabel(answers.duration)} · The first and last days leave room for the journey.</p></div>
      <div className="dream-duration-options" role="group" aria-label={`Choose ${config.name} trip duration`}>{durationOptions.map((option) => <button className={`dream-duration-option ${answers.duration === option.value ? "is-selected" : ""}`} key={option.value} type="button" aria-pressed={answers.duration === option.value} onClick={() => onDuration(option.value)}><strong>{option.shortLabel}</strong><span>{option.label}</span></button>)}</div>
    </section>

    <section className="dream-preview__summary page-shell">
      <div className="dream-preview__summary-copy"><span className="eyebrow">A STARTING POINT FOR YOUR IMAGINATION</span><p>{preview.intro}</p><p className="dream-preview__honesty">This is an illustrative itinerary, not a confirmed booking. Routes, activities, availability and prices can be refined with AeroGo.</p></div>
      <div className="dream-facts" aria-label={personalized ? "Your selected trip details" : "Sample trip details"}><span><Users size={16} /> {preview.groupLabel}</span><span><CalendarDays size={16} /> {preview.durationLabel}</span><span><Sparkles size={16} /> {preview.interestLabel}</span><span><Gauge size={16} /> {preview.paceLabel}</span></div>
    </section>

    <section className="dream-stay-guide page-shell" aria-labelledby="dream-stay-title">
      <div className="dream-stay-guide__heading"><span className="eyebrow">AREAS TO CONSIDER</span><h2 id="dream-stay-title">Where might you stay?</h2><p>Neighborhoods and areas are starting points, not confirmed accommodation.</p></div>
      <div className="dream-stay-guide__list">{getStayAreas(config.slug).map((area) => <article className="dream-stay-area" key={area.name}><strong>{area.name}</strong><p>{area.description}</p><span>Accommodation option to consider</span></article>)}</div>
    </section>

    <section className="dream-customize-callout page-shell" aria-labelledby="dream-customize-title"><div><span className="eyebrow">MAKE IT YOURS</span><h2 id="dream-customize-title">Love the idea? Make it yours.</h2><p>{personalized ? "Your choices are shaping this version. You can change them whenever you like." : `Answer four quick questions to shape this ${config.name} sample around your people, pace and interests.`}</p></div><button className="button dream-button dream-button--forest" type="button" onClick={onCustomize}>Make this trip yours <ArrowRight size={17} /></button></section>

    <section className="dream-itinerary" aria-labelledby="dream-itinerary-title">
      <div className="page-shell"><div className="dream-section-heading"><div><span className="eyebrow">A LOOSE STARTING POINT</span><h2 id="dream-itinerary-title">A trip could look like…</h2></div><p>{preview.routeLabel}.</p></div><div className="dream-days">{preview.days.map((day) => <article className="dream-day" key={`${day.day}-${day.title}`}><div className="dream-day__image-wrap"><img src={day.image} alt={day.imageAlt} loading="lazy" decoding="async" /></div><div className="dream-day__body"><span className="dream-day__number">DAY {String(day.day).padStart(2, "0")}</span><span className="dream-day__location"><MapPin size={14} /> {day.location}</span><h3>{day.title}</h3><p>{day.overview}</p><ul>{day.experiences.map((experience) => <li key={experience}><Check size={14} /> {experience}</li>)}</ul>{day.practicalNote && <p className="dream-day__note"><WalletCards size={14} /> {day.practicalNote}</p>}</div></article>)}</div></div>
    </section>

    <section className="dream-decide page-shell" aria-labelledby="dream-decide-title"><div className="dream-section-heading"><div><span className="eyebrow">HELP ME DECIDE</span><h2 id="dream-decide-title">Still thinking about {config.name}?</h2></div><p>Here are a few things worth exploring before you decide.</p></div><div className="dream-decision-grid">
      <DecisionCard title="What could this trip cost?" description="A transparent way to think about the pieces." icon={<WalletCards size={21} />} open={openDecision === "budget"} onClick={() => onDecision("budget")}><div className="dream-decision-panel"><p>{getBudgetGuidance(config.slug)} Actual costs require dates, departure city, availability and live quotations.</p><ul><li><strong>Airfare</strong><span>Consider the route, season and flexibility together.</span></li><li><strong>Accommodation</strong><span>Choose a base and comfort level that fits your pace.</span></li><li><strong>Transport</strong><span>Include local travel and any regional journey between bases.</span></li><li><strong>Food and activities</strong><span>Leave room for planned highlights and small discoveries.</span></li></ul><p className="dream-decision-panel__tip">AeroGo can help compare the live options later. This framework is not a quotation.</p></div></DecisionCard>
      <DecisionCard title="Would my travel group enjoy it?" description="See how the rhythm can work for your group." icon={<Users size={21} />} open={openDecision === "family"} onClick={() => onDecision("family")}><div className="dream-decision-panel"><p>{config.name} can offer a rewarding mix of local food, culture and scenery. {getGroupNote(config.slug, answers.group)}</p><p>Think about ages, interests and mobility needs before choosing longer walking days, heat-sensitive activities or more frequent region changes.</p></div></DecisionCard>
      <DecisionCard title="What if we had fewer days?" description="Try a focused version without squeezing everything in." icon={<CalendarDays size={21} />} open={openDecision === "shorter"} onClick={() => onDecision("shorter")}><div className="dream-decision-panel"><p>Shorter trips stay focused on the places that fit, rather than trying to cross an entire country.</p>{shorterDurations.length > 0 ? <div className="dream-decision-actions">{shorterDurations.map((option) => <button type="button" className="dream-small-button" key={option.value} onClick={() => onDuration(option.value)}>{option.shortLabel} <ArrowRight size={14} /></button>)}</div> : <p className="dream-decision-panel__muted">{durationOptions[0].label} is the shortest sample.</p>}</div></DecisionCard>
      <DecisionCard title="Could we travel at a slower pace?" description="Make space for rest, wandering and the in-between moments." icon={<Gauge size={21} />} open={openDecision === "slower"} onClick={() => onDecision("slower")}><div className="dream-decision-panel"><p>A slower version keeps fewer anchors in each day and protects time to pause. It is a change in rhythm, not a smaller experience.</p><button type="button" className="dream-small-button" onClick={onRelax} disabled={answers.pace === "slow"}>{answers.pace === "slow" ? "Already travelling slowly" : "Make it slower"} <ArrowRight size={14} /></button></div></DecisionCard>
    </div></section>

    <section className="dream-final-cta"><div className="page-shell dream-final-cta__inner"><span className="eyebrow eyebrow--light">WHENEVER YOU’RE READY</span><h2>Ready to explore making this trip real?</h2><p>AeroGo can help you compare the available options, refine your itinerary and organize the details.</p><button className="button dream-button dream-button--coral" type="button" onClick={onHandoff}>Plan this trip with AeroGo <ArrowUpRight size={17} /></button><span className="dream-final-cta__note">{personalized ? "Your choices will be carried into the inquiry form for you to review." : "The sample destination and summary will be carried into the inquiry form for you to review."}</span></div></section>
  </main>;
}

function DecisionCard({ title, description, icon, open, onClick, children }: { title: string; description: string; icon: React.ReactNode; open: boolean; onClick: () => void; children: React.ReactNode }) {
  return <article className={`dream-decision ${open ? "is-open" : ""}`}><button className="dream-decision__toggle" type="button" aria-expanded={open} onClick={onClick}><span className="dream-decision__icon">{icon}</span><span><strong>{title}</strong><small>{description}</small></span><ArrowRight className="dream-decision__arrow" size={17} /></button>{open && children}</article>;
}

function DreamFooter() {
  return <footer className="site-footer"><div className="page-shell site-footer__inner"><Brand light /><span>Thoughtful travel planning, made simpler.</span><span className="site-footer__domain">aerogotours.com</span><span className="site-footer__legal">© 2026 AeroGo Travel &amp; Tours · Dream Trip Preview</span></div></footer>;
}

export function DreamTripNotFound() {
  return <div className="public-site dream-page"><SiteHeader /><main className="dream-not-found page-shell"><span className="eyebrow">A LITTLE DETOUR</span><h1>That Dream Trip is not ready yet.</h1><p>Japan, Thailand and South Korea are the first places to imagine. More journeys will follow.</p><Link className="text-link" to="/">Back to AeroGo <ArrowRight size={15} /></Link></main><DreamFooter /></div>;
}
