from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.lib.colors import HexColor
from datetime import datetime
import os, math

OUT = "/Users/esguerra/Desktop/aerogotours/output/pdf/AeroGo_Taiwan_Hotel_Deal_Collection_Nov19-22_2026.pdf"
os.makedirs(os.path.dirname(OUT), exist_ok=True)

NAVY = HexColor('#12304A')
TEAL = HexColor('#0C7C86')
ORANGE = HexColor('#E67E22')
LIGHT = HexColor('#F3F7F9')
PALE = HexColor('#EAF3F5')
GREY = HexColor('#5F6B72')
GREEN = HexColor('#DFF1E6')
YELLOW = HexColor('#FFF1CF')
RED = HexColor('#F9E0E0')
WHITE = colors.white

styles = getSampleStyleSheet()
styles.add(ParagraphStyle('CoverTitle', parent=styles['Title'], fontName='Helvetica-Bold', fontSize=24, leading=29, textColor=NAVY, spaceAfter=8))
styles.add(ParagraphStyle('CoverSub', parent=styles['Normal'], fontName='Helvetica', fontSize=12, leading=16, textColor=GREY))
styles.add(ParagraphStyle('H1x', parent=styles['Heading1'], fontName='Helvetica-Bold', fontSize=16, leading=20, textColor=NAVY, spaceBefore=4, spaceAfter=8))
styles.add(ParagraphStyle('H2x', parent=styles['Heading2'], fontName='Helvetica-Bold', fontSize=11.5, leading=14, textColor=TEAL, spaceBefore=7, spaceAfter=5))
styles.add(ParagraphStyle('Bodyx', parent=styles['BodyText'], fontName='Helvetica', fontSize=8.5, leading=11, textColor=HexColor('#1D2830'), spaceAfter=4))
styles.add(ParagraphStyle('Smallx', parent=styles['BodyText'], fontName='Helvetica', fontSize=7, leading=8.5, textColor=GREY, spaceAfter=2))
styles.add(ParagraphStyle('Tinyx', parent=styles['BodyText'], fontName='Helvetica', fontSize=5.8, leading=7, textColor=GREY))
styles.add(ParagraphStyle('Cell', parent=styles['BodyText'], fontName='Helvetica', fontSize=6.5, leading=7.6, textColor=HexColor('#1D2830')))
styles.add(ParagraphStyle('CellSmall', parent=styles['BodyText'], fontName='Helvetica', fontSize=5.7, leading=6.7, textColor=HexColor('#1D2830')))
styles.add(ParagraphStyle('CellHead', parent=styles['BodyText'], fontName='Helvetica-Bold', fontSize=6.4, leading=7.4, textColor=WHITE))
styles.add(ParagraphStyle('Callout', parent=styles['BodyText'], fontName='Helvetica-Bold', fontSize=8.2, leading=10.5, textColor=NAVY, backColor=PALE, borderColor=TEAL, borderWidth=.6, borderPadding=6, spaceAfter=7))

def P(txt, style='Bodyx'):
    txt = str(txt).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
    return Paragraph(txt, styles[style])

def link(url):
    safe = url.replace('&','&amp;')
    return Paragraph('<font color="#0C7C86"><u>%s</u></font>' % safe, styles['Tinyx'])

def money(n):
    return 'P{:,.0f}'.format(n)

def header_footer(canvas, doc):
    canvas.saveState()
    w, h = landscape(A4)
    canvas.setFillColor(NAVY)
    canvas.rect(0, h-9*mm, w, 9*mm, fill=1, stroke=0)
    canvas.setFillColor(WHITE)
    canvas.setFont('Helvetica-Bold', 7.5)
    canvas.drawString(12*mm, h-6.2*mm, 'AEROGO | TAIWAN HOTEL DEAL COLLECTION')
    canvas.setFillColor(GREY)
    canvas.setFont('Helvetica', 7)
    canvas.drawString(12*mm, 6*mm, 'Research only - no booking, payment, itinerary, package, markup, or quotation')
    canvas.drawRightString(w-12*mm, 6*mm, 'Page %d' % doc.page)
    canvas.restoreState()

def section_title(title, subtitle=None):
    out = [P(title, 'H1x')]
    if subtitle: out.append(P(subtitle, 'Smallx'))
    return out

