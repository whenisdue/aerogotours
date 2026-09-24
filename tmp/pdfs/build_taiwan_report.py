from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, Table, TableStyle,
    PageBreak, Image, KeepTogether, HRFlowable, ListFlowable, ListItem,
)
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfgen.canvas import Canvas
import os


ROOT = "/Users/esguerra/Desktop/aerogotours"
OUT = os.path.join(ROOT, "output", "pdf")
EVIDENCE = os.path.join(ROOT, "tmp", "pdfs", "evidence")
os.makedirs(OUT, exist_ok=True)

PDF_PATH = os.path.join(OUT, "aerogo_taiwan_competitor_package_sourcing.pdf")

PAGE_W, PAGE_H = A4
MARGIN = 16 * mm
CONTENT_W = PAGE_W - 2 * MARGIN

NAVY = colors.HexColor("#12355B")
BLUE = colors.HexColor("#1F6F8B")
TEAL = colors.HexColor("#2A9D8F")
GOLD = colors.HexColor("#D9A441")
PALE_BLUE = colors.HexColor("#EAF4F8")
PALE_GOLD = colors.HexColor("#FFF6DE")
PALE_GREEN = colors.HexColor("#EAF7F1")
INK = colors.HexColor("#1D2833")
MUTED = colors.HexColor("#5E6B76")
LINE = colors.HexColor("#D6DEE5")
WHITE = colors.white


styles = getSampleStyleSheet()
styles.add(ParagraphStyle(
    name="CoverTitle", parent=styles["Title"], fontName="Helvetica-Bold", fontSize=25,
    leading=30, textColor=NAVY, alignment=TA_LEFT, spaceAfter=8,
))
styles.add(ParagraphStyle(
    name="CoverSub", parent=styles["Normal"], fontName="Helvetica", fontSize=11,
    leading=16, textColor=MUTED, spaceAfter=4,
))
styles.add(ParagraphStyle(
    name="H1x", parent=styles["Heading1"], fontName="Helvetica-Bold", fontSize=17,
    leading=21, textColor=NAVY, spaceBefore=8, spaceAfter=8,
))
styles.add(ParagraphStyle(
    name="H2x", parent=styles["Heading2"], fontName="Helvetica-Bold", fontSize=11,
    leading=14, textColor=BLUE, spaceBefore=7, spaceAfter=4,
))
styles.add(ParagraphStyle(
    name="Bodyx", parent=styles["BodyText"], fontName="Helvetica", fontSize=8.8,
    leading=12.2, textColor=INK, spaceAfter=5,
))
styles.add(ParagraphStyle(
    name="Smallx", parent=styles["BodyText"], fontName="Helvetica", fontSize=7.2,
    leading=9.5, textColor=INK, spaceAfter=2,
))
styles.add(ParagraphStyle(
    name="Tinyx", parent=styles["BodyText"], fontName="Helvetica", fontSize=6.2,
    leading=8, textColor=MUTED, spaceAfter=1,
))
styles.add(ParagraphStyle(
    name="TableHead", parent=styles["BodyText"], fontName="Helvetica-Bold", fontSize=7.3,
    leading=8.8, textColor=WHITE, alignment=TA_LEFT,
))
styles.add(ParagraphStyle(
    name="TableCell", parent=styles["BodyText"], fontName="Helvetica", fontSize=6.9,
    leading=8.7, textColor=INK,
))
styles.add(ParagraphStyle(
    name="TableCellBold", parent=styles["BodyText"], fontName="Helvetica-Bold", fontSize=6.9,
    leading=8.7, textColor=INK,
))
styles.add(ParagraphStyle(
    name="Callout", parent=styles["BodyText"], fontName="Helvetica-Bold", fontSize=10,
    leading=14, textColor=NAVY, spaceAfter=2,
))
styles.add(ParagraphStyle(
    name="Source", parent=styles["BodyText"], fontName="Helvetica", fontSize=6.7,
    leading=8.2, textColor=BLUE, linkColor=BLUE,
))


def P(text, style="Bodyx"):
    return Paragraph(text, styles[style])


def link(label, url):
    return f'<link href="{url}" color="#1F6F8B">{label}</link>'


def bullet(items, style="Bodyx", left=12):
    return ListFlowable(
        [ListItem(P(x, style), bulletColor=TEAL) for x in items],
        bulletType="bullet", leftIndent=left, bulletFontName="Helvetica", bulletFontSize=6,
    )


def cell(text, bold=False):
    return P(text, "TableCellBold" if bold else "TableCell")


def hcell(text):
    return P(text, "TableHead")


def header_footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(LINE)
    canvas.setLineWidth(0.5)
    canvas.line(MARGIN, 12 * mm, PAGE_W - MARGIN, 12 * mm)
    canvas.setFont("Helvetica", 7)
    canvas.setFillColor(MUTED)
    canvas.drawString(MARGIN, 7.5 * mm, "AeroGo internal research | Taiwan package sourcing")
    canvas.drawRightString(PAGE_W - MARGIN, 7.5 * mm, f"Page {doc.page}")
    canvas.restoreState()


