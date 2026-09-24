from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle
from pathlib import Path

OUT=Path('/Users/esguerra/Desktop/aerogotours/output/pdf/AeroGo_Taiwan_Attractions_Activities_Deal_Collection.pdf')
OUT.parent.mkdir(parents=True,exist_ok=True)
TWD=1.9787; USD=62.694
def conv(v,c): return v*(TWD if c=='TWD' else USD) if v is not None else None
def fmt(v,c): return 'not exposed' if v is None else f'{c} {v:,.2f} / PHP {conv(v,c):,.0f}'
def add(id,cat,provider,kind,name,loc,adult,cur,child,inc,exc,dur,hours,meet,transport,guide,cancel,url,status='SEARCH RESULT',shop='A - no shopping requirement shown',total=None):
    offers.append(dict(id=id,cat=cat,provider=provider,kind=kind,name=name,loc=loc,adult=adult,cur=cur,child=child,inc=inc,exc=exc,dur=dur,hours=hours,meet=meet,transport=transport,guide=guide,cancel=cancel,url=url,status=status,shop=shop,total=total))
offers=[]

# Taipei city
add('TA01','Taipei','Klook','INDIVIDUAL ADMISSION TICKET','Taipei 101 Observatory 89F','Taipei 101 / Xinyi',17.75,'USD','12+ adult rate; child not exposed','89F ticket; 1-2h suggested','No transport; exact child price not exposed','1-2h','10:00-21:00 daily','Taipei 101 entry','No','No','Product terms apply','https://www.klook.com/en-US/activity/1659-taipei-101-taipei/')
add('TA02','Taipei','Klook','INDIVIDUAL ADMISSION TICKET','National Palace Museum ticket','Shilin',11,'USD','Official visitors 17 and under free; marketplace child price not exposed','Museum admission reference','No transport; exact child handling depends on product','2-3h','Official museum hours vary','Museum entrance','No','No','Product terms apply','https://www.klook.com/destination/c19-taipei/1-things-to-do/')
add('TA03','Taipei','Klook','INDIVIDUAL ADMISSION TICKET','Maokong Gondola ticket','Wenshan / Taipei Zoo',9.45,'USD','Tourist child rate not exposed','Gondola ticket reference','No hotel transport; child category unclear','2-4h','Tue-Thu 09:00-21:00; Fri/weekend later','Zoo/Maokong stations','No','No','Product terms apply','https://www.klook.com/destination/c19-taipei/1-things-to-do/')
add('TA04','Taipei','Klook','INDIVIDUAL ADMISSION TICKET','Taipei Zoo admission','Wenshan',None,'TWD','Age 12 full fare per official rule; Klook price not exposed','Zoo entry','No transport; price not exposed in usable currency','Half day','09:00-17:00; last entry 16:00','Zoo entrance','No','No','Free cancellation before redemption shown','https://www.klook.com/en-US/activity/34262-maokong-gondola-taipei-zoo-tickets/')
add('TA05','Taipei','GetYourGuide','INDIVIDUAL ADMISSION TICKET','Taipei 101 Observatory ticket','Xinyi',19,'USD','Child price not exposed','Observatory admission','No transport; exact child handling not exposed','1-2h','10:00-21:00 official reference','Taipei 101','No','No','Provider terms apply','https://www.getyourguide.com/taipeh-l190/taipei-ganztagige-oder-halbtagige-sightseeingtour-mit-101-taipei-t888225/')
add('TA06','Taipei','Klook','OTHER EXPERIENCE','Raohe/night-market food tour','Taipei',None,'TWD','Child price not exposed','Guided food walk reference','Food and child pricing vary; no compulsory shopping term shown','2h','Evening; product-specific','Product meeting point','No','Yes','Product-specific','https://www.klook.com/en-US/activity/138947-raohe-night-market-walking-tour/')
add('TA07','Taipei','Official','FREE ATTRACTION','Chiang Kai-shek Memorial Hall / Liberty Square','Zhongzheng',0,'TWD','Free','Memorial Hall and park access','Guided tour requires appointment; events separate','1-2h','Hall 09:00-18:00; park 05:00-24:00','Site entrance','No','No','Free public access','https://www.cksmh.gov.tw/en/cp.aspx?n=6369',total=0)

