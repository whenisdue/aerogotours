from datetime import datetime
from pathlib import Path
from xml.sax.saxutils import escape
from zoneinfo import ZoneInfo

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    HRFlowable,
    KeepTogether,
    LongTable,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path('/Users/esguerra/Desktop/aerogotours')
OUT = ROOT / 'output' / 'pdf' / 'AeroGo_Taiwan_Flight_Deal_Collection_Nov19-22_2026.pdf'
OUT.parent.mkdir(parents=True, exist_ok=True)

NAVY = colors.HexColor('#11253D')
TEAL = colors.HexColor('#1B6E78')
INK = colors.HexColor('#23313F')
MUTED = colors.HexColor('#617181')
PALE = colors.HexColor('#F3F7F9')
PALE_TEAL = colors.HexColor('#E7F2F3')
GOLD = colors.HexColor('#F7E4A8')
GREEN = colors.HexColor('#DDF2E5')
RED = colors.HexColor('#FCE3E1')
LINE = colors.HexColor('#D5E0E6')

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(
    name='CoverTitle', parent=styles['Title'], fontName='Helvetica-Bold', fontSize=25,
    leading=29, textColor=NAVY, spaceAfter=5, alignment=TA_LEFT,
))
styles.add(ParagraphStyle(
    name='CoverSub', parent=styles['Normal'], fontName='Helvetica', fontSize=11,
    leading=15, textColor=TEAL, spaceAfter=9,
))
styles.add(ParagraphStyle(
    name='H1Aero', parent=styles['Heading1'], fontName='Helvetica-Bold', fontSize=16,
    leading=20, textColor=NAVY, spaceBefore=4, spaceAfter=7,
))
styles.add(ParagraphStyle(
    name='H2Aero', parent=styles['Heading2'], fontName='Helvetica-Bold', fontSize=11,
    leading=14, textColor=TEAL, spaceBefore=7, spaceAfter=4,
))
styles.add(ParagraphStyle(
    name='BodyAero', parent=styles['BodyText'], fontName='Helvetica', fontSize=8.2,
    leading=11, textColor=INK, spaceAfter=4,
))
styles.add(ParagraphStyle(
    name='SmallAero', parent=styles['BodyText'], fontName='Helvetica', fontSize=7,
    leading=9, textColor=MUTED, spaceAfter=2,
))
styles.add(ParagraphStyle(
    name='TableAero', parent=styles['BodyText'], fontName='Helvetica', fontSize=6.8,
    leading=8.6, textColor=INK, spaceAfter=0,
))
styles.add(ParagraphStyle(
    name='TableHeadAero', parent=styles['BodyText'], fontName='Helvetica-Bold', fontSize=6.5,
    leading=7.8, textColor=colors.white, spaceAfter=0,
))
styles.add(ParagraphStyle(
    name='Kicker', parent=styles['BodyText'], fontName='Helvetica-Bold', fontSize=7.4,
    leading=9, textColor=TEAL, uppercase=True, spaceAfter=3,
))
styles.add(ParagraphStyle(
    name='StatValue', parent=styles['BodyText'], fontName='Helvetica-Bold', fontSize=14,
    leading=17, textColor=NAVY, alignment=TA_CENTER, spaceAfter=1,
))
styles.add(ParagraphStyle(
    name='StatLabel', parent=styles['BodyText'], fontName='Helvetica', fontSize=7,
    leading=9, textColor=MUTED, alignment=TA_CENTER,
))
styles.add(ParagraphStyle(
    name='Callout', parent=styles['BodyText'], fontName='Helvetica', fontSize=8,
    leading=10.5, textColor=INK, leftIndent=1, rightIndent=1,
))


def P(text, style='BodyAero'):
    return Paragraph(text, styles[style])


def money(n):
    return f'PHP {n:,.0f}'


def link(url, label=None, style='SmallAero'):
    label = label or url
    return Paragraph(f'<link href="{escape(url)}" color="#1B6E78"><u>{escape(label)}</u></link>', styles[style])


def bullets(items):
    return [P(f'• {escape(item)}', 'BodyAero') for item in items]