def make_table(headers, rows, widths, small=False, highlight_ids=None):
    st = 'CellSmall' if small else 'Cell'
    data = [[P(h, 'CellHead') for h in headers]]
    for r in rows:
        data.append([x if hasattr(x, 'wrap') else P(x, st) for x in r])
    t = Table(data, colWidths=widths, repeatRows=1, hAlign='LEFT')
    cmds = [
        ('BACKGROUND',(0,0),(-1,0),NAVY),
        ('TEXTCOLOR',(0,0),(-1,0),WHITE),
        ('VALIGN',(0,0),(-1,-1),'TOP'),
        ('GRID',(0,0),(-1,-1),.25,HexColor('#C7D2D7')),
        ('LEFTPADDING',(0,0),(-1,-1),4),('RIGHTPADDING',(0,0),(-1,-1),4),
        ('TOPPADDING',(0,0),(-1,-1),4),('BOTTOMPADDING',(0,0),(-1,-1),4),
    ]
    for i in range(1,len(data)):
        cmds.append(('BACKGROUND',(0,i),(-1,i), WHITE if i%2 else LIGHT))
        if highlight_ids and str(data[i][0].text if hasattr(data[i][0],'text') else '') in highlight_ids:
            cmds.append(('BACKGROUND',(0,i),(-1,i),GREEN))
    t.setStyle(TableStyle(cmds))
    return t

TP = [
    dict(id='TP01', hotel='UrbanAbode2-DUGU', city='Taipei / Zhongzheng', stars='4-star', rating='9.0 / 1,163', rooms='1 studio', beds='Superior Studio: 3 beds (2 queens + 1 sofa bed)', total=38337, breakfast='Not shown', cancel='Not shown', pay='Not shown', loc='150 m from downtown; Subway Access', url='https://www.booking.com/hotel/tw/suo-zai-xing-lu-du-gu-suo-zai-urban-abode-dugu.html', note='Booking search accepted 4 adults + 1 child in one studio. Confirm that the sofa bed is made up for the 12-year-old.'),
    dict(id='TP02', hotel='Finders Hotel-Fu Qian', city='Taipei / Zhongzheng', stars='3-star', rating='8.2 / 3,584', rooms='2 rooms', beds='2 x Standard Double, 2 full beds each (4 beds)', total=39442, breakfast='Not shown', cancel='Free cancellation', pay='Pay at property; no prepayment', loc='0.6 km from downtown; Subway Access', url='https://www.booking.com/hotel/tw/chaiin-hotel-tzung-tung-fu.html', note='Two-room allocation; Booking card also says free stay for child. Verify age-12 policy and actual simultaneous inventory.'),
    dict(id='TP03', hotel='Artinn Taipei Station', city='Taipei / Zhongzheng', stars='3-star', rating='7.8 / 4,068', rooms='2 rooms', beds='Double: 1 queen + Triple: 1 twin + 1 queen', total=41287, breakfast='Not shown', cancel='Free cancellation', pay='Not shown', loc='0.5 km from downtown; Subway Access', url='https://www.booking.com/hotel/tw/yi-zhu-cheng-xi-xing-lu-tai-bei-zhan-qian-guan.html', note='Preferred 3+2 arrangement; room cards name all four beds.'),
    dict(id='TP04', hotel='Ifinn Hotel', city='Taipei / Datong', stars='3-star', rating='7.9 / 1,478', rooms='2 rooms', beds='Executive Suite: 1 queen + Superior Family: 2 queens', total=42148, breakfast='Not shown', cancel='Free cancellation', pay='Pay at property; no prepayment', loc='1.6 km from downtown; Subway Access', url='https://www.booking.com/hotel/tw/ifinn.html', note='Preferred 3+2 arrangement; confirm child policy and room adjacency is not implied.'),
    dict(id='TP05', hotel='KDM Hotel', city='Taipei / Daan', stars='3-star', rating='8.0 / 1,140', rooms='2 rooms', beds='Business Double: 1 full + Triple: 1 twin + 1 full', total=45094, breakfast='Not shown', cancel='Free cancellation', pay='Not shown', loc='1.7 km from downtown; Subway Access', url='https://www.booking.com/hotel/tw/kdm.html', note='Preferred 3+2 arrangement; official site says next to Zhongxiao Xinsheng MRT Exit 3.'),
    dict(id='TP06', hotel='Golden Garden Hotel', city='Taipei / Songshan', stars='3-star', rating='8.2 / 1,410', rooms='2 rooms', beds='Double: 1 full + Executive Triple: 1 twin + 1 full', total=45284, breakfast='Included', cancel='Free cancellation', pay='Not shown', loc='4.6 km from downtown; Subway Access', url='https://www.booking.com/hotel/tw/pu-yuan-fan-dian.html', note='Supplementary value listing; breakfast included, but farther from downtown.'),
]