# Northern Taiwan
add('NT01','Northern Taiwan','Klook','SHARED GROUP TOUR','Yehliu, Jiufen, Shifen and Golden Waterfall day tour','North Coast / New Taipei',20.29,'USD','Child price not exposed','Yehliu, Yin-Yang Sea, 13-Level Ruins, Golden Waterfall, Jiufen, Shifen; Taipei shuttle','Admissions/meals/package details vary','9-10h','Day tour; product-specific','Taipei pickup/meeting point','Yes, Taipei shuttle','English/Chinese likely','Product-specific','https://www.klook.com/activity/76306-yehliu-jiufen-shifen-golden-waterfall-day-tour/')
add('NT02','Northern Taiwan','Klook','SHARED GROUP TOUR','Yehliu, Jiufen and Shifen day tour','New Taipei',21.19,'USD','Child price not exposed','Core northern stops; 9h15m-10h; variants may include waterfall','Admission and lantern may be extra','9h15m-10h','Day tour; product-specific','Taipei meeting point','Yes','English/Chinese','Product-specific','https://www.klook.com/destination/p50001284-shihfen/5-tour/')
add('NT03','Northern Taiwan','KKday','SHARED GROUP TOUR','Jiufen, Yehliu and Shifen early-bird tour','New Taipei',693,'TWD','Child rate not exposed','Shared sightseeing tour reference','Admissions, meals and lantern not exposed','Day tour','Product-specific','Provider meeting point','Yes, route-dependent','Product-specific','Product-specific','https://www.kkday.com/en-us/category/tw-shifen/day-tours/list')
add('NT04','Northern Taiwan','KKday','SHARED GROUP TOUR','Northern Taiwan Yehliu/Jiufen/Shifen tour','New Taipei',810,'TWD','Child rate not exposed','Shared day tour reference','Extras and exact inclusions vary','Day tour','Product-specific','Provider meeting point','Yes','Product-specific','Product-specific','https://www.kkday.com/en-us/category/tw-juifen/sightseeing-tours/list')
add('NT05','Northern Taiwan','GetYourGuide','SHARED GROUP TOUR','Shifen, Jiufen and Yehliu guided day trip','New Taipei',32,'USD','Child price not exposed','Coach/vehicle, guide, three core stops; 9h','Shifen Waterfall shown as extra fee; admissions/lantern may be extra','9h','Day tour','Ximen/central Taipei starting points','Yes','Yes','Free cancellation 24h shown','https://www.getyourguide.com/new-taipei-city-l87576/from-taipei-shifen-jiufen-and-yehliu-geopark-day-tour-t641137/')
add('NT06','Northern Taiwan','GetYourGuide','SHARED GROUP TOUR','Yehliu, Jiufen, Shifen and sky lantern','New Taipei',81,'USD','Child price not exposed','Pickup, guided sightseeing, sky lantern activity listed','Admission/meal details product-specific','9h','Day tour','Pickup shown on product page','Yes','Yes','Product-specific','https://www.getyourguide.com/taipeh-l190/taipei-ganztagige-oder-halbtagige-sightseeingtour-mit-101-taipei-t888225/')
add('NT07','Northern Taiwan','Trip.com','SHARED GROUP TOUR','Shifen Old Street, Yehliu and Jiufen join-in','New Taipei',16.90,'USD','Child price not exposed','Join-in transport, 11h, English, core stops','Yehliu admission not included; lantern extra','11h','Day tour','Provider meeting point','Yes','English','Free cancellation 1 day shown','https://www.trip.com/things-to-do/detail/50829813/')
add('NT08','Northern Taiwan','Trip.com','SHARED GROUP TOUR','Yehliu/Jiufen/Shifen Waterfall tour','New Taipei',27.47,'USD','Child price not exposed','Join-in transport and northern stops','Extras/admission vary','1 day','Day tour','Provider meeting point','Yes','Product-specific','Free cancellation 1 day shown','https://www.trip.com/things-to-do/detail/50952998/')
add('NT09','Northern Taiwan','Viator','SHARED GROUP TOUR','Yehliu, Jiufen, Shifen Waterfall and flying lantern','New Taipei',35,'USD','Child price not exposed','Vehicle, guide, flying lantern; 9h15m','Yehliu TWD120 and lantern TWD200-300 may be extras','9h15m','Day tour','Ximen Exit 5','Yes','Professional guide','Free cancellation 24h shown','https://www.viator.com/en-IE/tours/Taipei/New-Taipei-City-Yehliu-Juifen-and-Shifen-Waterfall-Flying-Lantern/d5262-61691P21')
add('NT10','Northern Taiwan','Viator','SMALL-GROUP TOUR','Jiufen, Yehliu and Shifen from Taipei','New Taipei',85,'USD','Child price not exposed','Pickup/drop-off, guide, vehicle, fuel, taxes, Yehliu admission','Sky lantern TWD150/booking; meals not stated','Full day','Day tour','Hotel pickup/drop-off shown','Yes','Driver/guide','Free cancellation shown','https://www.viator.com/en-AU/tours/Taipei/Full-Day-Tour-of-Jiufen-Yehliu-Geopark-and-Shifen-from-Taipei/d5262-9649P7')