def title_band(text, color=NAVY):
    t = Table([[P(text, "H1x")]], colWidths=[CONTENT_W])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.white),
        ("LINEBELOW", (0, 0), (-1, -1), 2, color),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    return t


def callout(text, bg=PALE_BLUE, border=BLUE):
    t = Table([[P(text, "Callout")]], colWidths=[CONTENT_W])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), bg),
        ("BOX", (0, 0), (-1, -1), 0.8, border),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ]))
    return t


def two_col_cards(cards):
    rows = []
    for i in range(0, len(cards), 2):
        row = []
        for j in range(2):
            if i + j < len(cards):
                title, body, bg = cards[i + j]
                box = Table([[P(title, "H2x")], [P(body, "Smallx")]], colWidths=[CONTENT_W / 2 - 6])
                box.setStyle(TableStyle([
                    ("BACKGROUND", (0, 0), (-1, -1), bg),
                    ("BOX", (0, 0), (-1, -1), 0.6, LINE),
                    ("LEFTPADDING", (0, 0), (-1, -1), 8),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                    ("TOPPADDING", (0, 0), (-1, -1), 6),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                ]))
                row.append(box)
            else:
                row.append("")
        rows.append(row)
    t = Table(rows, colWidths=[CONTENT_W / 2, CONTENT_W / 2], hAlign="LEFT")
    t.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ]))
    return t


def make_doc():
    frame = Frame(MARGIN, 15 * mm, CONTENT_W, PAGE_H - 27 * mm, id="normal", leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
    doc = BaseDocTemplate(PDF_PATH, pagesize=A4, leftMargin=MARGIN, rightMargin=MARGIN, topMargin=15 * mm, bottomMargin=15 * mm, title="AeroGo Taiwan - Competitor Package Sourcing", author="AeroGo Travel & Tours")
    doc.addPageTemplates([PageTemplate(id="main", frames=[frame], onPage=header_footer)])
    return doc


def add_source_register(story):
    story.append(title_band("Source register", TEAL))
    sources = [
        ("TravelOnline exact-date 5J package", "https://www.travelonline.ph/international/packages/267"),
        ("TravelOnline Taiwan package index", "https://www.travelonline.ph/international/taiwan"),
        ("TravelOnline terms and reseller clause", "https://travelonline.ph/termsandconditions.php"),
        ("Seventh Advent Taiwan packages", "https://www.seventhadvent.com/packages/taiwan/"),
        ("Seventh Advent terms", "https://www.seventhadvent.com/terms/"),
        ("Travelosa public Facebook flyer", "https://www.facebook.com/photo/?fbid=1105713935167026&set=a.219176293820799"),
        ("Great Leisure public listing", "https://www.findglocal.com/PH/Cabanatuan-City/1764495793639262/GREAT-LEISURE-TRAVEL-AND-TOURS"),
        ("Charthea package feed", "https://www.chartheatravels.com/packages"),
        ("My Destination matching package", "https://travelwithmyd.com/taiwan-taipei-taichung"),
        ("TripHappy matching package", "https://triphappy.ph/taiwan/tour-packages/"),
        ("UOS B2B operator home", "https://uostravel.com/"),
        ("UOS B2B package login gate", "https://uostravel.com/vip/login.html"),
        ("5J312 schedule", "https://www.flight.info/5J312"),
        ("5J313 schedule", "https://info.flightmapper.net/flight/Cebu_Pacific_5J_313"),
        ("Google Flights route price context", "https://www.google.com/travel/flights/flights-from-manila-to-taipei-city.html"),
        ("KKday experience prices", "https://www.kkday.com/en-au/category/tw-taiwan/experiences/list"),
        ("Klook North Coast tour", "https://www.klook.com/activity/217186-yehliu-jiufen-shifen-full-day-cultural-tour-with-perks/"),
        ("Trip.com hotel price context", "https://ph.trip.com/hotels/taichung-hotels-list-3849/"),
    ]
    data = [[hcell("Source"), hcell("Link")]]
    for name, url in sources:
        data.append([cell(name), P(link(url, url), "Source")])
    t = Table(data, colWidths=[58 * mm, CONTENT_W - 58 * mm], repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), TEAL),
        ("GRID", (0, 0), (-1, -1), 0.35, LINE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WHITE, colors.HexColor("#F7FAFC")]),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    story.append(t)