TC = [
    dict(id='TC01', hotel='Hotel Leisure Taichung', city='Taichung / Central', stars='4-star', rating='7.7 / 1,905', rooms='2 rooms', beds='Dorm bed: 1 twin + Deluxe Family: 2 full beds', total=3470, breakfast='Not shown', cancel='Free cancellation', pay='Pay at property; no prepayment', loc='4.7 km from downtown; station not shown', url='https://www.booking.com/hotel/tw/plazahotel.html', note='Lowest card price, but one traveler is in a shared mixed dorm. Include only as a nontraditional option.'),
    dict(id='TC02', hotel='Palmer Hotel', city='Taichung / Central', stars='3-star', rating='8.3 / 3,225', rooms='2 rooms', beds='Twin: 2 twins + Triple: 1 twin + 1 full', total=4153, breakfast='Not shown', cancel='Free cancellation', pay='Not shown', loc='4.6 km from downtown; station not shown', url='https://www.booking.com/hotel/tw/vip-hotel.html', note='Preferred 3+2 arrangement; no-window twin and noise-tolerance note shown.'),
    dict(id='TC03', hotel='Chance Hotel', city='Taichung / Central', stars='3-star', rating='8.3 / 4,331', rooms='2 rooms', beds='Double: 1 full + Triple: 1 twin + 1 full', total=4350, breakfast='Not shown', cancel='Free cancellation', pay='Not shown', loc='4.7 km from downtown; station not shown', url='https://www.booking.com/hotel/tw/qiao-he-hotel.html', note='Preferred 3+2 arrangement; exact child policy should be reconfirmed at room review.'),
    dict(id='TC04', hotel='Fosen Hotel', city='Taichung / North', stars='4-star', rating='8.8 / 317', rooms='2 rooms', beds='Run of House: 1 full + Standard Twin: 2 full beds', total=6019, breakfast='Not shown', cancel='Free cancellation', pay='Pay at property; no prepayment', loc='3.4 km from downtown; station not shown', url='https://www.booking.com/hotel/tw/feng-sen-fan-dian.html', note='Search accepted 4 adults + 1 child; Run of House bed assignment must be confirmed.'),
    dict(id='TC05', hotel='MINI HOTELS (Taichung Station)', city='Taichung / East', stars='4-star', rating='8.5 / 3,690', rooms='2 rooms', beds='Run of House: 1 full + Triple: 1 twin + 1 full', total=5375, breakfast='Not shown', cancel='Free cancellation', pay='Pay at property; no prepayment', loc='5.2 km from downtown; near Taichung station area', url='https://www.booking.com/hotel/tw/mini-hotels-tai-zhong-huo-che-zhan-guan.html', note='Preferred 3+2 arrangement, but Run of House room type needs final bed confirmation.'),
    dict(id='TC06', hotel='Twinstar Hotel', city='Taichung / East', stars='3-star', rating='8.1 / 4,343', rooms='2 rooms', beds='Double: 1 full + Triple: 1 twin + 1 full', total=5934, breakfast='Included', cancel='Free cancellation', pay='Pay at property; no prepayment', loc='5 km from downtown; official site says 1 minute walk to Taichung train station', url='https://www.booking.com/hotel/tw/twinstar.html', note='Breakfast included; official hotel site confirms train-station proximity.'),
    dict(id='TC07', hotel='Hotel 7 Taichung', city='Taichung / Xitun', stars='4-star', rating='8.6 / 2,387', rooms='2 rooms', beds='Double: 1 full + Triple: 1 twin + 1 full', total=7864, breakfast='Not shown', cancel='Free cancellation', pay='Pay at property; no prepayment', loc='2.5 km from downtown; station not shown', url='https://www.booking.com/hotel/tw/se7en-taichung-fuxin.html', note='Limited-time deal; preferred 3+2 arrangement.'),
    dict(id='TC08', hotel='Airline Inn Green Park Way', city='Taichung / West', stars='4-star', rating='8.8 / 2,107', rooms='2 rooms', beds='Double: 1 full + Triple: multiple bed types', total=9291, breakfast='Triple breakfast included', cancel='Free cancellation', pay='Pay at property; no prepayment', loc='1.7 km from downtown; station not shown', url='https://www.booking.com/hotel/tw/tou-deng-cang-fan-dian-lu-yuan-dao-guan.html', note='Official site describes central West District location; triple bed types were not fully enumerated.'),
]