# Taichung
add('TC01','Taichung','Klook','SHARED GROUP TOUR','Gaomei Wetlands half-day shuttle','Taichung',19.05,'USD','Child price not exposed','Nov-Feb: Taichung HSR, Old Station, Miyahara, Gaomei, Fengjia Night Market','Meals/admissions not stated','3-5.5h','Nov-Feb route listed','Taichung HSR/Old Station','Yes','English/bilingual','Product-specific','https://www.klook.com/en-US/activity/99238-taichung-gaomeiwetland-daytour/')
add('TC02','Taichung','Klook','SHARED GROUP TOUR','Rainbow Village and Gaomei Wetlands half-day','Taichung',900,'TWD','Child price not exposed','Transport between Taichung stops; 13:30-19:00','Admissions/meals not stated','5.5h','Tue-Sun reference','National Taichung Theater or product point','Yes','Product-specific','Free cancellation 48h shown','https://www.klook.com/en-US/activity/26222-gaomei-wetlands-tour-taichung/')
add('TC03','Taichung','Trip.com','SHARED GROUP TOUR','Gaomei Wetlands, Zhongshe Flower Market and Miyahara','Taichung',28.76,'USD','Child price not exposed','Join-in tour, 10h30, listed stops, refreshment included','Admissions/meals not fully itemized','10h30','Day tour','Provider meeting point','Yes','Product-specific','Free cancellation 1 day shown','https://www.trip.com/things-to-do/detail/94041462/')
add('TC04','Taichung','GetYourGuide','PRIVATE TOUR','Taichung highlights and Gaomei Wetlands','Taichung',181,'USD','Child price not exposed','Private vehicle, bilingual driver-guide, pickup/return, fuel/tolls, insurance, Xinshe admission','Food optional; exact group total not selected','1 day','Day tour','Hotel pickup/return','Yes, private vehicle','Bilingual driver-guide','Product-specific','https://www.getyourguide.com/en-gb/kota-taipei-l190/dari-taipei-tur-pribadi-sorotan-kota-taichung-1-hari-t846930/')
add('TC05','Taichung','Official','INDIVIDUAL ADMISSION TICKET','Chung-she Flower Garden seasonal entry','Houli',120,'TWD','Published seasonal child reference TWD60; verify at gate','Flower garden reference; Nov is Apr-Dec season','Seasonal price should be verified at gate','1-3h','09:00-18:00','Garden entrance','No','No','Official terms','https://www.flowerjs.com.tw/')
add('TC06','Taichung','Official','FREE ATTRACTION','National Taichung Theater public building visit','Xitun',0,'TWD','Free public building access; performances separately ticketed','Architecture/public spaces','Show tickets not included','1-2h','Tue-Sun 11:30-21:00; Monday closed','Theater entrance','No','No unless event','Free public access','https://www.npac-ntt.org/news/c-NRrzKIVyFwu',total=0)
add('TC07','Taichung','Official','FREE ATTRACTION','Gaomei Wetlands and boardwalk','Qingshui',0,'TWD','Free','Wetland and boardwalk access','Boardwalk closes before rising tide; transport excluded','1-2h','Tide-dependent; boardwalk closes 1.5h before rising tide','Wetland entrance','No','No','Free public access','https://www.taichung.travel/ocean-realtime/en/gaomei-wetlands-reserve',total=0)
add('TC08','Taichung','Official','FREE ATTRACTION','Rainbow Village','Nantun',None,'TWD','Price not published; free-access candidate only','Tourism page lists current operating hours','Do not assume free until gate policy confirmed','1h','Tue-Sun 09:00-17:00','Site entrance','No','No','Public-site terms','https://travel.taichung.gov.tw/vi/attractions/intro/1877')