timestamp_note = '22 Sep 2026, Asia/Manila session; provider page did not expose a retained minute for every result.'
agoda_url = 'https://www.agoda.com/flights/results?departureFrom=MNL&departureFromType=1&arrivalTo=TPE&arrivalToType=1&departDate=2026-11-19&returnDate=2026-11-22&searchType=2&cabinType=Economy&adults=5&sort=8'
skyscanner_url = 'https://www.skyscanner.com.ph/transport/flights/mnl/tpe/261119/261122/?adultsv2=4&childrenv2=1&cabinclass=economy&currency=PHP&locale=en-US&fare-attributes=cabin-bag'
airasia_url = 'https://www.airasia.com/v2/flights/search/?origin=MNL&destination=TPE&departDate=19%2F11%2F2026&returnDate=22%2F11%2F2026&tripType=R&adult=4&child=1&infant=0&locale=en-gb&currency=PHP&airlineProfile=k%2Cd%2Cg&type=paired&cabinClass=economy&upsellWidget=true&upsellPremiumFlatbedWidget=true&isOC=false&isDC=true&uce=true&ancillaryAbTest=false&isAirasiaFlightOnly=false&providers=&taIDs=&j=cds'

agoda = [
    dict(id='AGO01', airline='Philippines AirAsia + Cebu Pacific', provider='Agoda', out='Z2 126  |  19 Nov 16:25–18:40', ret='5J 311  |  22 Nov 03:15–05:45', fare='Economy; fare name not displayed', bag='Cabin bag badge', pp=13433, total=67165, charges='Taxes and fees included; no payment fee displayed', status='SEARCH RESULT'),
    dict(id='AGO02', airline='Philippines AirAsia + Cebu Pacific', provider='Agoda', out='Z2 126  |  19 Nov 16:25–18:40', ret='5J 313  |  22 Nov 10:20–13:05', fare='Economy; fare name not displayed', bag='Cabin bag badge', pp=13956, total=69780, charges='Taxes and fees included; +PHP 523 return increment', status='SEARCH RESULT'),
    dict(id='AGO03', airline='Philippines AirAsia + Philippines AirAsia', provider='Agoda', out='Z2 126  |  19 Nov 16:25–18:40', ret='AirAsia flight no. not displayed  |  22 Nov 09:45–12:10', fare='Economy; fare name not displayed', bag='Cabin bag badge', pp=15562, total=77810, charges='Taxes and fees included; +PHP 2,129 return increment', status='SEARCH RESULT'),
    dict(id='AGO04', airline='Philippines AirAsia + China Airlines', provider='Agoda', out='Z2 126  |  19 Nov 16:25–18:40', ret='China Airlines flight no. not displayed  |  22 Nov 07:35–09:55', fare='Economy; fare name not displayed', bag='Cabin bag + checked baggage badges', pp=16142, total=80710, charges='Taxes and fees included; +PHP 2,709 return increment', status='SEARCH RESULT'),
    dict(id='AGO05', airline='Philippines AirAsia + China Airlines', provider='Agoda', out='Z2 126  |  19 Nov 16:25–18:40', ret='China Airlines flight no. not displayed  |  22 Nov 14:45–17:05', fare='Economy; fare name not displayed', bag='Cabin bag + checked baggage badges', pp=16142, total=80710, charges='Taxes and fees included; +PHP 2,709 return increment', status='SEARCH RESULT'),
]

skyscanner = [
    dict(id='SKY01', airline='Philippines AirAsia + Cebu Pacific', provider='Skyscanner', out='AirAsia flight no. not displayed  |  19 Nov 06:55–09:05', ret='Cebu Pacific flight no. not displayed  |  22 Nov 10:20–13:05', fare='Economy search result', bag='Carry-on included; checked bag not included', pp=12546, total=62728, charges='Taxes and charges included in displayed total', status='SEARCH RESULT'),
    dict(id='SKY02', airline='Cebu Pacific', provider='Skyscanner', out='Flight no. not displayed  |  19 Nov 06:35–09:05', ret='Flight no. not displayed  |  22 Nov 10:20–13:05', fare='Economy search result', bag='Carry-on included; checked bag not included', pp=12968, total=64837, charges='Taxes and charges included in displayed total', status='SEARCH RESULT'),
    dict(id='SKY03', airline='STARLUX Airlines', provider='Skyscanner', out='Flight no. not displayed  |  19 Nov 11:50–14:10', ret='Flight no. not displayed  |  22 Nov 08:15–10:40', fare='Economy search result', bag='Carry-on + checked baggage included', pp=13489, total=67444, charges='Taxes and charges included in displayed total', status='SEARCH RESULT'),
    dict(id='SKY04', airline='China Airlines', provider='Skyscanner', out='Flight no. not displayed  |  19 Nov 10:55–13:05', ret='Flight no. not displayed  |  22 Nov 14:45–17:05', fare='Economy search result', bag='Carry-on + checked baggage included', pp=13885, total=69422, charges='Taxes and charges included in displayed total', status='SEARCH RESULT'),
    dict(id='SKY05', airline='EVA Air', provider='Skyscanner', out='Flight no. not displayed  |  19 Nov 03:40–06:00', ret='Flight no. not displayed  |  22 Nov 15:30–17:50', fare='Economy search result', bag='Carry-on + checked baggage included', pp=13928, total=69640, charges='Taxes and charges included in displayed total', status='SEARCH RESULT'),
]