TP2 = [
    dict(id='TPB01', hotel='UrbanAbode2-DUGU', city='Taipei / Zhongzheng', stars='4-star', rating='9.0 / 1,163', rooms='1 studio', beds='Superior Studio: 3 beds (2 queens + 1 sofa bed)', total=27262, breakfast='Not shown', cancel='Not shown', pay='Not shown', loc='150 m from downtown; Subway Access', url='https://www.booking.com/hotel/tw/suo-zai-xing-lu-du-gu-suo-zai-urban-abode-dugu.html', note='2 nights Nov 20-22; one studio; sofa-bed setup needs age-12 confirmation.'),
    dict(id='TPB02', hotel='Artinn Taipei Station', city='Taipei / Zhongzheng', stars='3-star', rating='7.8 / 4,068', rooms='2 rooms', beds='Double: 1 queen + Triple: 1 twin + 1 queen', total=33061, breakfast='Not shown', cancel='Free cancellation', pay='Not shown', loc='0.5 km from downtown; Subway Access', url='https://www.booking.com/hotel/tw/yi-zhu-cheng-xi-xing-lu-tai-bei-zhan-qian-guan.html', note='2 nights Nov 20-22; preferred 3+2 arrangement.'),
    dict(id='TPB03', hotel='Golden Garden Hotel', city='Taipei / Songshan', stars='3-star', rating='8.2 / 1,410', rooms='2 rooms', beds='Double: 1 full + Executive Triple: 1 twin + 1 full', total=34645, breakfast='Included', cancel='Free cancellation', pay='Not shown', loc='4.6 km from downtown; Subway Access', url='https://www.booking.com/hotel/tw/pu-yuan-fan-dian.html', note='2 nights Nov 20-22; breakfast included.'),
    dict(id='TPB04', hotel='KDM Hotel', city='Taipei / Daan', stars='3-star', rating='8.0 / 1,140', rooms='2 rooms', beds='Double: 1 full + Triple: 1 twin + 1 full', total=34992, breakfast='Not shown', cancel='Free cancellation', pay='Not shown', loc='1.7 km from downtown; Subway Access', url='https://www.booking.com/hotel/tw/kdm.html', note='2 nights Nov 20-22; official site says next to Zhongxiao Xinsheng MRT Exit 3.'),
    dict(id='TPB05', hotel='Finders Hotel-Fu Qian', city='Taipei / Zhongzheng', stars='3-star', rating='8.2 / 3,584', rooms='2 rooms', beds='2 x Standard Double: 2 full beds each', total=31972, breakfast='Not shown', cancel='Free cancellation', pay='Pay at property; no prepayment', loc='0.6 km from downtown; Subway Access', url='https://www.booking.com/hotel/tw/chaiin-hotel-tzung-tung-fu.html', note='2 nights Nov 20-22; card says free stay for child; verify age-12 policy.'),
]

EXP = [
    ('EX01','Chian Huei Business Hotel','Taipei','8.2 / 367','$269',16865,'Fully refundable; room layout not shown; 1 left','https://www.expedia.com/Hotel-Search?checkIn=2026-11-19&checkOut=2026-11-22&childAges=12&rooms=2&destination=Taipei%2C+Taiwan'),
    ('EX02','Dongmen Hotel','Taipei','8.0 / 270','$416',26081,'Fully refundable; room layout not shown; 2 left','https://www.expedia.com/Hotel-Search?checkIn=2026-11-19&checkOut=2026-11-22&childAges=12&rooms=2&destination=Taipei%2C+Taiwan'),
    ('EX03','Thinker Hotel','New Taipei City','9.0 / 108','$439',27531,'Fully refundable; extra beds/cribs noted; layout not shown; 1 left','https://www.expedia.com/Hotel-Search?checkIn=2026-11-19&checkOut=2026-11-22&childAges=12&rooms=2&destination=Taipei%2C+Taiwan'),
    ('EX04','Nihao Cafe Hotel','Taipei','8.8 / 202','$485',30407,'Fully refundable; room layout not shown; 1 left','https://www.expedia.com/Hotel-Search?checkIn=2026-11-19&checkOut=2026-11-22&childAges=12&rooms=2&destination=Taipei%2C+Taiwan'),
    ('EX05','Taipei Star Beauty Resort Hotel','Taipei / Shilin','8.2 / 792','$609',38186,'Fully refundable; room layout not shown; 5 left','https://www.expedia.com/Hotel-Search?checkIn=2026-11-19&checkOut=2026-11-22&childAges=12&rooms=2&destination=Taipei%2C+Taiwan'),
]

HT = [
    ('HT01','Chian Huei Business Hotel','Datong','8.2 / 367',17268,'Fully refundable; room layout not shown; 1 left','https://ph.hotels.com/ho620760/chian-huei-business-hotel-taipei-taiwan/'),
    ('HT02','Cai She Hotel','Zhongshan','7.4 / 121',24527,'Fully refundable; room layout not shown; 3 left','https://ph.hotels.com/Hotel-Search?destination=Taipei%2C%20Taiwan'),
    ('HT03','Shin Shin Hotel','Wanhua','7.4 / 221',24696,'Fully refundable; room layout not shown; 3 left','https://ph.hotels.com/Hotel-Search?destination=Taipei%2C%20Taiwan'),
    ('HT04','New May Flower Hotel','Zhongzheng','6.4 / 314',26409,'Fully refundable; low review score; room layout not shown; 2 left','https://ph.hotels.com/Hotel-Search?destination=Taipei%2C%20Taiwan'),
    ('HT05','Dongmen Hotel','Taipei','8.0 / 270',27483,'Fully refundable; room layout not shown; 2 left','https://ph.hotels.com/Hotel-Search?destination=Taipei%2C%20Taiwan'),
]