# Sun Moon Lake
add('SM01','Sun Moon Lake','Klook','TRANSPORT + ACTIVITY BUNDLE','Lake cruise plus bike rental','Sun Moon Lake',10,'USD','Age rule not limited; child price not exposed','Cruise and bicycle rental bundle','No transport from Taipei/Taichung','Half day','Ferry generally 09:00-17:00','Pier/rental point','No intercity transport','No','Voucher validity 365 days shown','https://www.klook.com/en-US/activity/15713-sun-moon-lake-ropeway-combo-taichung/')
add('SM02','Sun Moon Lake','Klook','TRANSPORT + ACTIVITY BUNDLE','Ropeway plus lake cruise','Sun Moon Lake',19.95,'USD','Child price not exposed','Ropeway and lake cruise','No transport from Taipei/Taichung','Half day','Ropeway weekdays 10:30-16:00; holidays 10:00-16:30','Ropeway/pier redemption','No intercity transport','No','Voucher validity 365 days shown','https://www.klook.com/en-US/activity/15713-sun-moon-lake-ropeway-combo-taichung/')
add('SM03','Sun Moon Lake','Klook','TRANSPORT + ACTIVITY BUNDLE','Ropeway, cruise and bicycle bundle','Sun Moon Lake',24.65,'USD','Child price not exposed','Ropeway, cruise and bicycle','No transport from Taipei/Taichung','Half day','Ropeway/ferry hours above','Product redemption points','No intercity transport','No','Voucher validity 365 days shown','https://www.klook.com/en-US/activity/15713-sun-moon-lake-ropeway-combo-taichung/')
add('SM04','Sun Moon Lake','Official','INDIVIDUAL ADMISSION TICKET','Ropeway round trip','Sun Moon Lake',420,'TWD','Concession eligibility-based; age 12 tourist child not assumed','Official round-trip reference from Jun 1 2026','No transport','1-2h','Weekdays 10:30-16:00; holidays 10:00-16:30','Ropeway station','No','No','Official terms','https://www.ropeway.com.tw/page/about/index.aspx?kind=34')
add('SM05','Sun Moon Lake','GetYourGuide','TRANSPORT + ACTIVITY BUNDLE','Tourist shuttle from Taichung','Sun Moon Lake',15,'USD','Child price not exposed','Round-trip shuttle; explore at own pace; valid 14 days','Boat, ropeway, guide and activities excluded','Transport day','Schedule product-specific','Taichung departure/return','Yes, shuttle','No','Free cancellation 1 day shown','https://www.getyourguide.com/taichung-city-l32624/taichung-sun-moon-lake-tour-wround-trip-shuttle-ticket-t1150227/')
add('SM06','Sun Moon Lake','GetYourGuide','PRIVATE TOUR','Sun Moon Lake private tour from Taipei','Sun Moon Lake',285,'USD','Child price not exposed','Private excursion reference from Taipei','Vehicle/admissions/meals product-specific','1 day','Day tour','Taipei pickup/return','Yes, private transport','Yes','Product-specific','https://www.getyourguide.com/taipeh-l190/taipei-ganztagige-oder-halbtagige-sightseeingtour-mit-101-taipei-t888225/')
add('SM07','Sun Moon Lake','Official','INDIVIDUAL ADMISSION TICKET','Ferry / lake cruise','Sun Moon Lake',None,'TWD','Child fare not fixed on official source','Official piers and operating window','Fare is market-based; no fixed current price inferred','Variable','First 09:00; last 17:00; every 15-20 min','Official piers','No','No','Buy at official piers','https://www.sunmoonlake.gov.tw/en/explore/ArticlesCollapsed?a=52')