blocked = [
    dict(name='Cebu Pacific', url='https://www.cebupacificair.com/en-PH/', result='UNAVAILABLE / BLOCKED', detail='Official homepage loaded as a blank white page in the research browser; the booking engine did not render, so no fare was recorded.'),
    dict(name='AirAsia', url=airasia_url, result='UNAVAILABLE / BLOCKED', detail='Exact-date, five-passenger search reached Cloudflare security verification: “Performing security verification… This website uses a security service to protect against malicious bots.” No round-trip fare was recorded.'),
    dict(name='Scoot', url='https://www.flyscoot.com/flights/en-ph/flights-from-manila-to-taipei/', result='UNAVAILABLE / BLOCKED', detail='Official route page was reachable, but no Nov 19–22 exact-date fare was displayed; the public page returned no matching fare cards for the requested date window.'),
    dict(name='HK Express', url='https://www.hkexpress.com/en', result='UNAVAILABLE / BLOCKED', detail='Official booking widget opened and accepted the five-adult setup; the route search could not surface a usable MNL–TPE itinerary, so no fare was recorded.'),
]


def section_title(title, subtitle=None):
    flow = [P(title, 'H1Aero'), HRFlowable(width='100%', thickness=1.2, color=TEAL, spaceAfter=5)]
    if subtitle:
        flow.append(P(subtitle, 'SmallAero'))
    return flow


def make_table(data, widths, header=True, highlight_rows=None, font=6.8):
    highlight_rows = highlight_rows or []
    table = LongTable(data, colWidths=widths, repeatRows=1 if header else 0, hAlign='LEFT')
    ts = [
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('GRID', (0, 0), (-1, -1), 0.35, LINE),
        ('LEFTPADDING', (0, 0), (-1, -1), 4),
        ('RIGHTPADDING', (0, 0), (-1, -1), 4),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]
    if header:
        ts += [('BACKGROUND', (0, 0), (-1, 0), NAVY), ('TEXTCOLOR', (0, 0), (-1, 0), colors.white)]
        start = 1
    else:
        start = 0
    for row in range(start, len(data)):
        if row in highlight_rows:
            ts.append(('BACKGROUND', (0, row), (-1, row), GOLD))
        elif row % 2 == 0:
            ts.append(('BACKGROUND', (0, row), (-1, row), PALE))
    table.setStyle(TableStyle(ts))
    return table


def opt_table(options, source_url, compact=False):
    if compact:
        headers = ['ID', 'Airline / provider', 'Outbound', 'Return', 'Fare / baggage', 'PHP / pax', 'Total 5 pax', 'Evidence']
        widths = [31, 104, 113, 119, 112, 46, 54, 56]
    else:
        headers = ['ID', 'Airline / provider', 'Outbound schedule', 'Return schedule', 'Fare tier / baggage', 'PHP / pax', 'Total for 5', 'Charges / status']
        widths = [31, 106, 116, 119, 109, 47, 55, 70]
    data = [[P(h, 'TableHeadAero') for h in headers]]
    for o in options:
        data.append([
            P(f'<b>{o["id"]}</b>', 'TableAero'),
            P(f'{escape(o["airline"])}<br/><font color="#617181">{escape(o["provider"])}</font>', 'TableAero'),
            P(escape(o['out']), 'TableAero'),
            P(escape(o['ret']), 'TableAero'),
            P(f'{escape(o["fare"])}<br/><font color="#1B6E78">{escape(o["bag"])}</font>', 'TableAero'),
            P(money(o['pp']), 'TableAero'),
            P(money(o['total']), 'TableAero'),
            P(f'{escape(o["charges"])}<br/><font color="#1B6E78"><b>{escape(o["status"])}</b></font>', 'TableAero'),
        ])
    return make_table(data, [w * mm / 3.2 for w in widths], highlight_rows=[])