def offer_rows(items, status='SEARCH RESULT'):
    rows=[]
    for x in items:
        rows.append([x['id'], x['hotel'], x['city'], x['stars'], x['rating'], x['rooms'], x['beds'], money(x['total']), x['breakfast'], x['cancel'], x['loc'], status])
    return rows

story=[]
story += [Spacer(1, 20*mm), P('AeroGo Taiwan - Hotel Deal Collection - Nov 19-22', 'CoverTitle'), P('Accommodation evidence report | Taipei-only and Taichung + Taipei scenarios', 'CoverSub'), Spacer(1, 7*mm)]
story += [P('Prepared for AeroGo Travel & Tours', 'H2x'), P('Research date: September 22, 2026 (Asia/Manila). Prices and availability are live search observations and may change. No reservations or payments were made.', 'Bodyx')]
story += [Spacer(1, 4*mm), P('Research brief', 'H2x')]
summary_rows = [
    ['Destination','Taiwan: Taipei and Taichung'],
    ['Dates','Taipei-only: Nov 19-22, 2026 (3 nights). Split: Taichung Nov 19-20 (1 night) + Taipei Nov 20-22 (2 nights).'],
    ['Guests','4 adults + 1 child age 12 (5 guests total). Child age was entered as 12 where the search engine allowed it.'],
    ['Room rule','Preferred 3+2: one triple plus one double/twin. Alternative two doubles/twins plus single. All prices below cover the full five-person search party unless explicitly marked unverified.'],
    ['Currency','Booking.com and Hotels.com displayed PHP. Expedia displayed USD; converted at USD 1 = PHP 62.694, observed Sep 22, 2026. Conversion is for comparison only and is not a provider quote.'],
    ['Priced records','29 priced offer records: 6 Taipei Booking.com offers, 8 Taichung Booking.com offers, 5 Taipei split-date Booking.com offers, 5 Expedia candidates, and 5 Hotels.com candidates. Google Hotels and official sites were checked for discovery/location context; no additional dated group total was captured.'],
]
story.append(make_table(['Item','Research finding'], summary_rows, [35*mm, 232*mm]))
story += [Spacer(1, 4*mm), P('Website coverage', 'H2x')]
coverage = [
    ['Agoda','Configured Taipei, Nov 19-22, 2 rooms, 4 adults + 1 child age 12. Search redirected to Agoda Activities; no hotel rate recorded.','UNAVAILABLE / BLOCKED'],
    ['Booking.com','Exact Taipei and Taichung searches; named rooms/beds, taxes, cancellation and totals visible.','SEARCH RESULT'],
    ['Trip.com','Search returned Beijing results despite Taipei query and did not retain the two-room setup. No Taiwan offer recorded.','UNAVAILABLE / BLOCKED'],
    ['Expedia','Exact Taipei dates and party in URL/result page; result cards showed total incl. taxes/fees but not room layouts.','SEARCH RESULT - ROOM DETAIL UNVERIFIED'],
    ['Hotels.com','Exact Taipei dates and party in URL/result page; result cards showed total incl. taxes/fees but not room layouts.','SEARCH RESULT - ROOM DETAIL UNVERIFIED'],
    ['Google Hotels','Used for deal discovery only; generic Taipei hotel landing page exposed, not a dated five-person quote.','DISCOVERY ONLY'],
    ['Official sites','Checked selected properties for location and direct-site context. No dated group rate was used without a visible quote.','LOCATION / SOURCE CONTEXT'],
]
story.append(make_table(['Website','Coverage','Status'], coverage, [30*mm, 190*mm, 47*mm], small=True))
story += [Spacer(1, 4*mm), P('Verification labels used', 'H2x'), P('SEARCH RESULT means the total was visible on the provider result page. BOOKING REVIEW and CHECKOUT TOTAL were not reached because no booking was made. UNAVAILABLE / BLOCKED means the engine did not return a usable Taiwan hotel result. “Suitable” in the verified tables means the result card itself exposed a five-person accepted search and named enough beds; simultaneous inventory and the hotel\'s final child-age policy still require confirmation.', 'Bodyx'), PageBreak()]