# Alternatives and free
add('AL01','Alternative','KKday','OTHER EXPERIENCE','Pineapple Cake DIY','Taipei / northern Taiwan',941,'TWD','Child rate not exposed','Hands-on pastry activity','No forced shopping term shown; transport product-specific','2-3h','Product-specific','Product meeting point','No unless stated','Workshop host','Product-specific','https://www.kkday.com/en-us/category/tw-shifen/experiences/list')
add('AL02','Alternative','Trip.com','OTHER EXPERIENCE','Northern Taiwan tour with pineapple-cake DIY','New Taipei',23.42,'USD','Child rate not exposed','Join-in northern sights plus pastry workshop','Sky lantern/admissions may be extra','Full day','Day tour','Provider meeting point','Yes, join-in','Product-specific','Product-specific','https://www.trip.com/things-to-do/detail/104467391/')
add('AL03','Alternative','GetYourGuide','OTHER EXPERIENCE','Taipei cooking class and Dadaocheng market','Taipei',90,'USD','Child rate not exposed','Cooking activity and market component','Meals/transport product-specific','3-4h','Product-specific','Dadaocheng/class site','No unless stated','Class instructor','Product-specific','https://www.getyourguide.com/taipeh-l190/taipei-ganztagige-oder-halbtagige-sightseeingtour-mit-101-t888225/')
add('AL04','Alternative','Trip.com','PRIVATE TOUR','Northern Taiwan 8h private charter, 5-seater','Taipei / New Taipei',234.14,'USD','Per vehicle up to capacity; not per person','Private pickup, flexible stops, 8h','Admissions, meals and guide not necessarily included','8h','Day charter','Pickup product-specific','Yes, private vehicle','No guide stated','Free cancellation 3 days shown','https://www.trip.com/things-to-do/detail/53388841/',total=234.14)
add('AL05','Alternative','Viator','OTHER EXPERIENCE','Taipei food tour','Taipei',55,'USD','Child rate not exposed','Guided local food experience reference','Food inclusions and meeting point product-specific','3-4h','Product-specific','Product meeting point','No unless stated','Yes','Product-specific','https://www.viator.com/tours/Taipei/Yehliu-Jiufen-and-Shifen-Day-Tour/d5262-71853P2')
add('AL06','Alternative','Official','FREE ATTRACTION','Bopiliao Historical Block','Wanhua',0,'TWD','Free','Historic streets and indoor/outdoor spaces','Monday closed; events vary','1-2h','Tue-Sun outdoor 09:00-21:00; indoor 09:00-18:00','Bopiliao entrance','No','No','Free public access','https://www.bopiliao.taipei/EN/Information',total=0)
add('AL07','Alternative','Official','FREE ATTRACTION','Jiufen Old Street','Ruifang',0,'TWD','Free public street access','Old Street and public walking area','Businesses have separate hours/prices','1-3h','Business hours vary','Jiufen Old Street','No','No','Public access','https://jiufen.org/jiufen-old-street/',total=0)
add('AL08','Alternative','Official','FREE ATTRACTION','Shifen Waterfall','Pingxi',0,'TWD','Free','Official scenic attraction','Transport, lantern and food excluded','1-2h','09:00-17:00 Oct-May; last entry 16:30','Waterfall entrance','No','No','Free admission','https://newtaipei.travel/en/Attractions/Detail/111592',total=0)

styles=getSampleStyleSheet()
styles.add(ParagraphStyle(name='TitleA',parent=styles['Title'],fontName='Helvetica-Bold',fontSize=23,leading=28,textColor=HexColor('#0B2545'),alignment=TA_CENTER,spaceAfter=8))
styles.add(ParagraphStyle(name='SubA',parent=styles['Normal'],fontSize=9,leading=13,textColor=HexColor('#475569'),alignment=TA_CENTER))
styles.add(ParagraphStyle(name='H1A',parent=styles['Heading1'],fontSize=15,leading=19,textColor=HexColor('#0B2545'),spaceBefore=4,spaceAfter=7))
styles.add(ParagraphStyle(name='H2A',parent=styles['Heading2'],fontSize=10,leading=13,textColor=HexColor('#0F766E'),spaceBefore=5,spaceAfter=4))
styles.add(ParagraphStyle(name='BodyA',parent=styles['BodyText'],fontSize=8,leading=10.5,spaceAfter=4))
styles.add(ParagraphStyle(name='TinyA',parent=styles['BodyText'],fontSize=5.7,leading=7))
styles.add(ParagraphStyle(name='TinyBold',parent=styles['BodyText'],fontSize=5.7,leading=7,fontName='Helvetica-Bold'))
def P(x,s='BodyA'): return Paragraph(str(x).replace('&','&amp;'),styles[s])
def tbl(data,widths,head=True):
    t=Table(data,colWidths=widths,repeatRows=1 if head else 0,hAlign='LEFT')
    cmds=[('VALIGN',(0,0),(-1,-1),'TOP'),('GRID',(0,0),(-1,-1),.25,HexColor('#CBD5E1')),('LEFTPADDING',(0,0),(-1,-1),3),('RIGHTPADDING',(0,0),(-1,-1),3),('TOPPADDING',(0,0),(-1,-1),3),('BOTTOMPADDING',(0,0),(-1,-1),3)]
    if head: cmds += [('BACKGROUND',(0,0),(-1,0),HexColor('#0B2545')),('TEXTCOLOR',(0,0),(-1,0),colors.white),('FONTNAME',(0,0),(-1,0),'Helvetica-Bold')]
    for r in range(1 if head else 0,len(data)):
        if r%2==0: cmds.append(('BACKGROUND',(0,r),(-1,r),HexColor('#F8FAFC')))
    t.setStyle(TableStyle(cmds)); return t