def build():
    story = []

    # Cover
    story.append(Spacer(1, 14 * mm))
    story.append(P("AeroGo Taiwan - Competitor Package Sourcing", "CoverTitle"))
    story.append(P("Internal procurement research | Prepared 22 September 2026", "CoverSub"))
    story.append(Spacer(1, 8 * mm))
    story.append(callout("Primary test: Manila - Taipei / Taichung - Manila, 19-22 November 2026, 4 days / 3 nights, 4 adults + one 12-year-old. No supplier contacted. No booking made.", PALE_BLUE, BLUE))
    story.append(Spacer(1, 8 * mm))
    story.append(P("Executive finding", "H1x"))
    story.append(P("The PHP 27,988 competitor offer is a real, repeatable public retail product rather than an isolated flyer. TravelOnline and Seventh Advent list the exact 19-22 November 2026 departure; Travelosa and Great Leisure publish the same price, dates, flights, route, shopping stops, meals, and exclusions. The evidence strongly points to a shared prearranged group-departure product. Seventh Advent exposes the batch code <b>UOS-PH-TW-5J-20261101-050</b>, linking the public retail product to UOS Travel, a B2B tour-operator site whose product pages require login.", "Bodyx"))
    story.append(P("The lowest exact-date public retail price found is PHP 27,988 per person. No publicly visible net or wholesale rate was found. TravelOnline explicitly allows licensed agencies to resell its packages but states that it pays no commissions; its terms say prices may be negotiable by pax volume. This is a resale route, not a verified agent net rate.", "Bodyx"))
    story.append(Spacer(1, 3 * mm))
    cards = [
        ("Exact-date price", "PHP 27,988 public retail for Nov 19-22, 2026. No lower exact-date public rate verified.", PALE_GREEN),
        ("Product fingerprint", "5J312 06:35-09:05, 5J313 10:30-13:15; Sun Moon Lake cruise; BBQ lunch; same shopping stops.", PALE_BLUE),
        ("5-person issue", "Age 12 is child-with-bed/adult rate. Twin sharing is standard; triple room acceptance and fifth-person supplement are unresolved.", PALE_GOLD),
        ("Commercial route", "UOS B2B login gate identified. Public retail offers are not automatically AeroGo-resellable without supplier terms.", colors.HexColor("#F4EDF9")),
    ]
    story.append(two_col_cards(cards))
    story.append(Spacer(1, 3 * mm))
    story.append(P("Scope note", "H2x"))
    story.append(P("This report collects existing offers and evidence only. It does not create a client quotation, remove shopping stops, assume resale permission, or invent a net rate.", "Bodyx"))
    story.append(PageBreak())

    # Benchmark
    story.append(title_band("1. Competitor benchmark and flight verification"))
    benchmark = [
        [hcell("Field"), hcell("Verified benchmark")],
        [cell("Advertised product"), cell("Taipei + Taichung Taiwan 4D3N Tour - 5J; public flyer price PHP 27,988 per person")],
        [cell("Dates"), cell("Nov 19-22, 2026. Exact date is listed by TravelOnline, Seventh Advent, Travelosa, Great Leisure, and Charthea.")],
        [cell("Published flight schedule"), cell("5J312 MNL-TPE 06:35-09:05 on Nov 19; 5J313 TPE-MNL 10:30-13:15 on Nov 22. These are published scheduled times for the selected dates, not actual operated times yet.")],
        [cell("Airline / baggage"), cell("Cebu Pacific; 7 kg cabin baggage only. Checked baggage excluded.")],
        [cell("Hotels"), cell("Local 4-star, twin sharing. Public sources do not guarantee named hotels; Travelosa flyer shows local 4-star / similar properties. Day 1 Taichung, Days 2-3 Taipei.")],
        [cell("Meals"), cell("Daily breakfast; 3 lunches; one BBQ buffet lunch. Dinner is not included in the benchmark itinerary.")],
        [cell("Tours / transfers"), cell("Shared/private coach described as private coach in flyers, English-speaking guide, airport transfers, sightseeing fees as listed, Sun Moon Lake cruise, sky lantern allowance, basic travel insurance.")],
        [cell("Known exclusions"), cell("Philippine travel tax, driver/guide tips, check-in baggage, fuel surcharge if needed, single supplement, personal expenses. The package must not be described as fully inclusive of these items.")],
    ]
    t = Table(benchmark, colWidths=[42 * mm, CONTENT_W - 42 * mm], repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), NAVY), ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
        ("GRID", (0, 0), (-1, -1), 0.35, LINE), ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WHITE, colors.HexColor("#F7FAFC")]),
        ("LEFTPADDING", (0, 0), (-1, -1), 5), ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("TOPPADDING", (0, 0), (-1, -1), 5), ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    story.append(t)
    story.append(Spacer(1, 4 * mm))
    story.append(P("Flight-source check", "H2x"))
    story.append(P(f"The published schedule source shows 5J312 changing to 06:35-09:05 from 25 October 2026, covering Nov 19. The 5J313 schedule source shows 10:30-13:15 after 29 March 2026, covering Nov 22. Sources: {link('5J312 schedule', 'https://www.flight.info/5J312')} and {link('5J313 schedule', 'https://info.flightmapper.net/flight/Cebu_Pacific_5J_313')}.", "Bodyx"))
    story.append(P("The flyer and public package pages therefore use the correct future scheduled times. Seat inventory and final airfare fare basis were not publicly exposed in the package listings; do not treat the schedule as a seat guarantee.", "Bodyx"))
    story.append(P("Itinerary fingerprint", "H2x"))
    story.append(bullet([
        "Day 1: Taoyuan arrival, Taichung transfer, Chungshe Flower Garden, Sun Moon Lake cruise, tea garden, night market, Taichung 4-star hotel.",
        "Day 2: Taichung to Taipei, cake shop, Shilin Residence / Chiang Kai-shek site, BBQ buffet, Liberty Square, Taipei 101 exterior, Ximending, Taipei hotel.",
        "Day 3: Jade handicraft, Yehliu Geopark, Shifen Waterfall, Shifen Old Street, Chinese sky lantern, duty-free or cosmetic shop.",
        "Day 4: Breakfast, airport transfer, return to Manila.",
    ]))
    story.append(Spacer(1, 3 * mm))
    story.append(P(f"Primary evidence: {link('TravelOnline package detail', 'https://www.travelonline.ph/international/packages/267')} | {link('Seventh Advent batch listing', 'https://www.seventhadvent.com/packages/taiwan/')} | {link('Travelosa public flyer post', 'https://www.facebook.com/photo/?fbid=1105713935167026&set=a.219176293820799')}.", "Source"))
    story.append(PageBreak())

    # Comparison table
    story.append(title_band("2. Existing package comparison"))
    story.append(P("The table separates exact-date offers from lower-price or incomplete near-matches. All amounts are public retail prices unless explicitly marked otherwise.", "Bodyx"))
    rows = [[hcell("Source / type"), hcell("Package / date"), hcell("Price and 5-pax signal"), hcell("Inclusions / exclusions"), hcell("Commercial / status")]]
    rows.append([
        cell("TravelOnline.ph\nRetail agency / package intermediary", True),
        cell("Taiwan 4D3N (5J), 2026\nNov 19-22 exact"),
        cell("PHP 27,988/pax. Published 5-pax floor PHP139,940 before known exclusions. Child with bed same adult. Single supplement PHP8,500 if required."),
        cell("Cebu Pacific + 7kg, 4-star, 3 breakfasts, 3 lunches, tours/entrances, coach, English guide, airport transfers, insurance. Excludes PH tax PHP1,620, mandatory tips PHP1,120, fuel if needed USD36, checked bag, single supplement."),
        cell("Exact-date public listing. Shopping-stop discounted rate; attendance at scheduled shops mandatory, purchases optional. Reseller clause: no commission; prices may be negotiable by pax volume. Availability subject to supplier release."),
    ])
    rows.append([
        cell("Seventh Advent\nRetail agency", True),
        cell("Taiwan - Taipei & Taichung, Christmas season\nNov 19-22 exact"),
        cell("PHP 27,988/pax, all-in on twin sharing. No published triple-room or 5-pax total."),
        cell("Roundtrip airfare per batch, breakfast, private coach + English guide, sightseeing/entrances, meals as listed. Page confirms Sun Moon Lake cruise and BBQ buffet. Detailed exclusions governed by supplier quotation."),
        cell("Exact-date public listing; 21 departures. Batch code UOS-PH-TW-5J-20261101-050 is a strong source fingerprint. Inquiry-only; no public agent net or commission."),
    ])
    rows.append([
        cell("Travelosa\nRetail social seller", True),
        cell("Taipei + Taichung + Taiwan 4D3N Tour - 5J\nNov 19-22 exact", True),
        cell("PHP 27,988/pax. Flyer lists exact date and flight times. No published 5-pax total; twin sharing default and triple room not guaranteed."),
        cell("Local 4-star/similar, daily breakfast, 3 lunches incl. BBQ, private coach + English guide, listed entrance fees, 7kg hand carry, basic insurance. Excludes baggage, fuel if needed, tips, PH tax, single supplement, personal expenses."),
        cell("Public Facebook flyer, code TTAI-TAI-002-UTC. Notice says rate is with shop visits and itinerary/hotel may change. No public agent/reseller terms found."),
    ])
    rows.append([
        cell("Great Leisure Travel & Tours\nRetail social listing / mirror", True),
        cell("Taiwan Getaway: Taipei + Taichung 4D3N\nNov 19-22 exact", True),
        cell("Starts PHP 27,988/pax. Child without bed PHP24,688, but only for young-child category; 12-year-old must use child-with-bed/adult treatment. 5-pax rooming unresolved."),
        cell("3-night local 4-star twin sharing, Cebu Pacific 7kg, coach + English guide, sightseeing/entrances, meals incl. BBQ, basic insurance. Detailed itinerary reproduces the benchmark fingerprint."),
        cell("Public agency listing; no net rate, commission, or reseller permission published. Exact-date listing is credible but page is a social-directory mirror rather than a checkout inventory."),
    ])
    rows.append([
        cell("Charthea Travels & Tours\nRetail booking listing", True),
        cell("Taipei Taichung 4D3N\nNov 19-22 exact", True),
        cell("PHP 27,988/pax. Public listing shows 32 seats. No 5-pax rooming total published."),
        cell("The listing identifies the same destination, duration, and date; detailed inclusion/exclusion page did not load during research, so airfare, meals, guide, shops, and insurance are not independently verified here."),
        cell("Useful corroborating availability signal only. Do not treat as fully matched until the detail page and booking conditions are accessible."),
    ])
    t = Table(rows, colWidths=[32 * mm, 32 * mm, 35 * mm, 51 * mm, CONTENT_W - 150 * mm], repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), NAVY), ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
        ("GRID", (0, 0), (-1, -1), 0.3, LINE), ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WHITE, colors.HexColor("#F7FAFC")]),
        ("LEFTPADDING", (0, 0), (-1, -1), 3.5), ("RIGHTPADDING", (0, 0), (-1, -1), 3.5),
        ("TOPPADDING", (0, 0), (-1, -1), 4), ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    story.append(t)
    story.append(Spacer(1, 4 * mm))
    story.append(P("Lower-price near-match screened", "H2x"))
    story.append(P(f"{link('My Destination Tours and Travel', 'https://travelwithmyd.com/taiwan-taipei-taichung')} and {link('TripHappy', 'https://triphappy.ph/taiwan/tour-packages/')} publish the same itinerary fingerprint at PHP 26,988 per person, but their public dates do not include Nov 19-22. My Destination lists May-August 2026 departures; TripHappy lists Oct 29-Nov 3 as its latest shown Manila dates. They are sourcing leads, not primary-date options.", "Bodyx"))
    story.append(PageBreak())

    # Detailed option notes
    story.append(title_band("3. Offer details and customer fit"))
    option_blocks = [
        ("TravelOnline - strongest exact-date retail lead", "The package page is the most complete public source: exact primary dates, price, 7kg cabin bag, 4-star hotel, breakfast, 3 lunches, tours and entrances, air-conditioned coach, English guide, basic insurance, child-with-bed policy, single supplement, guide/driver tips, PH tax, fuel-surcharge language, and the shopping-stop disclaimer. Its public terms explicitly say the price is a shopping-stop discounted joiner product, attendance at scheduled shopping stops is mandatory, purchases are optional, and the group follows the program together. The same terms say licensed agencies may resell but receive no commission; pricing may be negotiable by volume. This is the clearest source to approach only after owner approval.", PALE_GREEN),
        ("Seventh Advent - strongest batch fingerprint", "The agency publishes the exact Nov 19-22 departure at PHP27,988 and exposes the batch identifier UOS-PH-TW-5J-20261101-050. Its package page says rates are all-in per person on twin sharing and describes the included roundtrip airfare, hotel breakfast, private coach, English-speaking guide, sightseeing/entrances, and meals as listed. The public page is inquiry-based, not a confirmed seat inventory, and it does not expose a net/agent rate. Its terms say online rates are indicative and the supplier quotation governs.", PALE_BLUE),
        ("Travelosa - direct competitor benchmark evidence", "The public Facebook flyer is the closest visual match to the supplied competitor material: PHP27,988, Cebu Pacific, exact Nov19-22 date, 5J312 06:35-09:05, 5J313 10:30-13:15, same four-day route, same Sun Moon Lake cruise, same shopping stops, same 3 lunches/BBQ, and the same exclusion pattern. The flyer also warns that twin sharing is the default, triple room is not guaranteed, hotels/itinerary may change, and the rate is tied to visiting tea, cake, jade, duty-free/cosmetic shopping stops.", PALE_GOLD),
        ("Great Leisure - corroborating retail copy", "Great Leisure's public listing reproduces the same itinerary and exact date list, and states PHP27,988 all-in per person with child-without-bed PHP24,688. It lists the same 4-star twin-sharing, Cebu Pacific 7kg, coach/guide, entrances, BBQ lunch, and basic insurance. It is useful corroboration, but because the source is a social-directory mirror, AeroGo should not treat it as proof of a live five-seat booking or net supply.", colors.HexColor("#F4EDF9")),
        ("Charthea - exact-date availability signal", "Charthea's public package feed lists Nov19-22 at PHP27,988 and shows 32 seats. The detail page was not accessible during research; this makes it a lead for availability only. Before considering it as an offer, verify all inclusions, the supplier of the air/land components, 5-pax rooming, and cancellation terms.", PALE_BLUE),
    ]
    for title, body, bg in option_blocks:
        box = Table([[P(title, "H2x")], [P(body, "Bodyx")]], colWidths=[CONTENT_W])
        box.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), bg), ("BOX", (0, 0), (-1, -1), 0.55, LINE),
            ("LEFTPADDING", (0, 0), (-1, -1), 8), ("RIGHTPADDING", (0, 0), (-1, -1), 8),
            ("TOPPADDING", (0, 0), (-1, -1), 6), ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ]))
        story.append(box)
        story.append(Spacer(1, 3 * mm))
    story.append(PageBreak())

    # Commercial and shopping economics
    story.append(title_band("4. Why the price is low: documented economics"))
    story.append(P("Documented facts", "H2x"))
    story.append(bullet([
        "TravelOnline labels the rate as a Shopping-Stop Discount Tour and states that participating establishments help subsidize portions of the tour cost in exchange for access to visiting tourists.",
        "The exact package includes scheduled tea, cake/pineapple-cake, jade/handicraft, and duty-free/cosmetic shopping stops. The public flyer also shows the same stops.",
        "TravelOnline states that attendance is mandatory, purchasing is optional, and the group follows the scheduled program together. It warns that a stop can last about an hour or longer, depending on the package.",
        "TravelOnline says discounted joiner rates are also enabled by bulk purchase of airfare, hotels, transportation, and land arrangements. The source does not publish the supplier cost split.",
    ]))
    story.append(P("What is not documented", "H2x"))
    story.append(bullet([
        "No public source states a cash penalty for skipping a shopping stop. The practical restriction is operational: the itinerary is fixed, attendance is required by the discounted-tour terms, and leaving the group could forfeit the included transport or cause a supplier dispute.",
        "No public source confirms the named hotel allotment, airfare booking class, group minimum, exact seats available to AeroGo, or the net rate available to agents.",
        "No public source proves that TravelOnline, Travelosa, Seventh Advent, Great Leisure, and Charthea are all contracting directly with the same company. The matching product fingerprint plus UOS batch code is strong evidence of a common upstream product, not formal proof of every seller's contract chain.",
    ]))
    story.append(callout("Do not remove shopping stops and assume the same PHP27,988 price remains valid. A shopping-free or private version is a different product and should be re-priced separately.", PALE_GOLD, GOLD))
    story.append(Spacer(1, 4 * mm))
    story.append(P("Potential underlying operator", "H2x"))
    story.append(P(f"UOS Travel describes itself as a B2B tour operator. Its public site lists Taiwan 4D3N (5J) as a best seller, but clicking the product redirects to a login gate; a public registration form exists. Seventh Advent's exact batch code begins with UOS-PH-TW, making UOS the best documented B2B lead. No registration or contact was attempted. Sources: {link('UOS B2B home', 'https://uostravel.com/')} and {link('UOS login gate', 'https://uostravel.com/vip/login.html')}.", "Bodyx"))
    story.append(P("Agent and reseller matrix", "H2x"))
    commercial = [
        [hcell("Source"), hcell("Public status"), hcell("Agent / wholesale information"), hcell("AeroGo action status")],
        [cell("TravelOnline"), cell("Retail agency / package intermediary"), cell("Resale is acknowledged in terms; no commission; volume pricing may be negotiable. Not a published net rate."), cell("Lead only; no contact made.")],
        [cell("UOS Travel"), cell("B2B tour operator"), cell("Login and registration are visible. No public net rate, commission, or partner criteria visible without account."), cell("Best B2B lead; no registration made.")],
        [cell("Seventh Advent"), cell("Retail agency"), cell("No public agent registration, commission, or net-rate schedule found."), cell("Retail comparison only.")],
        [cell("Travelosa / Great Leisure / Charthea"), cell("Retail sellers or booking intermediaries"), cell("No published B2B/reseller terms located in the evidence reviewed."), cell("Retail comparison only.")],
        [cell("My Destination"), cell("DOT-accredited retail agency / tour seller"), cell("Publishes partnerships and inquiry channels, but no public agent net schedule for this product."), cell("Lower-price lead on non-primary dates; no contact made.")],
    ]
    t = Table(commercial, colWidths=[35 * mm, 43 * mm, 77 * mm, CONTENT_W - 155 * mm], repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), TEAL), ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
        ("GRID", (0, 0), (-1, -1), 0.3, LINE), ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WHITE, colors.HexColor("#F7FAFC")]),
        ("LEFTPADDING", (0, 0), (-1, -1), 4), ("RIGHTPADDING", (0, 0), (-1, -1), 4),
        ("TOPPADDING", (0, 0), (-1, -1), 4), ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    story.append(t)
    story.append(PageBreak())

    # Group of five
    story.append(title_band("5. Test group: 4 adults + one 12-year-old"))
    story.append(P("The published offers do not support a confirmed five-person total without a supplier response. The reason is rooming, not child fare: every source that states the child policy treats a child with bed as the adult rate, and the public package is priced on twin sharing.", "Bodyx"))
    group_rows = [
        [hcell("Question"), hcell("Evidence"), hcell("Procurement implication")],
        [cell("Age 12"), cell("TravelOnline / My Destination / Great Leisure list child with bed at the adult rate, with no-bed categories only for young children."), cell("Price the 12-year-old at the adult/child-with-bed rate. Do not use a child discount.")],
        [cell("Rooming"), cell("Twin sharing is the published basis. Travelosa says twin sharing is the default and a triple room is not guaranteed."), cell("Need supplier confirmation for one triple + one twin, or two twins + one single room.")],
        [cell("Single supplement"), cell("TravelOnline publishes PHP8,500 for the exact 5J package; other sellers do not publish a 5-pax rooming charge."), cell("If a single is required, the package total increases. Do not multiply PHP27,988 by five and call it confirmed.")],
        [cell("Known extra charges"), cell("TravelOnline publishes mandatory tips PHP1,120/pax, PH tax PHP1,620/pax, and possible USD36/pax fuel surcharge."), cell("A 5-person floor with known PHP charges is materially above PHP139,940, before fuel and rooming." )],
        [cell("Seats"), cell("Charthea feed shows 32 seats for Nov19-22; other sources say subject to availability but do not expose a live seat count."), cell("32-seat listing is a public lead, not a confirmed reservation or AeroGo allotment.")],
    ]
    t = Table(group_rows, colWidths=[33 * mm, 80 * mm, CONTENT_W - 113 * mm], repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), NAVY), ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
        ("GRID", (0, 0), (-1, -1), 0.35, LINE), ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WHITE, colors.HexColor("#F7FAFC")]),
        ("LEFTPADDING", (0, 0), (-1, -1), 5), ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("TOPPADDING", (0, 0), (-1, -1), 5), ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    story.append(t)
    story.append(Spacer(1, 5 * mm))
    story.append(P("Known-price arithmetic - not a quotation", "H2x"))
    arithmetic = [
        [hcell("Scenario"), hcell("Calculation"), hcell("Amount"), hcell("Status")],
        [cell("Published 5-person floor"), cell("5 x PHP27,988"), cell("PHP139,940"), cell("Arithmetic only; ignores rooming and exclusions")],
        [cell("Add one known single supplement"), cell("PHP139,940 + PHP8,500"), cell("PHP148,440"), cell("Conditional on single room being required")],
        [cell("Add mandatory tips for five"), cell("PHP148,440 + (5 x PHP1,120)"), cell("PHP154,040"), cell("Uses TravelOnline exact-package terms")],
        [cell("Add PH travel tax for five"), cell("PHP154,040 + (5 x PHP1,620)"), cell("PHP162,140"), cell("PH tax is excluded / subject to going rate")],
        [cell("Fuel surcharge if applied"), cell("Add USD36 x 5"), cell("USD180 extra"), cell("Going/return surcharge language; not confirmed")],
    ]
    t = Table(arithmetic, colWidths=[48 * mm, 57 * mm, 30 * mm, CONTENT_W - 135 * mm], repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), TEAL), ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
        ("GRID", (0, 0), (-1, -1), 0.35, LINE), ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WHITE, colors.HexColor("#F7FAFC")]),
        ("LEFTPADDING", (0, 0), (-1, -1), 5), ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("TOPPADDING", (0, 0), (-1, -1), 5), ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    story.append(t)
    story.append(Spacer(1, 4 * mm))
    story.append(callout("Commercial conclusion for AeroGo: PHP27,988 is a credible benchmark for a matched public retail product, but there is no evidence yet that AeroGo can buy this product at a net rate low enough to support a PHP2,000 markup while preserving a five-person room arrangement and paying all mandatory exclusions.", PALE_BLUE, BLUE))
    story.append(PageBreak())

    # DIY
    story.append(title_band("6. Brief like-for-like DIY comparison"))
    story.append(P("DIY was reviewed only after the group products. The evidence does not support a final DIY quote, but it does show why a like-for-like DIY package is unlikely to undercut the published group price with confidence.", "Bodyx"))
    diy = [
        [hcell("DIY component"), hcell("Public price evidence"), hcell("Procurement read")],
        [cell("Five Cebu Pacific tickets"), cell("Google Flights route context shows Cebu Pacific typical roundtrips around USD155-265 and November route ranges around USD125-190, but not an exact Nov19-22 live quote. The 5J schedule is published."), cell("At PHP58/USD, airfare alone is roughly PHP36,250-55,100 for five using the broad November range. Exact fare and baggage must be rechecked directly.")],
        [cell("3 nights, 4-star hotels"), cell("Trip.com route context shows a 4-star Taichung average around PHP10,194 per room/night. This is not an exact-date quote and does not solve Taipei/Taichung split hotel inventory."), cell("Two rooms x three nights can easily exceed PHP61,000 before exact-date tax, breakfast, and triple-room requirements.")],
        [cell("North-coast guided day"), cell("Klook shows a Taipei Yehliu/Shifen-type shared day tour from about EUR35.45 per person, with guide and listed inclusions varying by option."), cell("About PHP11,000-12,000 for five before adding every benchmark stop or shopping transfer; not identical to the group itinerary.")],
        [cell("Sun Moon Lake / Taichung"), cell("KKday shows a Sun Moon Lake shared day tour from about AUD48.70 per person; route and inclusions vary."), cell("About PHP9,000-10,000 for five before hotel-to-tour logistics, cruise/meals, and any overnight Taichung transport.")],
        [cell("Meals, insurance, transfers"), cell("No single public DIY checkout was found that combines 3 breakfasts, 3 lunches including BBQ, airport transfers, shared coach, English guide, entrance fees, cruise, and insurance for the exact dates."), cell("These are the items most often omitted in a DIY comparison. A DIY total that excludes them is not like-for-like.")],
    ]
    t = Table(diy, colWidths=[36 * mm, 87 * mm, CONTENT_W - 123 * mm], repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), NAVY), ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
        ("GRID", (0, 0), (-1, -1), 0.35, LINE), ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WHITE, colors.HexColor("#F7FAFC")]),
        ("LEFTPADDING", (0, 0), (-1, -1), 5), ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("TOPPADDING", (0, 0), (-1, -1), 5), ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    story.append(t)
    story.append(Spacer(1, 5 * mm))
    story.append(callout("DIY verdict: possible to approach the group price only with favorable airfare, budget hotels, and selective shared tours. It is not yet demonstrated as cheaper on a like-for-like basis. The organized product's shopping-stop subsidy and bulk allotments are the main cost advantages to understand first.", PALE_GOLD, GOLD))
    story.append(Spacer(1, 5 * mm))
    story.append(P("Source links for the DIY check", "H2x"))
    story.append(P(f"{link('Google Flights Manila-Taipei context', 'https://www.google.com/travel/flights/flights-from-manila-to-taipei-city.html')} | {link('KKday Taiwan experiences', 'https://www.kkday.com/en-au/category/tw-taiwan/experiences/list')} | {link('Klook North Coast day tour', 'https://www.klook.com/activity/217186-yehliu-jiufen-shifen-full-day-cultural-tour-with-perks/')} | {link('Trip.com hotel market context', 'https://ph.trip.com/hotels/taichung-hotels-list-3849/')}", "Source"))
    story.append(PageBreak())

    # Evidence screenshots
    story.append(title_band("7. Evidence screenshots"))
    story.append(P("These are supplier-hosted public flyer images captured from the advertised offer pages. The Travelosa Facebook post was also visually inspected; its public post is linked in the source register and the key facts are transcribed in the benchmark and offer tables.", "Bodyx"))
    img1 = os.path.join(EVIDENCE, "travelonline_taiwan_5j.jpg")
    if os.path.exists(img1):
        im = Image(img1)
        max_w = CONTENT_W
        max_h = 225 * mm
        scale = min(max_w / im.imageWidth, max_h / im.imageHeight)
        im.drawWidth = im.imageWidth * scale
        im.drawHeight = im.imageHeight * scale
        story.append(P("Evidence A - TravelOnline Taiwan 4D3N (5J), exact Nov19-22 departure and exclusions", "H2x"))
        story.append(im)
        story.append(P(f"Source image hosted by TravelOnline; package page: {link('TravelOnline exact package', 'https://www.travelonline.ph/international/packages/267')}", "Source"))
    story.append(PageBreak())

    story.append(title_band("8. Additional flyer evidence"))
    img2 = os.path.join(EVIDENCE, "mydestination_taiwan.jpg")
    if os.path.exists(img2):
        im = Image(img2)
        max_w = CONTENT_W
        max_h = 236 * mm
        scale = min(max_w / im.imageWidth, max_h / im.imageHeight)
        im.drawWidth = im.imageWidth * scale
        im.drawHeight = im.imageHeight * scale
        story.append(P("Evidence B - My Destination Tours and Travel matching package flyer", "H2x"))
        story.append(im)
        story.append(P(f"This flyer is the same itinerary family at PHP26,988 for its displayed May-August 2026 dates; it is a lower-price near-match, not an exact Nov19-22 option. Source: {link('My Destination Taiwan package', 'https://travelwithmyd.com/taiwan-taipei-taichung')}", "Source"))
    story.append(PageBreak())

    add_source_register(story)
    story.append(Spacer(1, 5 * mm))
    story.append(P("End of internal research report", "Tinyx"))
    doc = make_doc()
    doc.build(story)
    print(PDF_PATH)


if __name__ == "__main__":
    build()