story += section_title('Section 2 - Agoda results', 'Individual website visit: agoda.com')
story += [P('The Agoda hotel form was configured for Taipei, Nov 19-22, 2026, 2 rooms, 4 adults and 1 child aged 12. On pressing search, the site redirected to an Agoda Activities search page instead of hotel results. No Agoda hotel price, room type, tax total or availability was recorded. This is reported as an obstacle, not as a zero-price result.', 'Callout'), link('https://www.agoda.com/'), Spacer(1, 3*mm), P('Verification status: UNAVAILABLE / BLOCKED. Screenshot: live browser state was captured during research, but the browser connector did not export a local image file; exact form settings and redirect are preserved above.', 'Smallx'), PageBreak()]

story += section_title('Section 3 - Booking.com results: Taipei-only', 'Exact search: Taipei | Nov 19-22, 2026 | 4 adults + 1 child age 12 | 2 rooms')
story += [P('These are the main verified Taipei-only records. Booking.com result cards explicitly showed 3 nights, 4 adults, 1 child, named room types and beds, and “includes taxes and fees.”', 'Bodyx')]
story.append(make_table(['ID','Property / area','Class / score','Rooms','Named beds','Total 3N','Breakfast','Cancel / pay','Location','Status'], offer_rows(TP), [11*mm,35*mm,25*mm,19*mm,42*mm,18*mm,18*mm,28*mm,35*mm,18*mm], small=True))
story += [Spacer(1, 3*mm), P('Source URLs and notes', 'H2x')]
for x in TP:
    story += [P('%s - %s: %s' % (x['id'], x['hotel'], x['note']), 'Smallx'), link(x['url'])]
story.append(PageBreak())

story += section_title('Section 4 - Booking.com results: Taichung one-night options', 'Exact search: Taichung | Nov 19-20, 2026 | 4 adults + 1 child age 12 | 2 rooms')
story += [P('These offers are the Taichung leg for Scenario B. All cards showed 1 night, 4 adults, 1 child and included taxes and fees. Most expose the preferred 3+2 layout. Hotel Leisure is retained as a cheaper nontraditional option because one bed is in a mixed dormitory room.', 'Bodyx')]
story.append(make_table(['ID','Property / area','Class / score','Rooms','Named beds','Total 1N','Breakfast','Cancel / pay','Location','Status'], offer_rows(TC), [11*mm,35*mm,25*mm,19*mm,42*mm,18*mm,18*mm,28*mm,35*mm,18*mm], small=True))
story += [Spacer(1, 3*mm), P('Source URLs and notes', 'H2x')]
for x in TC:
    story += [P('%s - %s: %s' % (x['id'], x['hotel'], x['note']), 'Smallx'), link(x['url'])]
story.append(PageBreak())

story += section_title('Section 5 - Booking.com results: Taipei two-night options', 'Exact search: Taipei | Nov 20-22, 2026 | 4 adults + 1 child age 12 | 2 rooms')
story += [P('These offers are the Taipei leg for Scenario B. They are not the same stay dates as the Taipei-only search, so they are kept as separate offer records.', 'Bodyx')]
story.append(make_table(['ID','Property / area','Class / score','Rooms','Named beds','Total 2N','Breakfast','Cancel / pay','Location','Status'], offer_rows(TP2), [11*mm,35*mm,25*mm,19*mm,42*mm,18*mm,18*mm,28*mm,35*mm,18*mm], small=True))
story.append(PageBreak())

story += section_title('Section 6 - Trip.com results', 'Individual website visit: trip.com')
story += [P('The Trip.com search URL carried Taipei, Nov 19-22, 2026, 4 adults, 1 child age 12 and room quantity 2, but the page returned Beijing Hotels. The visible traveler control also displayed 1 room. Because the destination and room allocation were wrong, no Trip.com Taiwan offer was recorded.', 'Callout'), link('https://www.trip.com/hotels/'), P('Verification status: UNAVAILABLE / BLOCKED. This section intentionally contains no invented hotel names or prices.', 'Smallx'), PageBreak()]

story += section_title('Section 7 - Expedia results', 'Exact Taipei search page; provider currency USD')
story += [P('Expedia returned exact Nov 19-22 dates and a 5-traveler query in the URL. The visible result cards displayed totals with taxes and fees, but they did not expose the room type or bed configuration. Some cards said “for 2 rooms,” while the visible traveler control showed 1 room. These are retained as deal-discovery candidates only and are not counted as suitable verified offers.', 'Callout')]
exp_rows = []
for i,h,city,rat,usd,php,terms,url in EXP:
    exp_rows.append([i,h,city,rat,usd,money(php),terms,'SEARCH RESULT - ROOM DETAIL UNVERIFIED'])