def price(o): return fmt(o['adult'],o['cur'])
def overview(items):
    r=[[P(x,'TinyBold') for x in ['ID','Provider','Type','Product','Adult','Age 12','5-person note','Status']]]
    for o in items:
        note=fmt(o['total'],o['cur']) if o['total'] is not None else 'Five-person total unverified'
        r.append([P(o['id'],'TinyA'),P(o['provider'],'TinyA'),P(o['kind'],'TinyA'),P(o['name'],'TinyA'),P(price(o),'TinyA'),P(o['child'],'TinyA'),P(note,'TinyA'),P(o['status'],'TinyA')])
    return r
def details(items):
    r=[[P(x,'TinyBold') for x in ['ID / location','Inclusions / exclusions','Timing / Nov status','Meeting / transport / guide','Cancellation / shopping','Source URL']]]
    for o in items:
        r.append([P(f"<b>{o['id']}</b><br/>{o['loc']}",'TinyA'),P(f"<b>Includes:</b> {o['inc']}<br/><b>Excludes:</b> {o['exc']}",'TinyA'),P(f"<b>Duration:</b> {o['dur']}<br/><b>Hours:</b> {o['hours']}<br/><b>Nov 19-22:</b> published reference; exact inventory not selected",'TinyA'),P(f"<b>Meet:</b> {o['meet']}<br/><b>Transport:</b> {o['transport']}<br/><b>Guide:</b> {o['guide']}",'TinyA'),P(f"<b>Cancel:</b> {o['cancel']}<br/><b>Shopping:</b> {o['shop']}",'TinyA'),P(f"<link href='{o['url']}' color='blue'>{o['url']}</link>",'TinyA')])
    return r

story=[]
story += [Spacer(1,22*mm),Paragraph('AeroGo Taiwan',styles['TitleA']),Paragraph('Attractions & Activities Deal Collection',styles['TitleA']),Paragraph('Travel dates: November 19-22, 2026 | 4 adults + 1 child age 12 | 5 travelers',styles['SubA']),Spacer(1,10*mm)]
story.append(P('<b>Research purpose.</b> This report collects attraction tickets, tours, activity bundles and free alternatives for later trip planning. It does not select attractions, build an itinerary, research flights or hotels, calculate a package, add markup or make bookings.'))
story.append(P('<b>Search date.</b> September 22, 2026 (Asia/Manila). Prices are transcribed from provider search/product pages. Most activity platforms did not expose exact November inventory without entering a checkout flow, so those records are labeled published reference rather than confirmed November availability.'))
story.append(P('<b>Price conversions.</b> TWD 1 = PHP 1.9787 and USD 1 = PHP 62.694. PHP equivalents are rounded. “5-person total” is shown only where a group price or directly calculable group price exists; otherwise availability and age-12 pricing remain unverified.'))
story.append(Paragraph('1. Research summary and website coverage',styles['H1A']))
coverage=[['Website','Result','Coverage note'],['Klook','RESEARCHED','Tickets, bundles and northern/Taichung tour references.'],['KKday','RESEARCHED','Published TWD tour and activity references.'],['GetYourGuide','RESEARCHED','Tickets, tours, shuttle and private-tour references.'],['Trip.com Attractions','RESEARCHED','Join-in, charter and Taichung/Northern references.'],['Viator','RESEARCHED','Northern tours and food-experience references.'],['Official sites','RESEARCHED','Operating hours, admission rules and free-attraction evidence.']]
story.append(tbl([[P(c,'TinyBold') for c in coverage[0]]]+[[P(c,'TinyA') for c in r] for r in coverage[1:]], [45*mm,30*mm,190*mm]))
story.append(Spacer(1,6))
story.append(P(f'<b>Distinct evidence-backed records collected:</b> {len(offers)}. Records are preserved by provider and product type; repeated results were not used as filler.'))
story.append(Paragraph('Quality-control summary',styles['H2A']))
story.append(P('Age 12 is not automatically a child fare. National Palace Museum official policy says visitors 17 and under are free; Taipei Zoo publishes a 6-11 child band, so age 12 is full fare; Yehliu publishes 6 to under 12 child pricing, so age 12 is adult. Marketplace products whose child rate was not exposed remain unpriced for the child and are not presented as confirmed five-person totals.'))
story.append(P('Shopping-stop rule: suitable records are limited to products with no compulsory shopping requirement shown in the collected evidence. Tea-house or commercial workshop variants are flagged for manual review. No unsupported allegation is made about any provider.'))
story.append(PageBreak())

