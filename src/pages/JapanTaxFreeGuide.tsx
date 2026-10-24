import { ArrowUpRight, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { EditorialBreadcrumb } from "../components/EditorialBreadcrumb";
import { EditorialFooter } from "../components/EditorialFooter";
import { SiteHeader } from "../components/SiteHeader";
import "./JapanTaxFreeGuide.css";

const sources = [
  { label: "Japan Tourism Agency — traveler guide to the refund method", url: "https://www.mlit.go.jp/kankocho/tax-free/page01_000001_00028.html" },
  { label: "Japan Tourism Agency — traveler frequently asked questions", url: "https://www.mlit.go.jp/kankocho/tax-free/page01_000001_00027.html" },
  { label: "Japan Customs — refund procedure overview", url: "https://www.customs.go.jp/kaigairyoko/taxrefund.htm" },
  { label: "Japan Customs — departure procedure details", url: "https://www.customs.go.jp/kaigairyoko/tetsuzukishousai_e.html" },
  { label: "Japan Tourism Agency — eligible purchaser documents (PDF)", url: "https://www.mlit.go.jp/kankocho/tax-free/content/001990235.pdf" },
  { label: "Embassy of Japan in the Philippines — October notice", url: "https://www.ph.emb-japan.go.jp/itpr_ja/11_000001_02363.html" },
];

export function JapanTaxFreeGuide() {
  return <div className="public-site japan-refund-site editorial-foundation">
    <SiteHeader />
    <main className="japan-refund page-shell">
      <EditorialBreadcrumb items={[
        { label: "Discover", to: "/" },
        { label: "Guides", to: "/guides" },
        { label: "Japan", to: "/destinations/japan" },
        { label: "Tax-free shopping changes" },
      ]} />
      <article>
        <header className="japan-refund__hero">
          <div className="japan-refund__hero-copy">
            <p className="japan-refund__eyebrow">PRACTICAL GUIDE / JAPAN</p>
            <h1>Japan's tax-free shopping changes <span>November 1</span></h1>
            <p className="japan-refund__standfirst">For eligible visitors, purchases made on or after <strong>November 1, 2026</strong> move to a refund system: you pay the full tax-inclusive price at the shop, complete customs confirmation when leaving Japan, then receive the eligible refund through the shop or its provider. <strong>Do the customs step before checking in your bags.</strong></p>
            <p className="japan-refund__dateline">AeroGo visitor guide <span aria-hidden="true">·</span> <time dateTime="2026-10-24">Official sources checked 24 October 2026</time></p>
            <a className="japan-refund__jump" href="#steps">Jump to the 3-step checklist ↓</a>
          </div>
          <div className="japan-refund__visual" role="img" aria-label="From 1 November 2026, eligible shoppers pay tax at the shop, confirm exports at Japan Customs, then receive the refund through the shop or refund provider">
            <p>JAPAN / REFUND METHOD</p>
            <strong>01 <small>NOV</small></strong>
            <ol><li><b>SHOP</b><span>Pay tax-inclusive price</span></li><li><b>CUSTOMS</b><span>Show goods before bag check-in</span></li><li><b>REFUND</b><span>Shop or provider refunds</span></li></ol>
            <span className="japan-refund__visual-note">Effective for purchases from 1 November 2026</span>
          </div>
        </header>

        <section id="steps" className="japan-refund__steps" aria-labelledby="japan-refund-steps-title">
          <div className="japan-refund__section-heading"><span>YOUR QUICK CHECKLIST</span><h2 id="japan-refund-steps-title">Three steps to remember</h2></div>
          <div className="japan-refund__cards">
            <div><span>01 / IN THE SHOP</span><h3>Pay first</h3><p>At a participating tax-free shop, show the documents needed to establish eligibility, including your passport. Pay the tax-inclusive price and ask how that shop registers and sends refunds.</p></div>
            <div><span>02 / BEFORE DEPARTURE</span><h3>Visit Customs</h3><p>Bring your passport and all the tax-free purchases. Complete customs confirmation at your airport or seaport of final departure from Japan, <strong>before checking in your luggage</strong> and within 90 days of purchase.</p></div>
            <div><span>03 / AFTER CONFIRMATION</span><h3>Receive the refund</h3><p>The tax-free shop or its appointed refund provider handles the refund after confirmation. The method and timing depend on the shop. The airport does not automatically hand every traveler a cash refund.</p></div>
          </div>
        </section>

        <div className="japan-refund__layout">
          <div className="japan-refund__prose">
            <section aria-labelledby="japan-refund-before-title">
              <h2 id="japan-refund-before-title">Before November 1 versus after</h2>
              <div className="japan-refund__comparison">
                <div><b>Until October 31, 2026</b><p>For qualifying transactions, the existing system lets eligible visitors shop at tax-free prices at participating stores.</p></div>
                <div><b>From November 1, 2026</b><p>For new qualifying purchases, you pay the tax-inclusive price first. Customs confirms that you are taking the goods out of Japan; the shop or provider then refunds the applicable consumption-tax amount.</p></div>
              </div>
              <p><strong>If your trip crosses November 1:</strong> the purchase date matters. A purchase made on October 31 is not automatically moved to the new refund method because your flight home is in November. Ask the retailer which procedure applies to each transaction.</p>
            </section>

            <section aria-labelledby="japan-refund-airport-title">
              <h2 id="japan-refund-airport-title">What to do at the airport</h2>
              <ol>
                <li><strong>Before airline baggage check-in,</strong> find the tax-free procedure terminal in the international departure lobby. Keep all your qualifying purchased items accessible, even those you plan to place in checked bags.</li>
                <li><strong>Present your passport.</strong> A green result means the customs confirmation step is complete. A red result means you must bring the goods to the designated customs inspection area.</li>
                <li><strong>Keep time for inspection.</strong> Once your bag is checked in, it cannot be retrieved just to complete this procedure. If you connect from a Japanese domestic flight to an international flight, complete the procedure at the airport where you finally leave Japan.</li>
              </ol>
              <p>Japan Customs also permits the procedure through Visit Japan Web in designated departure-lobby areas at <strong>Narita, Haneda, Kansai, Chubu, Fukuoka, New Chitose and Naha</strong> airports using the special on-site Wi-Fi network. If you cannot use that option, use the terminal. It is not a universal anywhere-on-your-phone service.</p>
            </section>

            <section aria-labelledby="japan-refund-eligibility-title">
              <h2 id="japan-refund-eligibility-title">Who and what can qualify?</h2>
              <p>Eligibility depends on your status in Japan and the shop's verification, <strong>not simply on holding a Philippine passport</strong>. Non-resident visitors with qualifying immigration status, such as Temporary Visitor, can be eligible. Bring your passport and ask the tax-free shop to confirm the necessary documentation.</p>
              <p>From November 1, qualifying goods must total at least <strong>¥5,000 before tax per shop, per day</strong>. You must take the goods out of Japan yourself and be able to present them at departure. The new rules remove special sealed packaging for consumables, but this does <strong>not</strong> mean you can eat, drink or use up those consumables in Japan and still receive the refund.</p>
              <p><strong>Important receipt rule:</strong> customs examines purchases by transaction. If even one item on a particular tax-free purchase record is missing when you depart, none of the goods on that record qualify for the refund. If you consumed some of the items, tell a customs officer instead of submitting that transaction at the kiosk.</p>
            </section>

            <section aria-labelledby="japan-refund-examples-title">
              <h2 id="japan-refund-examples-title">Common travel situations</h2>
              <div className="japan-refund__examples">
                <div><h3>“I bought skincare on November 3 but used some in Osaka.”</h3><p>The used consumables may make the entire purchase record ineligible. Tell the customs officer; do not assume the unused items on the same receipt will still qualify.</p></div>
                <div><h3>“My return flight leaves from Tokyo, after a domestic flight.”</h3><p>Complete customs confirmation at the airport from which you fly out of Japan, not at the domestic starting airport.</p></div>
                <div><h3>“Will I get the refund at the airport?”</h3><p>Customs verifies the goods. The shop or its provider issues the refund using its stated method. Check fees, registration, and timing with the retailer before buying.</p></div>
              </div>
            </section>
          </div>
          <aside className="japan-refund__aside" aria-label="Essential refund facts">
            <span>AT A GLANCE</span><h2>Keep your purchases with you</h2>
            <p><strong>November 1</strong> — New system begins for purchases.</p>
            <p><strong>¥5,000</strong> — Minimum qualifying purchase before tax, per store per day.</p>
            <p><strong>90 days</strong> — Customs confirmation window from purchase.</p>
            <p><strong>Before baggage check-in</strong> — Complete customs confirmation while goods are accessible.</p>
            <a href="https://www.customs.go.jp/kaigairyoko/taxrefund.htm" target="_blank" rel="noopener noreferrer">Japan Customs instructions <ArrowUpRight size={16} aria-hidden="true" /></a>
          </aside>
        </div>

        <section className="japan-refund__sources" aria-labelledby="japan-refund-sources-title">
          <span>ORIGINAL SOURCES</span><h2 id="japan-refund-sources-title">Official guidance and verification</h2>
          <p>These are Japan's published instructions for the change scheduled for November 1, 2026. Rules and shop procedures may be updated; check the official pages and your tax-free retailer before travel.</p>
          <ul>{sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label} <ExternalLink size={15} aria-hidden="true" /></a></li>)}</ul>
          <p className="japan-refund__source-date">Sources checked 24 October 2026 · This guide provides general visitor information, not individualized tax advice.</p>
        </section>
        <nav className="japan-refund__related" aria-label="Continue discovering"><Link to="/destinations/japan">Explore Japan <ArrowUpRight size={18} aria-hidden="true" /></Link><Link to="/guides">All travel guides <ArrowUpRight size={18} aria-hidden="true" /></Link></nav>
      </article>
    </main>
    <EditorialFooter editorial />
  </div>;
}