story.append(make_table(['ID','Property','Area','Score','Provider total','PHP equiv.','Terms / stock signal','Status'], exp_rows, [12*mm,37*mm,24*mm,22*mm,22*mm,22*mm,82*mm,36*mm], small=True))
story += [Spacer(1, 3*mm), P('Provider search URL', 'H2x'), link('https://www.expedia.com/Hotel-Search?checkIn=2026-11-19&checkOut=2026-11-22&childAges=12&rooms=2&destination=Taipei%2C+Taiwan'), P('Currency conversion source: USD/PHP close 62.694 on Sep 22, 2026. Expedia totals were shown as total with taxes and fees. No payment or checkout was performed.', 'Smallx'), PageBreak()]

story += section_title('Section 8 - Hotels.com results', 'Exact Taipei search page; provider currency PHP')
story += [P('Hotels.com returned exact Nov 19-22 dates and “includes taxes & fees.” The URL carried 2 rooms, but the visible traveler control displayed 1 room, and result cards did not show room types or beds. These are therefore unverified candidates, not suitable five-person offers. New May Flower is kept for completeness despite its lower 6.4 score; it should not be treated as a quality recommendation.', 'Callout')]
ht_rows=[]
for i,h,area,rat,total,terms,url in HT:
    ht_rows.append([i,h,area,rat,money(total),terms,'SEARCH RESULT - ROOM DETAIL UNVERIFIED'])
story.append(make_table(['ID','Property','Area','Score','Provider total','Terms / stock signal','Status'], ht_rows, [12*mm,42*mm,24*mm,22*mm,25*mm,92*mm,40*mm], small=True))
story += [Spacer(1,3*mm), P('Provider search URL', 'H2x'), link('https://ph.hotels.com/Hotel-Search?destination=Taipei%2C%20Taiwan&checkIn=2026-11-19&checkOut=2026-11-22&adults=4&children=1_10&childAges=12&rooms=2'), PageBreak()]

story += section_title('Section 9 - Useful official hotel websites and Google Hotels discovery')
story += [P('No official-site dated five-person rate was used unless a rate and full room arrangement were visible. The links below are source context for location, property identity, and direct-rate follow-up.', 'Bodyx')]
official = [
    ['Finders Hotel Fu Qian','Taipei / Zhongzheng','Official page describes a central themed hotel; search snippet says about 5 minutes from MRT.','https://fuqian.findershotel.com/en'],
    ['KDM Hotel','Taipei / Daan','Official page says next to Zhongxiao Xinsheng MRT Exit 3; useful location verification for TP05 / TPB04.','https://www.kdmhotel.com.tw/?lang=en'],
    ['Twinstar Hotel','Taichung / East','Official page says 1 minute walk from the new Taichung train station and lists double, triple and family room types.','https://twinstar.etaichung.com.tw/en'],
    ['Airline Inn Green Park Way','Taichung / West','Official page describes a central West District base within walking distance of attractions.','https://www.airlineinn.com/GPW/en/'],
    ['Google Hotels landing page','Taipei City','Used for deal discovery and property cross-checking; no dated 5-guest quote captured in this run.','https://www.google.com/travel/hotels/landingpage/taipei-city-hotels'],
]
story.append(make_table(['Property / source','City / area','Evidence context','URL'], official, [38*mm,32*mm,128*mm,52*mm], small=True))
story += [Spacer(1,3*mm), P('Direct-site prices are not interchangeable with the Booking.com rates above. Any direct booking should be rechecked for the exact dates, the 12-year-old classification, and the two-room or family-suite allocation.', 'Smallx'), PageBreak()]

story += section_title('Section 10 - Taipei-only comparison', 'Three consecutive nights at one Taipei property; sorted by total price for all five guests')
story += [P('The verified ranking below uses Booking.com room-level results only. Expedia and Hotels.com candidates are intentionally excluded from this suitable ranking because their result cards did not show the rooms and beds needed for five travelers.', 'Bodyx')]
tp_sorted=sorted(TP,key=lambda x:x['total'])
comp_rows=[]
for x in tp_sorted:
    comp_rows.append([x['id'],x['hotel'],x['total'],x['rooms'],x['beds'],x['loc'],x['rating'],'SEARCH RESULT'])
story.append(make_table(['ID','Property','Total 3N','Rooms','Beds','Location','Score','Evidence'], comp_rows, [13*mm,42*mm,22*mm,22*mm,55*mm,40*mm,24*mm,25*mm], small=True))
story += [Spacer(1,3*mm), P('All six Taipei-only offers above are Booking.com search-result totals including taxes and fees. They are not checkout totals. Group availability was visible in the search result, but no payment or final booking review was entered.', 'Smallx'), PageBreak()]