def section(title,intro,items):
    story.append(Paragraph(title,styles['H1A'])); story.append(P(intro)); story.append(Paragraph('Price overview',styles['H2A']))
    story.append(tbl(overview(items),[11*mm,18*mm,24*mm,44*mm,29*mm,38*mm,39*mm,25*mm])); story.append(Spacer(1,4))
    story.append(Paragraph('Offer details and evidence',styles['H2A']))
    story.append(tbl(details(items),[25*mm,48*mm,45*mm,50*mm,46*mm,61*mm])); story.append(PageBreak())

section('2. Taipei city attractions','Ticket and free-access evidence for Taipei. Observatory access is kept separate from exterior viewing.',[o for o in offers if o['cat']=='Taipei'])
section('3. Northern Taiwan attractions','Yehliu, Jiufen, Shifen, waterfall, lantern and combination tour offers. Admissions and lantern extras are called out rather than folded into tour prices.',[o for o in offers if o['cat']=='Northern Taiwan'])
section('4. Taichung attractions','Published activity offers and official operating-status references for Taichung. No route or day plan is proposed.',[o for o in offers if o['cat']=='Taichung'])
section('5. Sun Moon Lake activities','Admission, ferry, ropeway, bike/cruise bundles and shuttle references. Intercity transport is included only where the provider explicitly lists it.',[o for o in offers if o['cat']=='Sun Moon Lake'])
section('6. Alternative experiences','Food, workshops, private-charter reference and scenic/free alternatives that do not depend on compulsory shopping.',[o for o in offers if o['cat']=='Alternative'])

story.append(Paragraph('7. Shared and small-group sightseeing comparison',styles['H1A']))
story.append(P('This comparison isolates tours rather than admission-only tickets. It is sorted by published adult price and is not a final selection. Child rates and exact November inventory were not exposed for most marketplace products.'))
group=sorted([o for o in offers if 'TOUR' in o['kind'] or o['kind']=='SMALL-GROUP TOUR' or o['kind']=='PRIVATE TOUR'],key=lambda o: conv(o['adult'],o['cur']) if o['adult'] is not None else 999999)
gr=[[P(x,'TinyBold') for x in ['ID','Provider','Type','Adult price','Key stops/inclusions','Transport / shopping note']]]
for o in group: gr.append([P(o['id'],'TinyA'),P(o['provider'],'TinyA'),P(o['kind'],'TinyA'),P(price(o),'TinyA'),P(o['inc'],'TinyA'),P(f"{o['transport']}; {o['shop']}",'TinyA')])
story.append(tbl(gr,[12*mm,22*mm,31*mm,34*mm,105*mm,65*mm])); story.append(PageBreak())

story.append(Paragraph('8. Free and inexpensive attractions',styles['H1A']))
story.append(P('These are genuine low-cost or free public-access candidates with official or tourism evidence. Free access does not include transport, food, optional activities or event tickets.'))
free=[o for o in offers if o['kind']=='FREE ATTRACTION']
fr=[[P(x,'TinyBold') for x in ['ID','Attraction','Location','Cost','Hours / operating note','Reservation / transport note']]]
for o in free: fr.append([P(o['id'],'TinyA'),P(o['name'],'TinyA'),P(o['loc'],'TinyA'),P('Free','TinyA'),P(o['hours'],'TinyA'),P(f"{o['exc']} Source: {o['url']}",'TinyA')])
story.append(tbl(fr,[12*mm,48*mm,35*mm,18*mm,57*mm,105*mm])); story.append(Spacer(1,6))
story.append(P('Other inexpensive references: National Palace Museum official policy makes admission free for visitors 17 and under; Yehliu adult entry is NT$120; Shifen Waterfall current New Taipei tourism evidence says free admission; Maokong Gondola reference fare is NT$180 single or NT$300 day pass, but tourist child concessions are not assumed.'))
story.append(PageBreak())

