import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  DEFAULT_PREFERENCES, OFFICIAL, PREP_ITEMS, REVIEWED_ON,
  type DayCount, type Group, type Interest, type Mobility, type Pace, type Preferences,
  type ItineraryDay
} from './catalog.ts';
import { decodeShare, encodeShare, makeItinerary, sanitizePreferences, STORAGE_KEY, toSafeInt, validChecks } from './planner.ts';

type StoredState = { preferences: Preferences; checks: string[] };
const labels: Record<Interest, string> = {
  gardens: 'Gardens & nature', culture: 'Arts & culture', food: 'Local food', skyline: 'City views'
};
const interests: Interest[] = ['gardens', 'culture', 'food', 'skyline'];

function load(): { preferences: Preferences; checks: string[]; shared: boolean } {
  if (typeof window === 'undefined') return { preferences: DEFAULT_PREFERENCES, checks: [], shared: false };
  const fromLink = decodeShare(new URLSearchParams(window.location.search).get('plan'));
  if (fromLink) return { preferences: fromLink, checks: [], shared: true };
  try {
    const stored: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}');
    if (stored && typeof stored === 'object') {
      const s = stored as Partial<StoredState>;
      return { preferences: sanitizePreferences(s.preferences), checks: validChecks(s.checks), shared: false };
    }
  } catch { /* private browsing or malformed storage: use defaults */ }
  return { preferences: DEFAULT_PREFERENCES, checks: [], shared: false };
}

function Mark({ children }: { children: ReactNode }) {
  return <span className="agp-mark" aria-hidden="true">{children}</span>;
}

function Chip({ children }: { children: ReactNode }) {
  return <span className="agp-chip">{children}</span>;
}

function Feature({ icon, title, children }: { icon: string; title: string; children: ReactNode }) {
  return <div className="agp-feature"><Mark>{icon}</Mark><div><strong>{title}</strong><p>{children}</p></div></div>;
}