story += section_title('Section 11 - Scenario B combined accommodation costs', 'Taichung Nov 19-20 + Taipei Nov 20-22; no intercity transport included')
story += [P('The combinations below add the exact Booking.com result totals for two separate searches. They show accommodation cost only. Each component is priced for 4 adults + 1 child age 12 and includes the required rooms displayed by the provider. “Combination” does not mean a recommendation.', 'Bodyx')]
combo=[]
for tc in sorted(TC,key=lambda x:x['total'])[:5]:
    for tp in sorted(TP2,key=lambda x:x['total'])[:5]:
        combo.append((tc['total']+tp['total'],tc,tp))
combo.sort(key=lambda z:z[0])
combo_rows=[]
for total,tc,tp in combo:
    combo_rows.append([tc['id']+' + '+tp['id'],tc['hotel'],money(tc['total']),tp['hotel'],money(tp['total']),money(total),tc['beds']+' | '+tp['beds'],'SEARCH RESULT'])
story.append(make_table(['Pair','Taichung 1N','TC total','Taipei 2N','TP total','Combined 3N','Room/beds summary','Evidence'], combo_rows, [25*mm,34*mm,21*mm,34*mm,21*mm,24*mm,70*mm,22*mm], small=True))
story += [Spacer(1,3*mm), P('The full pair table retains 25 combinations from the five lowest priced Taichung and five lowest priced Taipei split-date offers. It is a cost comparison only; it does not assess the convenience of changing hotels.', 'Smallx'), PageBreak()]

story += section_title('Section 12 - Complete source links, evidence and quality-control notes')
story += [P('Source links are preserved below in shortened groups for readability. Each offer ID in the preceding tables maps to the corresponding provider page or search URL.', 'Bodyx'), P('Booking.com Taipei 3-night search', 'H2x'), link('https://www.booking.com/searchresults.html?ss=Taipei&checkin=2026-11-19&checkout=2026-11-22&group_adults=4&group_children=1&age=12&no_rooms=2'), P('Booking.com Taichung 1-night search', 'H2x'), link('https://www.booking.com/searchresults.html?ss=Taichung&checkin=2026-11-19&checkout=2026-11-20&group_adults=4&group_children=1&age=12&no_rooms=2'), P('Booking.com Taipei 2-night search', 'H2x'), link('https://www.booking.com/searchresults.html?ss=Taipei&checkin=2026-11-20&checkout=2026-11-22&group_adults=4&group_children=1&age=12&no_rooms=2'), P('Expedia exact search', 'H2x'), link('https://www.expedia.com/Hotel-Search?checkIn=2026-11-19&checkOut=2026-11-22&childAges=12&rooms=2&destination=Taipei%2C+Taiwan'), P('Hotels.com exact search', 'H2x'), link('https://ph.hotels.com/Hotel-Search?destination=Taipei%2C%20Taiwan&checkIn=2026-11-19&checkOut=2026-11-22&adults=4&children=1_10&childAges=12&rooms=2')]
story += [Spacer(1,3*mm), P('Quality-control checklist', 'H2x')]
qc = [
    ['Dates','All retained search URLs use Nov 19-22, 2026 for Taipei-only or the correct Nov 19-20 / Nov 20-22 split.'],
    ['Guests and child','4 adults + 1 child aged 12. Agoda and the Booking.com searches accepted the age value; Hotels.com and Expedia URLs carried child age 12, though their visible room controls were inconsistent.'],
    ['Beds and occupancy','Booking.com result cards expose named beds and accepted the group search. UrbanAbode2 and some Run of House / sofa-bed or nontraditional dorm results still require property-level confirmation.'],
    ['Taxes and fees','Booking.com and Hotels.com visibly stated taxes and fees included. Expedia cards stated total with taxes and fees. No extra mandatory fee was added when not shown.'],
    ['Screenshots','Live browser states were inspected and transcribed. The browser connector did not provide local screenshot exports for embedding, so URLs and exact card text are the supporting evidence.'],
    ['Scope','No flights, itinerary, activities, intercity transport, package, agency markup, client quote, booking, payment, or hotel contact was performed.'],
]
story.append(make_table(['Check','Finding'], qc, [35*mm,232*mm], small=True))
story += [Spacer(1,5*mm), P('End of hotel deal collection. Further action required before purchase: reopen the shortlisted room pages, verify simultaneous availability, confirm the 12-year-old occupancy rule, and confirm any property taxes or city fees payable locally.', 'Callout')]

doc = SimpleDocTemplate(OUT, pagesize=landscape(A4), leftMargin=12*mm, rightMargin=12*mm, topMargin=14*mm, bottomMargin=12*mm, title='AeroGo Taiwan - Hotel Deal Collection - Nov 19-22', author='AeroGo Travel & Tours')
doc.build(story, onFirstPage=header_footer, onLaterPages=header_footer)
print(OUT)