story.append(Paragraph('9. Shopping-stop assessment',styles['H1A']))
story.append(P('The labels below reflect only product descriptions and terms visible in the collected evidence.'))
shop=[['Assessment','Records','Evidence-based note'],['A - no shopping requirement shown',str(sum(o['shop'].startswith('A') for o in offers)),'Most tickets, free attractions, food/workshop and sightseeing records. “No shopping requirement shown” is not a guarantee beyond published terms.'],['B - commercial/optional or manual review','NT03 and related variants','Some variants may include a tea-house or commercial workshop stop, or optional food/retail activity. Review exact itinerary before treating as shopping-free.'],['C - mandatory shopping stops','None in suitable shortlist','No collected product was presented as a mandatory jade, tea, cake or duty-free shopping tour.']]
story.append(tbl([[P(c,'TinyBold') for c in shop[0]]]+[[P(c,'TinyA') for c in r] for r in shop[1:]], [55*mm,45*mm,175*mm])); story.append(Spacer(1,8))
story.append(P('<b>Later planning rule:</b> verify the exact itinerary at checkout and reject any product whose terms explicitly require a retail stop or commercial demonstration.'))
story.append(PageBreak())

story.append(Paragraph('10. Consolidated comparison by published adult price',styles['H1A']))
story.append(P('Sorted by published adult price. Per-person references and group-priced records are retained without pretending that a one-person marketplace price confirms five seats. The five lowest published adult prices are shaded for quick review; this is not a recommendation.'))
priced=sorted([o for o in offers if o['adult'] is not None],key=lambda o: conv(o['adult'],o['cur']))
co=[[P(x,'TinyBold') for x in ['ID','Provider','Category','Type','Adult / PHP','Age 12 / 5-person note','Evidence']]]
for o in priced: co.append([P(o['id'],'TinyA'),P(o['provider'],'TinyA'),P(o['cat'],'TinyA'),P(o['kind'],'TinyA'),P(price(o),'TinyA'),P(f"{o['child']}; {fmt(o['total'],o['cur']) if o['total'] is not None else '5p unverified'}",'TinyA'),P(o['status'],'TinyA')])
ct=tbl(co,[12*mm,23*mm,30*mm,34*mm,36*mm,85*mm,28*mm])
for r in range(1,min(6,len(co))): ct.setStyle(TableStyle([('BACKGROUND',(0,r),(-1,r),HexColor('#DCFCE7'))]))
story.append(ct); story.append(PageBreak())

story.append(Paragraph('11. Source links and verification notes',styles['H1A']))
story.append(P('The evidence register preserves direct source URLs for audit and later rechecking. “SEARCH RESULT” means the price or product was visible in a search/category/product result but was not a confirmed checkout total for the five-person group. No bookings or payments were made.'))
sr=[[P(x,'TinyBold') for x in ['ID','Provider','Direct source URL','Verification / key note']]]
for o in offers: sr.append([P(o['id'],'TinyA'),P(o['provider'],'TinyA'),P(f"<link href='{o['url']}' color='blue'>{o['url']}</link>",'TinyA'),P(f"{o['status']}; adult {price(o)}; age 12: {o['child']}",'TinyA')])
story.append(tbl(sr,[12*mm,22*mm,155*mm,78*mm])); story.append(Spacer(1,6))
story.append(Paragraph('Final verification checklist',styles['H2A']))
story.append(P('Dates: November 19-22, 2026. Travelers: 4 adults + 1 child age 12. Scope: attractions and activities only. Exact date-specific availability is mostly unverified because providers required a live booking flow; recheck dates, age-12 classification, five-person capacity, mandatory fees, cancellation and meeting points before use. This report contains no final attraction decision, package calculation, markup or client quotation.'))

def footer(canvas,doc):
    canvas.saveState(); canvas.setFont('Helvetica',7); canvas.setFillColor(HexColor('#64748B')); canvas.drawString(12*mm,7*mm,'AeroGo Taiwan - Attractions & Activities Deal Collection | Research Task 03'); canvas.drawRightString(285*mm,7*mm,f'Page {doc.page}'); canvas.restoreState()
doc=SimpleDocTemplate(str(OUT),pagesize=landscape(A4),rightMargin=10*mm,leftMargin=10*mm,topMargin=9*mm,bottomMargin=12*mm,title='AeroGo Taiwan - Attractions & Activities Deal Collection',author='AeroGo Travel & Tours')
doc.build(story,onFirstPage=footer,onLaterPages=footer)
print(f'Wrote {OUT} with {len(offers)} offers')