function DayCard({ day, index, minimal }: { day: ItineraryDay; index: number; minimal: boolean }) {
  return <article className="agp-day" aria-label={`Day ${index + 1}: ${day.title}`}>
    <div className="agp-dayhead">
      <span className="agp-daynumber">Day {index + 1}</span>
      <div><p className="agp-eyebrow">{day.eyebrow}</p><h3>{day.title}</h3><p>{day.intro}</p></div>
    </div>
    <div className="agp-visits">
      {day.visits.map((visit, i) => <div className={`agp-visit ${visit.optional ? 'agp-optional' : ''}`} key={`${day.key}-${i}`}>
        <span className="agp-time">{visit.at}</span>
        <div><div className="agp-visit-title">{visit.title} {visit.optional && <span className="agp-optionallabel">Optional</span>}</div>
          <p>{visit.detail}</p>
          <div className="agp-links">
            {visit.place && <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(visit.place)}`} target="_blank" rel="noopener noreferrer">Find on map ↗</a>}
            {visit.official && <a href={visit.official} target="_blank" rel="noopener noreferrer">Official information ↗</a>}
          </div>
        </div>
      </div>)}
    </div>
    <div className="agp-daytip"><strong>AeroGo tip</strong><p>{day.tip}</p></div>
    {minimal && index > 0 && index < 4 && <p className="agp-slow-note">Comfort first: it's fine to skip a stop, use a taxi, or shorten a visit. Routes and walking distances need checking once your hotel is selected.</p>}
  </article>;
}

export function TripPlanner() {
  const [initial] = useState(load);
  const [preferences, setPreferences] = useState<Preferences>(initial.preferences);
  const [checks, setChecks] = useState<string[]>(initial.checks);
  const [showPlan, setShowPlan] = useState(initial.shared);
  const [shareUrl, setShareUrl] = useState('');
  const [feedback, setFeedback] = useState('');
  const days = useMemo(() => makeItinerary(preferences), [preferences]);
  const count = toSafeInt(checks.length, 0, PREP_ITEMS.length);
  const progress = Math.round((count / PREP_ITEMS.length) * 100);

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ preferences, checks } satisfies StoredState)); }
    catch { /* storage might be blocked: planner still functions */ }
  }, [preferences, checks]);

  const update = <K extends keyof Preferences>(key: K, value: Preferences[K]) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    setShareUrl(''); setFeedback('');
  };

  const toggleInterest = (interest: Interest) => {
    update('interests', preferences.interests.includes(interest)
      ? preferences.interests.filter(item => item !== interest)
      : [...preferences.interests, interest]);
  };

  const handleGenerate = () => {
    setShowPlan(true);
    setFeedback('Your Singapore plan is ready. You can adjust your answers whenever you like.');
    requestAnimationFrame(() => document.getElementById('agp-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  const handleShare = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set('plan', encodeShare(preferences));
    url.hash = 'agp-result';
    const value = url.toString();
    setShareUrl(value);
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(value);
      setFeedback('Share link copied. It includes your trip preferences, not your checklist progress.');
    } catch {
      setFeedback('Your shareable link is ready below. Select and copy it to send to someone.');
    }
  };

  const reset = () => {
    setPreferences({ ...DEFAULT_PREFERENCES, interests: [...DEFAULT_PREFERENCES.interests] });
    setChecks([]); setShowPlan(false); setShareUrl(''); setFeedback('Your selections were reset.');
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('plan'); url.hash = '';
      window.history.replaceState(null, '', url.toString());
    } catch { /* ignore unusual URL contexts */ }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return <main className="agp" id="agp-top">
    <div className="agp-topline"><div className="agp-wrap agp-topinner"><span className="agp-wordmark">AEROGO<span className="agp-coral">.</span></span><span>TRIP PLANNER</span><span className="agp-free">Free · No sign-up</span></div></div>
    <section className="agp-hero">
      <div className="agp-wrap agp-hero-grid">
        <div className="agp-hero-copy"><p className="agp-hero-label">YOUR TRAVEL COMPANION, BEFORE YOU GO</p>
          <h1>Your trip,<br/><em>made simple.</em></h1>
          <p className="agp-hero-lede">Wonderful days don't have to be busy days. Make a Singapore itinerary that fits your pace, your interests, and the people you're traveling with.</p>
          <a className="agp-hero-cta" href="#agp-questions">Let's plan your trip <span aria-hidden="true">↗</span></a>
          <p className="agp-hero-fine">No account. No cost. Just a simpler way to plan.</p>
        </div>
        <div className="agp-illustration" aria-label="Illustrated Singapore skyline and warm evening sky" role="img">
          <div className="agp-orbit"/><div className="agp-sun"/>
          <div className="agp-building b1"/><div className="agp-building b2"/><div className="agp-building b3"/>
          <div className="agp-skybridge"/><div className="agp-tower t1"/><div className="agp-tower t2"/>
          <div className="agp-water"/>
          <div className="agp-hero-caption"><span>SINGAPORE</span><strong>Slow days. Lasting memories.</strong></div>
        </div>
      </div>
    </section>

    <section className="agp-intro agp-wrap" aria-label="How it works">
      <Feature icon="01" title="A few easy questions">Tell us how you'd like to travel.</Feature>
      <Feature icon="02" title="A plan at your pace">See a thoughtful, flexible itinerary.</Feature>
      <Feature icon="03" title="Ready for the journey">Check what to prepare and share your plan.</Feature>
    </section>

    <section id="agp-questions" className="agp-section agp-wrap" aria-labelledby="agp-form-title">
      <div className="agp-sectionheading"><div><p className="agp-eyebrow">LET'S BEGIN</p><h2 id="agp-form-title">A trip that feels like yours.</h2></div><p>Start with Singapore. More destinations can come later.</p></div>
      <div className="agp-form">
        <div className="agp-formbody">
          <fieldset className="agp-field"><legend><span className="agp-fieldnum">1</span> Where would you like to go?</legend>
            <div className="agp-destination"><span className="agp-destination-flag" aria-hidden="true">✦</span><div><strong>Singapore</strong><span>Our first carefully curated destination</span></div><span aria-hidden="true">✓</span></div>
          </fieldset>
          <fieldset className="agp-field"><legend><span className="agp-fieldnum">2</span> How long is your trip?</legend>
            <div className="agp-choice-row">{([3, 4, 5] as DayCount[]).map(day => <button type="button" key={day} className={`agp-choice ${preferences.days === day ? 'is-selected' : ''}`} onClick={() => update('days', day)} aria-pressed={preferences.days === day}>{day} days<span>{day - 1} nights</span></button>)}</div>
          </fieldset>
          <fieldset className="agp-field"><legend><span className="agp-fieldnum">3</span> Who's coming with you?</legend>
            <div className="agp-choice-grid">{([['couple', 'My spouse or partner'], ['solo', 'Just me'], ['family', 'Family'], ['friends', 'Friends']] as [Group, string][]).map(([key, label]) => <button type="button" key={key} className={`agp-choice ${preferences.group === key ? 'is-selected' : ''}`} onClick={() => update('group', key)} aria-pressed={preferences.group === key}>{label}</button>)}</div>
          </fieldset>
          <fieldset className="agp-field"><legend><span className="agp-fieldnum">4</span> What feels like a good pace?</legend>
            <div className="agp-choice-grid">{([['relaxed', 'Relaxed, with lots of breaks'], ['balanced', 'A bit more sightseeing']] as [Pace, string][]).map(([key, label]) => <button type="button" key={key} className={`agp-choice ${preferences.pace === key ? 'is-selected' : ''}`} onClick={() => update('pace', key)} aria-pressed={preferences.pace === key}>{label}</button>)}</div>
          </fieldset>
          <fieldset className="agp-field"><legend><span className="agp-fieldnum">5</span> How much walking feels comfortable?</legend>
            <div className="agp-choice-grid">{([['minimal', 'As little as possible'], ['some', 'Short walks are okay']] as [Mobility, string][]).map(([key, label]) => <button type="button" key={key} className={`agp-choice ${preferences.mobility === key ? 'is-selected' : ''}`} onClick={() => update('mobility', key)} aria-pressed={preferences.mobility === key}>{label}</button>)}</div>
          </fieldset>
          <fieldset className="agp-field"><legend><span className="agp-fieldnum">6</span> What would you enjoy? <span className="agp-soft">Pick any</span></legend>
            <div className="agp-choice-grid">{interests.map(item => <label key={item} className={`agp-choice agp-checkbox ${preferences.interests.includes(item) ? 'is-selected' : ''}`}><input type="checkbox" checked={preferences.interests.includes(item)} onChange={() => toggleInterest(item)}/><span className="agp-smallcheck" aria-hidden="true">{preferences.interests.includes(item) ? '✓' : ''}</span>{labels[item]}</label>)}</div>
          </fieldset>
        </div>
        <div className="agp-submitbox"><p>There's no perfect way to travel. We'll leave room for breaks and changes of plan.</p><button className="agp-primary" type="button" onClick={handleGenerate}>Create my free trip plan <span aria-hidden="true">→</span></button></div>
      </div>
    </section>

    {showPlan && <section id="agp-result" className="agp-result agp-wrap" aria-labelledby="agp-result-title">
      <div className="agp-resulthead"><div><p className="agp-eyebrow">YOUR PERSONALIZED SAMPLE</p><h2 id="agp-result-title">Singapore, at your own pace.</h2><p>We've planned the highlights without the pressure to do everything.</p></div><div className="agp-stamp">Made with care<br/><strong>by AeroGo</strong></div></div>
      <div className="agp-summary"><Chip>{preferences.days} days / {preferences.days - 1} nights</Chip><Chip>{preferences.group === 'couple' ? 'With your partner' : preferences.group === 'solo' ? 'Solo trip' : `With ${preferences.group}`}</Chip><Chip>{preferences.pace === 'relaxed' ? 'Relaxed pace' : 'Balanced pace'}</Chip><Chip>{preferences.mobility === 'minimal' ? 'Minimal walking preferred' : 'Short walks okay'}</Chip></div>
      <div className="agp-message"><Mark>♥</Mark><p><strong>Gentle reminder:</strong> this is a suggested plan, not a booking or live route calculation. We haven't asked for your actual flights or hotel yet. Activities on arrival/departure days depend on your schedule, and timings can change.</p></div>
      <div className="agp-days">{days.map((day, index) => <DayCard key={day.key} day={day} index={index} minimal={preferences.mobility === 'minimal'}/>)}</div>
      <div className="agp-panel agp-transit"><div><p className="agp-eyebrow">GETTING AROUND</p><h3>Less confusion. More enjoying.</h3></div>
        <div className="agp-transit-grid">
          <Feature icon="↗" title="MRT and public buses">A supported contactless card can be convenient. Foreign-issued Mastercard/Visa cards have a S$0.60 administrative fee per day of use. <a href={OFFICIAL.simplygo} target="_blank" rel="noopener noreferrer">SimplyGo details ↗</a></Feature>
          <Feature icon="→" title="Taxis or ride-hailing">A good option with luggage, hot weather, or when the distance from the station is too far. Actual cost varies.</Feature>
          <Feature icon="✓" title="Keep one base">A conveniently located hotel near City Hall or Bugis can reduce unnecessary journeys. Check lift access and walking distances before booking.</Feature>
        </div>
      </div>
      <div className="agp-panel agp-checklist"><div className="agp-checklist-head"><div><p className="agp-eyebrow">BEFORE YOU FLY</p><h3>Travel-ready checklist.</h3><p>Tick each item as you prepare. Your progress stays on this device.</p></div><div className="agp-progresslabel">{count} of {PREP_ITEMS.length} done</div></div>
        <div className="agp-progress" role="progressbar" aria-label="Checklist progress" aria-valuemin={0} aria-valuemax={PREP_ITEMS.length} aria-valuenow={count}><div style={{width: `${Number.isFinite(progress) ? progress : 0}%`}}/></div>
        <div className="agp-checkitems">{PREP_ITEMS.map(item => <label className={`agp-checkitem ${checks.includes(item.id) ? 'is-checked' : ''}`} key={item.id}><input type="checkbox" checked={checks.includes(item.id)} onChange={event => setChecks(old => event.target.checked ? [...old, item.id] : old.filter(x => x !== item.id))}/><span><strong>{item.title}</strong><small>{item.note} {item.href && <a href={item.href} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>Official source ↗</a>}</small></span></label>)}</div>
        <div className="agp-safety"><strong>Entry information is important.</strong> Your nationality, travel documents, health status and travel dates affect what you need. The SG Arrival Card is free and is not a visa. Always check <a href={OFFICIAL.ica} target="_blank" rel="noopener noreferrer">Singapore ICA</a> before departure.</div>
      </div>
      <div className="agp-actions"><button className="agp-primary" type="button" onClick={() => window.print()}>Print or save as PDF ↗</button><button type="button" className="agp-outline" onClick={handleShare}>Copy a shareable plan link</button><button type="button" className="agp-linkbutton" onClick={() => document.getElementById('agp-questions')?.scrollIntoView({behavior:'smooth'})}>Change my answers</button></div>
      {feedback && <p className="agp-feedback" role="status">{feedback}</p>}
      {shareUrl && <div className="agp-share"><label htmlFor="agp-share-url">Your shareable link (includes preferences only):</label><input id="agp-share-url" value={shareUrl} readOnly onFocus={e => e.currentTarget.select()}/></div>}
      <div className="agp-source"><strong>Official information reviewed {REVIEWED_ON}.</strong> Sources: <a href={OFFICIAL.ica} target="_blank" rel="noopener noreferrer">ICA</a>, <a href={OFFICIAL.gardens} target="_blank" rel="noopener noreferrer">Gardens by the Bay</a>, <a href={OFFICIAL.simplygo} target="_blank" rel="noopener noreferrer">SimplyGo</a>, <a href={OFFICIAL.jewel} target="_blank" rel="noopener noreferrer">Jewel Changi</a>. This guide is illustrative, not legal or immigration advice. Recheck facts before a real trip.</div>
    </section>}
    <footer className="agp-footer"><div className="agp-wrap agp-footercontent"><div><strong>AEROGO<span className="agp-coral">.</span></strong><p>Travel feels better when someone makes it simpler.</p></div><div className="agp-footer-actions"><a href="#agp-top">Back to top ↑</a><button type="button" onClick={reset}>Start a new plan</button></div></div><div className="agp-wrap agp-footnote">Singapore is the first curated destination in this local-only proof of concept. No booking, live map data, external AI, or payment service is used.</div></footer>
  </main>;
}