def blocked_table(items=None):
    items = items or blocked
    data = [[P('Website', 'TableHeadAero'), P('Status', 'TableHeadAero'), P('Observed obstacle / reason no options were recorded', 'TableHeadAero')]]
    for b in items:
        data.append([P(f'<b>{escape(b["name"])}</b><br/>{escape(b["url"])}', 'TableAero'), P(escape(b['result']), 'TableAero'), P(escape(b['detail']), 'TableAero')])
    return make_table(data, [42*mm, 38*mm, 184*mm])


def consolidate():
    combined = []
    for o in agoda + skyscanner:
        combined.append(o)
    combined.sort(key=lambda x: (x['total'], x['id']))
    data = [[P(h, 'TableHeadAero') for h in ['Rank', 'ID', 'Website / airline', 'Total 5 pax', 'Per pax', 'Schedule', 'Baggage', 'Evidence']]]
    for i, o in enumerate(combined, 1):
        data.append([
            P(str(i), 'TableAero'), P(f'<b>{o["id"]}</b>', 'TableAero'),
            P(f'{escape(o["provider"])}<br/>{escape(o["airline"])}', 'TableAero'),
            P(money(o['total']), 'TableAero'), P(money(o['pp']), 'TableAero'),
            P(f'Out: {escape(o["out"].split("  |  ", 1)[-1])}<br/>Ret: {escape(o["ret"].split("  |  ", 1)[-1])}', 'TableAero'),
            P(escape(o['bag']), 'TableAero'), P(escape(o['status']), 'TableAero'),
        ])
    return make_table(data, [12*mm, 22*mm, 48*mm, 28*mm, 24*mm, 58*mm, 48*mm, 28*mm], highlight_rows=[1, 2, 3, 4, 5])


class AeroDocTemplate(BaseDocTemplate):
    def __init__(self, filename, **kwargs):
        super().__init__(filename, **kwargs)
        frame = Frame(self.leftMargin, self.bottomMargin, self.width, self.height, id='normal')
        self.addPageTemplates([PageTemplate(id='aero', frames=frame, onPage=self.draw_page)])

    def draw_page(self, canvas, doc):
        canvas.saveState()
        w, h = landscape(A4)
        canvas.setStrokeColor(LINE)
        canvas.setLineWidth(0.5)
        canvas.line(doc.leftMargin, h - 14*mm, w - doc.rightMargin, h - 14*mm)
        canvas.setFont('Helvetica-Bold', 7)
        canvas.setFillColor(TEAL)
        canvas.drawString(doc.leftMargin, h - 10*mm, 'AEROGO TRAVEL & TOURS  |  FLIGHT DEAL COLLECTION')
        canvas.setFont('Helvetica', 7)
        canvas.setFillColor(MUTED)
        canvas.drawRightString(w - doc.rightMargin, h - 10*mm, 'Taiwan  •  19–22 Nov 2026')
        canvas.line(doc.leftMargin, 10*mm, w - doc.rightMargin, 10*mm)
        canvas.setFont('Helvetica', 7)
        canvas.setFillColor(MUTED)
        canvas.drawString(doc.leftMargin, 6*mm, 'Research evidence only  •  No booking, payment, package assembly, or markup')
        canvas.drawRightString(w - doc.rightMargin, 6*mm, f'Page {doc.page}')
        canvas.restoreState()


def build():
    doc = AeroDocTemplate(str(OUT), pagesize=landscape(A4), leftMargin=12*mm, rightMargin=12*mm, topMargin=19*mm, bottomMargin=15*mm, title='AeroGo Taiwan — Flight Deal Collection — Nov 19–22', author='AeroGo Travel & Tours')
    story = []

    # PAGE 1 — summary
    story += [Spacer(1, 6*mm), P('AeroGo Taiwan — Flight Deal Collection', 'CoverTitle'), P('Manila (MNL) ↔ Taipei (TPE)  |  19–22 November 2026', 'CoverSub')]
    story.append(P('Research summary', 'Kicker'))
    story.append(P('This document collects actual flight-search results and source evidence. It does not select a package, build an itinerary, research hotels or activities, add agency markup, or create a client quotation.', 'BodyAero'))
    story.append(Spacer(1, 2*mm))
    stats = Table([
        [P('10', 'StatValue'), P('2', 'StatValue'), P('4', 'StatValue'), P('5', 'StatValue')],
        [P('distinct offers collected', 'StatLabel'), P('sites with usable fare results', 'StatLabel'), P('sites blocked / no usable exact-date fare', 'StatLabel'), P('passengers searched', 'StatLabel')],
    ], colWidths=[54*mm]*4, rowHeights=[9*mm, 8*mm])
    stats.setStyle(TableStyle([('BACKGROUND', (0,0), (-1,-1), PALE_TEAL), ('BOX', (0,0), (-1,-1), 0.5, LINE), ('INNERGRID', (0,0), (-1,-1), 0.4, LINE), ('VALIGN', (0,0), (-1,-1), 'MIDDLE')]))
    story.append(stats)
    story.append(Spacer(1, 4*mm))
    summary_rows = [
        [P('Search date', 'Kicker'), P('22 September 2026', 'BodyAero'), P('Observation time', 'Kicker'), P(timestamp_note, 'BodyAero')],
        [P('Travelers', 'Kicker'), P('4 adults + 1 child aged 12. Agoda classified age 12 as Adult (12 years and above); the other exact search used 4 adults + 1 child where supported.', 'BodyAero'), P('Cabin', 'Kicker'), P('Economy; minimum 7 kg cabin baggage per passenger required.', 'BodyAero')],
        [P('Search scope', 'Kicker'), P('Round trip MNL–TPE–MNL; 19 Nov 2026 outbound, 22 Nov 2026 return; exact airports and dates used.', 'BodyAero'), P('Price treatment', 'Kicker'), P('Prices are flight-search results only. Taxes and mandatory charges are included where the provider said so. No payment was made and no checkout total was claimed.', 'BodyAero')],
    ]
    t = Table(summary_rows, colWidths=[25*mm, 88*mm, 25*mm, 88*mm])
    t.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP'), ('BACKGROUND', (0,0), (0,-1), PALE), ('BACKGROUND', (2,0), (2,-1), PALE), ('BOX', (0,0), (-1,-1), 0.4, LINE), ('INNERGRID', (0,0), (-1,-1), 0.3, LINE), ('LEFTPADDING', (0,0), (-1,-1), 5), ('RIGHTPADDING', (0,0), (-1,-1), 5), ('TOPPADDING', (0,0), (-1,-1), 5), ('BOTTOMPADDING', (0,0), (-1,-1), 5)]))
    story.append(t)
    story.append(Spacer(1, 4*mm))
    story.append(P('Websites researched', 'H2Aero'))
    story.append(P('<b>Usable exact-date results:</b> Agoda Flights and Skyscanner. <b>No usable exact-date fare:</b> Cebu Pacific, AirAsia, Scoot, and HK Express. The four no-result explanations appear in the site sections below; no invented options were added to fill the lists.', 'BodyAero'))
    story.append(P('<b>Evidence rule:</b> Agoda and Skyscanner rows are labeled SEARCH RESULT. Their displayed prices were not described as confirmed checkout totals. The selected exact searches showed five travelers; group inventory can still change before booking.', 'BodyAero'))
    story.append(Spacer(1, 3*mm))
    story.append(P('Cabin-baggage verification', 'H2Aero'))
    story.append(P('Agoda and Skyscanner exposed a cabin-bag indicator on the listed options. The 7 kg minimum was cross-checked against the applicable carrier policy where available; where the aggregator did not show a fare-family weight line, this report retains the provider badge and separately notes the policy cross-check rather than claiming a checkout-confirmed allowance.', 'BodyAero'))
    story.append(PageBreak())

    # airline sections
    story += section_title('Cebu Pacific results', 'Official source checked separately. No suitable option was recorded because the booking page did not render.')
    story.append(blocked_table([blocked[0]]))
    story.append(Spacer(1, 3*mm))
    story.append(P('Cabin-baggage reference: Cebu Pacific’s official fare-bundle help page describes GO Basic as 7 kg hand-carry only. This is a policy reference, not a fare result for the requested dates.', 'SmallAero'))
    story.append(link('https://help.cebupacificair.com/article/cebu-pacific-fare-bundles-120434', 'Official Cebu Pacific fare-bundle policy', 'SmallAero'))
    story.append(PageBreak())

    story += section_title('AirAsia results', 'Official exact-date search attempted with 4 adults + 1 child, Economy, MNL–TPE–MNL, 19–22 Nov 2026.')
    story.append(blocked_table([blocked[1]]))
    story.append(Spacer(1, 2*mm))
    story.append(P('Route-page context observed separately: AirAsia’s public MNL–TPE page exposed date-card content, but the exact round-trip booking search was blocked by Cloudflare. The route-page content was not used as a round-trip five-passenger offer.', 'BodyAero'))
    story.append(link('https://www.airasia.com/flights/from-manila-mnl-to-taipei-tpe/', 'AirAsia route page', 'SmallAero'))
    story.append(link('https://newsroom.airasia.com/stories/2026/4/4/airasia-philippines-urges-guests-to-check-baggage-allowance-ahead-of-postholy-week-travel-surge', 'AirAsia Philippines 7 kg cabin-baggage policy', 'SmallAero'))
    story.append(PageBreak())

    story += section_title('Scoot results', 'Official MNL–TPE route page checked separately. No exact-date suitable fare card was available to record.')
    story.append(blocked_table([blocked[2]]))
    story.append(Spacer(1, 2*mm))
    story.append(P('The public route page stated that a Manila–Taipei Economy flight comes with a 10 kg cabin-baggage allowance, but its Nov 2026 date view did not expose a matching fare card for the requested exact dates. No price or flight number was invented.', 'BodyAero'))
    story.append(link('https://www.flyscoot.com/en/plan/booking-your-flight/baggage', 'Scoot official cabin-baggage policy', 'SmallAero'))
    story.append(PageBreak())

    story += section_title('HK Express results', 'Official booking widget checked separately. No suitable exact-date itinerary was recorded.')
    story.append(blocked_table([blocked[3]]))
    story.append(Spacer(1, 2*mm))
    story.append(P('The booking widget was set to Round Trip and five adults (age 12 treated as adult). The origin selector exposed Manila (MNL), but the requested MNL–TPE search did not surface a usable itinerary in the accessible widget. HK Express fare families also differ in cabin-bag treatment: Ultra Lite / Essential may provide only a small personal item, while Lite / Max provide a combined 7 kg allowance; any future fare would need fare-family verification.', 'BodyAero'))
    story.append(link('https://www.hkexpress.com/Plan/Extras/Baggage/Carry-On-Baggage', 'HK Express official carry-on policy', 'SmallAero'))
    story.append(PageBreak())

    # Agoda
    story += section_title('Agoda results', 'Exact search: MNL to TPE, 19 Nov 2026; return 22 Nov 2026; Economy; 5 adults in Agoda because its passenger rule classifies age 12 as adult.')
    story.append(P('Agoda displayed round-trip prices per passenger with taxes and fees included, then displayed a total for five passengers after the outbound was selected. The five rows below use one lowest-price outbound (Philippines AirAsia Z2 126) paired with five different return results. All listed rows were direct and carried a Cabin bag badge.', 'BodyAero'))
    story.append(opt_table(agoda, agoda_url))
    story.append(Spacer(1, 3*mm))
    story.append(P('Source and evidence', 'H2Aero'))
    story.append(link(agoda_url, 'Open exact Agoda search URL', 'SmallAero'))
    story.append(P('Evidence status for every Agoda row: SEARCH RESULT. No customer details, booking confirmation, payment, or checkout total was completed. Flight numbers not exposed by the result card are explicitly marked as not displayed.', 'SmallAero'))
    story.append(PageBreak())

    # Skyscanner
    story += section_title('Skyscanner results', 'Exact search: MNL–TPE–MNL, 19–22 Nov 2026, 4 adults + 1 child, Economy, Carry-on bag filter applied.')
    story.append(P('Skyscanner showed exact-date result cards and a displayed total for five travelers. The rows below are the five lowest distinct suitable result cards observed after applying the Carry-on bag filter. All were direct. The provider UI did not expose flight numbers for these cards, so the report preserves the schedule and marks the flight number as not displayed.', 'BodyAero'))
    story.append(opt_table(skyscanner, skyscanner_url))
    story.append(Spacer(1, 3*mm))
    story.append(P('Source and evidence', 'H2Aero'))
    story.append(link(skyscanner_url, 'Open exact Skyscanner search URL with carry-on filter', 'SmallAero'))
    story.append(P('Evidence status for every Skyscanner row: SEARCH RESULT. Skyscanner stated that prices include taxes and charges and may change with availability. A supplementary higher-priced provider variant was observed for the same China Airlines schedule via Trip.com, but it was not included in this five-row distinct-offer list because the requested top five were retained.', 'SmallAero'))
    story.append(PageBreak())

    # Consolidated
    story += section_title('Consolidated comparison', 'All 10 distinct suitable offers collected, sorted by displayed total airfare for five passengers.')
    story.append(P('The five lowest displayed totals are highlighted. This is a comparison of collected offers only, not a recommendation or package decision. Agoda and Skyscanner can show different provider pricing for the same or similar operating flights; the provider is retained in every row.', 'BodyAero'))
    story.append(consolidate())
    story.append(Spacer(1, 3*mm))
    story.append(P('Highlights', 'H2Aero'))
    story.append(P('Lowest five displayed totals: SKY01 PHP 62,728; SKY02 PHP 64,837; AGO01 PHP 67,165; SKY03 PHP 67,444; SKY04 PHP 69,422. These are search-result totals, not confirmed checkout totals.', 'BodyAero'))
    story.append(PageBreak())

    # QA / source appendix
    story += section_title('Evidence notes and quality control', 'Source URLs and verification notes retained for later analysis.')
    story.append(P('Source URLs', 'H2Aero'))
    sources = [
        ('Agoda exact passenger/date search', agoda_url),
        ('Skyscanner exact search with carry-on filter', skyscanner_url),
        ('Cebu Pacific official homepage', 'https://www.cebupacificair.com/en-PH/'),
        ('AirAsia exact search URL', airasia_url),
        ('Scoot Manila–Taipei route page', 'https://www.flyscoot.com/flights/en-ph/flights-from-manila-to-taipei/'),
        ('HK Express official homepage / booking widget', 'https://www.hkexpress.com/en'),
        ('Cebu Pacific fare-bundle baggage policy', 'https://help.cebupacificair.com/article/cebu-pacific-fare-bundles-120434'),
        ('AirAsia Philippines cabin-baggage policy', 'https://newsroom.airasia.com/stories/2026/4/4/airasia-philippines-urges-guests-to-check-baggage-allowance-ahead-of-postholy-week-travel-surge'),
        ('Scoot cabin-baggage policy', 'https://www.flyscoot.com/en/plan/booking-your-flight/baggage'),
        ('HK Express carry-on policy', 'https://www.hkexpress.com/Plan/Extras/Baggage/Carry-On-Baggage'),
        ('STARLUX carry-on policy', 'https://www.starlux-airlines.com/en-TH/check-in-fly/baggage-information/general/carry-on-baggage'),
        ('China Airlines cabin-baggage policy', 'https://www.china-airlines.com/hk/en/fly/prepare-for-the-fly/baggage/cabin-baggage'),
        ('EVA Air baggage FAQ', 'https://www.evaair.com/en-fr/customer-services/faq/detail.html?FaqCategories=at-the-airport'),
    ]
    for label, url in sources:
        story.append(link(url, f'{label} — {url}', 'SmallAero'))
    story.append(Spacer(1, 2*mm))
    story.append(P('Verification labels used', 'H2Aero'))
    story.extend(bullets([
        'SEARCH RESULT — price and schedule were visible on the search-result page; no claim of checkout confirmation.',
        'BOOKING REVIEW — not used; no customer information was submitted.',
        'CHECKOUT TOTAL — not used; no booking or payment was made.',
        'UNAVAILABLE / BLOCKED — exact-date research could not yield a usable fare because the page was blocked, blank, or returned no matching fare card.',
    ]))
    story.append(P('Quality-control checks completed: dates are Nov 19–22, 2026; airports are Manila Ninoy Aquino (MNL) and Taipei Taoyuan (TPE); economy cabin was used; the age-12 traveler was treated as adult where the provider required it; the 7 kg cabin-bag requirement was kept visible in every suitable row; checked baggage was not added to fares that did not show it; prices were kept separate from the PHP 27,988 package benchmark.', 'BodyAero'))
    story.append(P('Screenshot evidence note: browser UI evidence was available during the live research session, including the Skyscanner and Agoda result cards and the AirAsia Cloudflare obstacle. The browser connector did not export those live screenshots as local image files, so this PDF preserves the source URLs, exact search parameters, visible schedules, prices, provider notes, and obstacle text instead of presenting reconstructed screenshots.', 'SmallAero'))

    doc.build(story)
    print(OUT)


if __name__ == '__main__':
    build()
