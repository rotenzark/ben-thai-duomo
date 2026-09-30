/* PLUMBING_V 4 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'ben-thai-duomo',
    /* nessun WhatsApp pubblicato: il telefono di Google, Treatwell e Instagram */
    whatsapp: { number: '', message: '', ids: [] },
    /* pannello Google e Treatwell (30/9/2026): tutti i giorni 10–21 */
    hours: {
      0: [['10:00', '21:00']], 1: [['10:00', '21:00']], 2: [['10:00', '21:00']], 3: [['10:00', '21:00']],
      4: [['10:00', '21:00']], 5: [['10:00', '21:00']], 6: [['10:00', '21:00']],
    },
    hoursStatusId: 'orarioStato',
    hoursTableSelector: '[data-day]',
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 1800,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 1060,
    EN: {
      "m.salta": "Skip to the content",
      "m.top": "Ben Thai Duomo: back to the top",
      "m.nav": "The sections",
      "m.lingua": "Language",
      "m.menu": "Open the menu",
      "m.ingrandisci": "Enlarge the photo",
      "m.lightbox": "Enlarged photo",
      "m.chiudi": "Close",
      "n.soglia": "The threshold",
      "n.massaggi": "The massages",
      "n.ingresso": "On arrival",
      "n.sedi": "Two centres",
      "n.dicono": "Reviews",
      "n.orari": "Hours",
      "n.domande": "Questions",
      "t.chiama": "Call",
      "t.prenota": "Book",
      "t.prenotaTw": "Book on Treatwell",
      "t.scegli": "Choose and book on Treatwell",
      "t.indicazioni": "Directions to get here",
      "t.indicazioniB": "Directions",
      "h.sopra": "Thai massage · Via Santa Maria Valle 1, on the corner of Via Torino",
      "h.titolo": "If Milan is wearing you down, it is time to stop.",
      "h.testo": "Ben Thai Duomo: traditional Thai massage and Thai massage with oil, foot reflexology, couples and four-hands massage, on a side street off Via Torino, a short walk from the Duomo. Step through the door and you are in Thailand.",
      "h.chi": "Francesco, in a review on Treatwell (in Italian: «Just like being on holiday!»)",
      "h.google": "on Google, 175 reviews",
      "h.treatwell": "on Treatwell, 1,432 reviews",
      "p.titolo": "Smooth as silk",
      "p.desc": "On a dark lacquer panel with golden corners, a red silk ribbon edged in gold is tied in three knots; the knots come undone one at a time and the ribbon is left as a smooth wave, then a gleam of light runs along it. Three ways: on your own, as a couple (two ribbons, red and gold), four hands (four knots, undone from both ends at once).",
      "p.d0": "On your own: the knots come undone one at a time.",
      "p.d1": "As a couple: two ribbons, in the same room.",
      "p.d2": "Four hands: four knots, undone from both ends at once.",
      "p.modi": "The massage",
      "p.b0": "On your own",
      "p.b1": "As a couple",
      "p.b2": "Four hands",
      "p.nota": "They wrote it themselves on Instagram: a massage should make the body like silk, smooth and free of knots.",
      "s.etichetta": "The threshold",
      "s.titolo": "Step through the door, and it is Thailand",
      "s.sotto": "In 2020, when they opened their second centre here, this is how they introduced it: a place that «appena varcata la soglia della porta, vi trasporterà in Thailandia» (as soon as you cross the threshold, it will take you to Thailand).",
      "s.p1": "Outside",
      "s.p2": "Inside",
      "s.p3": "In the room",
      "a.facciata": "The façade: the red signs «Ben Thai» and «Benessere Thailandese», the door with white curtains, the window with golden statues and fans.",
      "k.facciata": "The two red signs on Via Santa Maria Valle, a few steps from Via Torino.",
      "a.attesa": "The waiting room: the golden triptych with lotus flowers, the kneeling statue with joined hands, the gilded offering vases and, at the end of the corridor, the red door.",
      "k.attesa": "The waiting room: the kneeling statue makes the wai, the Thai greeting with joined hands. At the back, the red door.",
      "a.coppia": "The couples room: the golden triptych with the Bodhi tree on a lotus flower, two low beds with golden cushions.",
      "k.coppia": "The couples room: the Bodhi tree, in gold, on the lotus flower.",
      "a.coppiaLato": "The couples room seen from the side: the golden triptych, the clock, the two beds with golden cushions and a frangipani flower.",
      "a.cabinaDue": "A single room with the red and gold panel, the bed with a red cushion and the towels.",
      "a.asciugamani": "Rolled towels with a frangipani flower on the red runner.",
      "l.etichetta": "The massages",
      "l.titolo": "From half an hour to three hours",
      "l.sotto": "Their menu on Treatwell, without prices: you choose the length when you book, and that is where you see the price too.",
      "l.g1": "Thai and reflexology",
      "l.tradizionale": "Traditional Thai",
      "l.tradizionaleN": "no oil, in comfortable clothes they give you",
      "l.olio": "Thai with oil",
      "l.plantare": "Thai foot reflexology",
      "l.tradPlantare": "Traditional and foot",
      "l.schiena": "Back, neck and head",
      "l.g2": "Relaxing",
      "l.rilassante": "Relaxing with oil",
      "l.viso": "Neck, head and face",
      "l.quattro": "Four-hands Thai",
      "l.quattroN": "two therapists together",
      "l.g3": "As a couple",
      "l.coppia": "Thai for couples",
      "l.coppiaOlio": "Couples, relaxing with oil",
      "l.g4": "Pregnancy and anti-cellulite",
      "l.gravidanza": "Pregnancy massage",
      "l.anticellulite": "Anti-cellulite",
      "l.antiThai": "Anti-cellulite and Thai",
      "l.antiPlantare": "Anti-cellulite and foot",
      "a.oli": "Two amber oil bottles and the celadon essence burner with a lit candle, on the rattan mat.",
      "k.oli": "The oils and the essence burner.",
      "l.nota": "The menu may change: today's, with prices and free times, is on Treatwell.",
      "i.etichetta": "On arrival",
      "i.titolo": "Before you lie down",
      "i.sotto": "From the reviews of people who have already been.",
      "i.t1": "The intensity",
      "i.p1": "When you arrive they ask how you want the massage: gentler, medium or strong.",
      "i.t2": "The clothes",
      "i.p2": "Traditional Thai massage is done without oil: they give you comfortable clothes for the treatment.",
      "i.t3": "The points",
      "i.p3": "Say where you feel the most tension: the massage focuses there.",
      "i.t4": "Gift cards",
      "i.p4": "«Avete pensato alle nostre gift card?» (have you thought of our gift cards?), they write: a massage to give, for couples too.",
      "a.cabina": "A single room: the red and gold panel shaped like a Bodhi leaf, the low wooden bed with a red cushion, the slippers.",
      "k.cabina": "A single room: the Bodhi leaf panel.",
      "e.etichetta": "Two centres",
      "e.titolo": "Ben Thai doubles up",
      "e.sotto": "That is how they announced it in 2020: after Ben Thai Garibaldi, the Duomo centre. Same name, same Instagram.",
      "e.qui": "You are here",
      "e.prima": "The first one",
      "e.duomo": "Via Santa Maria Valle 1, on the corner of Via Torino",
      "e.duomoOre": "Every day from 10 am to 9 pm",
      "e.garibaldi": "Bastioni di Porta Volta 5",
      "e.garibaldiOre": "Hours on Treatwell",
      "e.prenota": "Book on Treatwell",
      "d.etichetta": "Reviews",
      "d.titolo": "People who come back every time they are in Milan",
      "d.google": "on Google, 175 reviews",
      "d.treatwell": "on Treatwell, 1,432 reviews",
      "d.g3m": "Google, 3 months ago",
      "d.g2a": "Google, 2 years ago",
      "d.twFeb": "Treatwell, February 2026",
      "d.twLug": "Treatwell, July 2026",
      "d.twMar": "Treatwell, March 2026",
      "d.twGiu": "Treatwell, June 2026",
      "d.nota": "From the reviews on Google and Treatwell, in Italian, as they were written; cuts are marked […]. The line at the top also comes from a review on Treatwell.",
      "d.tutteG": "The reviews on Google",
      "d.tutteT": "The reviews on Treatwell",
      "o.etichetta": "Hours and where",
      "o.titolo": "Every day, from 10 am to 9 pm",
      "o.cap": "Opening hours",
      "g.lun": "Monday",
      "g.mar": "Tuesday",
      "g.mer": "Wednesday",
      "g.gio": "Thursday",
      "g.ven": "Friday",
      "g.sab": "Saturday",
      "g.dom": "Sunday",
      "o.nota": "Hours from their Google listing and Treatwell (September 2026). Holiday closures and the August break are announced on Instagram.",
      "o.mappa": "Map: Ben Thai Duomo, Via Santa Maria Valle 1, Milan",
      "o.dove": "Where",
      "o.dovev": "Via Santa Maria Valle 1, 20123 Milan, on the corner of Via Torino, between the Duomo and the Carrobbio",
      "o.tram": "By tram",
      "o.tramv": "3, Via Torino / Via S. Maria Valle stop, about 55 metres away",
      "o.metro": "By metro",
      "o.metrov": "M4 Vetra, about 390 metres away; M3 Missori, about 400; M1 and M3 Duomo, about 530",
      "o.tel": "Phone",
      "o.mail": "Email",
      "o.social": "Social",
      "q.etichetta": "Questions",
      "q.titolo": "Before you book",
      "q.1": "How do I book?",
      "q.1r": "On Treatwell, online or in the app, or by phone on 320 558 6150. You choose the massage with its length, from 30 minutes to 3 hours.",
      "q.2": "What do I wear for traditional Thai massage?",
      "q.2r": "It is done without oil, and they give you comfortable clothes for the treatment.",
      "q.3": "Can I choose the intensity?",
      "q.3r": "Yes: people who have been there say they ask you when you arrive. And you can say which points to focus on.",
      "q.4": "Do you do pregnancy massage?",
      "q.4r": "Yes, there is a pregnancy massage, from 30 minutes to 2 hours.",
      "q.5": "Can we come as a couple?",
      "q.5r": "Yes: there are couples rooms, for Thai couples massage and for the relaxing massage with oil.",
      "q.6": "Do you do gift cards?",
      "q.6r": "Yes, for the couples massage too: someone who gave one says the voucher arrived by email. Ask by phone.",
      "f2.orario": "Every day 10 am–9 pm",
      "f2.cred": "Demo website made by <a href=\"https://bespokestud.io\" rel=\"noopener\">Bespoke Studio</a> · the photos are from their photo shoot published on Treatwell and Facebook; hours and ratings from their Google listing and Treatwell (September 2026), reviews from Google and Treatwell, their words from Instagram and Facebook. We drew the silk ribbon ourselves.",
      "f2.su": "Back to the top ↑"
    },
    LANGS: null,
    RTL: ['ar', 'he', 'fa', 'ur'],
    HOURS_I18N: null,
  };
  /* normalizzazione: EN storico -> LANGS */
  if (!SITE.LANGS) SITE.LANGS = SITE.EN && Object.keys(SITE.EN).length ? { en: SITE.EN } : {};
  var LANG_CODES = Object.keys(SITE.LANGS);   // senza 'it', che è il DOM
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    /* ⚠️ setTimeout 0 NON è decorativo: senza intro questo ramo gira in modo
       SINCRONO, cioè PRIMA che il codice-firma — che sta sotto il marcatore
       di fine plumbing, dentro questa stessa IIFE — abbia assegnato
       `window.bespokeHeroEntrance`. Il risultato è un'entrata dell'hero MUTA:
       nessun errore, elementi visibili, animazione semplicemente mai partita.
       Rimandando di un tick la IIFE è conclusa e l'hook esiste.
       (14/8/2026, A.S.FA. Sicilia: misurato h1 a opacity 1 già al load.)
       Cugino del bug `hero-hook-congelato` del 20/7: lì l'hook era catturato
       troppo presto, qui è CHIAMATO troppo presto. */
    setTimeout(heroEntrance, 0);
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 (Il Papiro #168) — IL PANNELLO SI RISOLVE DA `aria-controls`.
     Il canone apriva sempre `#mainNav`, dando per scontato che la nav
     desktop FOSSE anche il drawer. Molti siti invece hanno un drawer
     separato (`#mobile-menu`) con `hidden`, mentre `#mainNav` su mobile è
     `display:none`: il burger aggiungeva `nav-open` a un elemento nascosto
     e il menu non si apriva. È la stessa decisione già presa il 20/7 per
     qa-motion — «è lì che il markup accessibile dice qual è il pannello» —
     che però non era mai rientrata qui. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS_BASE = {
    it: { open: 'Aperto ora', closesAt: 'chiude alle ', opensToday: 'Chiuso · apre oggi alle ',
          opensOn: 'Chiuso · apre {day} alle ', closed: 'Chiuso', days: DAYS_IT },
    en: { open: 'Open now', closesAt: 'closes at ', opensToday: 'Closed · opens today at ',
          opensOn: 'Closed · opens {day} at ', closed: 'Closed', days: DAYS_EN },
  };
  /* risolve le etichette orari per la lingua richiesta, con fallback en -> it */
  function strings(lang) {
    var custom = (SITE.HOURS_I18N && SITE.HOURS_I18N[lang]) || null;
    var base = HOURS_BASE[lang] || HOURS_BASE.en;
    if (!custom) return base;
    var outp = {};
    Object.keys(HOURS_BASE.it).forEach(function (k) {
      outp[k] = custom[k] !== undefined ? custom[k] : base[k];
    });
    return outp;
  }

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    /* V4: le etichette si risolvono per lingua corrente, non con un booleano
       en/it. Fallback a catena lingua -> en -> it, così un sito con AR o FR
       che non traduce lo stato orari resta comunque leggibile. */
    var L = strings(root.lang);
    var txt;
    if (st.open) {
      txt = L.open + ' · ' + L.closesAt + st.closesAt;
    } else if (st.opensToday) {
      txt = L.opensToday + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = L.opensOn.replace('{day}', L.days[st.opensDay]) + st.opensAt;
    } else {
      txt = L.closed;
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    /* V4: qualunque lingua dichiarata in SITE.LANGS, non più solo 'en'.
       'it' resta la lingua del DOM: nessun dizionario, nessuna sostituzione.
       Una lingua sconosciuta ricade su 'it' invece di rompere la pagina. */
    root.lang = (lang === 'it' || LANG_CODES.indexOf(lang) !== -1) ? lang : 'it';
    root.dir = SITE.RTL.indexOf(root.lang) !== -1 ? 'rtl' : 'ltr';
    var dict = SITE.LANGS[root.lang] || null;
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = dict && dict[key] !== undefined ? dict[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  /* 26/7/2026 (Il Papiro #168) — SI CABLANO ENTRAMBE LE FORME DI SELETTORE.
     Il canone conosceva solo il toggle singolo `#langToggle`, ma nella
     flotta esiste da tempo anche la COPPIA di bottoni `[data-lang]`
     (Warsa, Mido…): `i18n-roundtrip` era già stato insegnato a riconoscerle
     il 20/7, il plumbing no. Chi copiava il boilerplate e usava la coppia
     si ritrovava il cambio lingua MORTO, e nessun lint statico se ne
     accorgeva (lo becca solo qa-motion, a runtime). */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    /* V4: il toggle singolo CICLA sull'anello ['it', ...LANG_CODES].
       Con due lingue il comportamento è identico a prima (it <-> en). */
    var RING = ['it'].concat(LANG_CODES);
    langToggle.addEventListener('click', function () {
      var i = RING.indexOf(root.lang);
      setLang(RING[(i + 1) % RING.length]);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    var saved = localStorage.getItem(SITE.slug + '-lang');
    if (saved && saved !== 'it' && LANG_CODES.indexOf(saved) !== -1) setLang(saved);
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */

  /* ══════════ BEN THAI DUOMO — Via Santa Maria Valle 1 ══════════
     la FIRMA — «liscio come la seta»: su un pannello di lacca scura, un nastro di seta rosso coi nodi; i nodi si sciolgono e il
     nastro resta un'onda liscia, dove c'era un nodo resta un punto d'oro, poi un riflesso ci scorre sopra. Lo stato è M (da soli, in
     coppia, a quattro mani), T (0…1) e V (0 al suo posto; fino a 1 il nastro esce a destra; da −1 a 0 entra da sinistra quello nuovo).
     Senza JS e alla fine: da soli, T = 1, V = 0 (l'HTML). L'attesa (classe nell'head): il nastro coi nodi. Reduced-motion: tutto subito.
     rAF a tempo, guardia 1,5 s, IO al 60 %, resize solo se cambia la larghezza; un gesto durante l'animazione la ferma dov'è. */
  var DATI = {"vb":[640,360],"via":700,"lucido":{"prima":70,"oltre":12},"tempi":{"inizio":300,"seta":5200,"servi":420,"arriva":480,"setaV":4400},"modi":[{"nome":"Da soli","fasi":{"nodi":[{"t":0.06,"d":0.24},{"t":0.33,"d":0.24},{"t":0.6,"d":0.24}],"lucido":{"t":0.85,"d":0.15}},"nastri":[{"x0":-262,"b0":15,"bx0":4,"r":23.463985895833716,"bK":95.47034922500139,"ky":0.72,"a":1.6,"dir":1,"fA":1.5707963267948966,"fB":23.561944901923447,"colmi":[6.283185307179586,12.566370614359172,18.84955592153876],"punti":315,"nodiIdx":[67,157,247],"pezzi":[{"orlo":[0,67],"corpo":[0,67],"luce":[0,65]},{"orlo":[66,157],"corpo":[65,157],"luce":[65,155]},{"orlo":[156,247],"corpo":[155,247],"luce":[155,245]},{"orlo":[246,314],"corpo":[245,314],"luce":[245,314]}],"lungo":550,"colore":"rosso","pos":[320,188],"scala":1}]},{"nome":"In coppia","fasi":{"nodi":[{"t":0.06,"d":0.24},{"t":0.33,"d":0.24},{"t":0.6,"d":0.24}],"lucido":{"t":0.85,"d":0.15}},"nastri":[{"x0":-262,"b0":15,"bx0":4,"r":23.463985895833716,"bK":95.47034922500139,"ky":0.72,"a":1.6,"dir":1,"fA":1.5707963267948966,"fB":23.561944901923447,"colmi":[6.283185307179586,12.566370614359172,18.84955592153876],"punti":315,"nodiIdx":[67,157,247],"pezzi":[{"orlo":[0,67],"corpo":[0,67],"luce":[0,65]},{"orlo":[66,157],"corpo":[65,157],"luce":[65,155]},{"orlo":[156,247],"corpo":[155,247],"luce":[155,245]},{"orlo":[246,314],"corpo":[245,314],"luce":[245,314]}],"lungo":550,"colore":"rosso","pos":[320,128],"scala":0.9},{"x0":-262,"b0":15,"bx0":4,"r":23.463985895833716,"bK":95.47034922500139,"ky":0.72,"a":1.6,"dir":-1,"fA":1.5707963267948966,"fB":23.561944901923447,"colmi":[6.283185307179586,12.566370614359172,18.84955592153876],"punti":315,"nodiIdx":[67,157,247],"pezzi":[{"orlo":[0,67],"corpo":[0,67],"luce":[0,65]},{"orlo":[66,157],"corpo":[65,157],"luce":[65,155]},{"orlo":[156,247],"corpo":[155,247],"luce":[155,245]},{"orlo":[246,314],"corpo":[245,314],"luce":[245,314]}],"lungo":550,"colore":"oro","pos":[320,240],"scala":0.9}]},{"nome":"A quattro mani","fasi":{"nodi":[{"t":0.06,"d":0.34},{"t":0.44,"d":0.34},{"t":0.44,"d":0.34},{"t":0.06,"d":0.34}],"lucido":{"t":0.82,"d":0.18}},"nastri":[{"x0":-262,"b0":15,"bx0":4,"r":18.249766807870667,"bK":80.34911386990854,"ky":0.72,"a":1.6,"dir":1,"fA":1.5707963267948966,"fB":29.845130209103033,"colmi":[6.283185307179586,12.566370614359172,18.84955592153876,25.132741228718345],"punti":405,"nodiIdx":[67,157,247,337],"pezzi":[{"orlo":[0,67],"corpo":[0,67],"luce":[0,65]},{"orlo":[66,157],"corpo":[65,157],"luce":[65,155]},{"orlo":[156,247],"corpo":[155,247],"luce":[155,245]},{"orlo":[246,337],"corpo":[245,337],"luce":[245,335]},{"orlo":[336,404],"corpo":[335,404],"luce":[335,404]}],"lungo":567,"colore":"rosso","pos":[320,188],"scala":1}]}]};
  /* liscio come la seta a (M, T, V) — una sola fonte: la usano _btd_firma.mjs (l'HTML allo stato finale e l'attesa), main.js (via
     btd_main.cjs) e la prova (firma-prova.mjs). T = 1, V = 0 dà gli stessi attributi dell'HTML; T = 0 gli stessi pixel dell'attesa.
     Il nastro è una trocoide: x avanza di r per radiante e arretra di b·sen φ; dove b supera r il nastro fa un anello (un nodo), dove
     resta sotto r è un'onda. Ogni nodo alza b in una finestra piatta attorno al suo colmo; sciogliere il nodo (u da 0 a 1) riporta b a
     b0: l'anello si stringe, diventa una punta e poi un'onda morbida. */
  function setaPunti(N, u) {
    var PI = Math.PI, pts = [], n = N.punti, fA = N.fA, fB = N.fB;
    for (var i = 0; i < n; i++) {
      var f = fA + (fB - fA) * i / (n - 1), b = N.b0;
      for (var k = 0; k < N.colmi.length; k++) {
        var d = Math.abs(f - N.colmi[k]);
        var g = d <= N.a ? 1 : d >= PI ? 0 : 0.5 * (1 + Math.cos(PI * (d - N.a) / (PI - N.a)));
        b += (N.bK - N.b0) * g * (1 - u[k]);
      }
      /* in x il termine che fa arretrare il nastro è b − b0 + bx0 (da sciolto quasi zero: l'onda resta una sinusoide morbida) */
      var bx = b - N.b0 + N.bx0;
      pts.push([N.x0 + N.r * (f - fA) - bx * Math.sin(f) + N.bx0, -N.dir * N.ky * b * Math.cos(f)]);
    }
    return pts;
  }
  function setaTratto(pts, i0, i1) {
    var s = 'M';
    for (var i = i0; i <= i1; i++) s += (i > i0 ? ' L' : '') + Math.round(pts[i][0] * 10) / 10 + ' ' + Math.round(pts[i][1] * 10) / 10;
    return s;
  }
  function creaSeta(svg, D) {
    var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
    var r1 = function (n) { return Math.round(n * 10) / 10; };
    /* la fine di una fase arriva a 1 esatto (#256) */
    var fase = function (t, w) { return t >= w.t + w.d - 1e-9 ? 1 : c01((t - w.t) / w.d); };
    var dolce = function (u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
    var nastri = svg.querySelector('.nastri');
    var P = D.modi.map(function (modo, m) {
      return modo.nastri.map(function (N, n) {
        var q = '[data-m="' + m + '"][data-n="' + n + '"]';
        return {
          pezzi: N.pezzi.map(function (_, k) {
            var qk = q + '[data-k="' + k + '"]';
            return { orlo: svg.querySelector('.orlo' + qk), corpo: svg.querySelector('.corpo' + qk), luce: svg.querySelector('.luce' + qk) };
          }),
          lucido: svg.querySelector('.lucido' + q),
          punti: N.nodiIdx.map(function (_, k) { return svg.querySelector('.punto' + q + '[data-k="' + k + '"]'); })
        };
      });
    });
    function disegna(m, t, v) {
      var modo = D.modi[m], F = modo.fasi;
      /* i nodi si sciolgono ognuno nel suo tempo (da soli uno alla volta; a quattro mani dai due capi insieme) */
      var u = F.nodi.map(function (w) { return dolce(fase(t, w)); });
      var l = dolce(fase(t, F.lucido));
      modo.nastri.forEach(function (N, n) {
        var pts = setaPunti(N, u), q = P[m][n];
        N.pezzi.forEach(function (pz, k) {
          var x = q.pezzi[k];
          x.orlo.setAttribute('d', setaTratto(pts, pz.orlo[0], pz.orlo[1]));
          x.corpo.setAttribute('d', setaTratto(pts, pz.corpo[0], pz.corpo[1]));
          x.luce.setAttribute('d', setaTratto(pts, pz.luce[0], pz.luce[1]));
        });
        /* dove il nodo si è sciolto resta un punto d'oro sul colmo: compare nell'ultimo tratto dello scioglimento */
        N.nodiIdx.forEach(function (c, k) {
          var s = c01((u[k] - 0.6) / 0.4);
          q.punti[k].setAttribute('transform', 'translate(' + r1(pts[c][0]) + ' ' + r1(pts[c][1]) + ') scale(' + Math.round(s * 1000) / 1000 + ')');
        });
        /* alla fine un riflesso di luce scorre sul nastro liscio, dal capo alla coda */
        q.lucido.setAttribute('stroke-dashoffset', String(r1(D.lucido.prima + (-(N.lungo + D.lucido.oltre) - D.lucido.prima) * l)));
      });
      /* col V il nastro esce a destra; quello nuovo, coi nodi, entra da sinistra */
      nastri.setAttribute('transform', 'translate(' + r1(D.via * v) + ' 0)');
    }
    var completo = !!nastri && P.every(function (mm) {
      return mm.every(function (q) { return q.lucido && q.punti.every(Boolean) && q.pezzi.every(function (x) { return x.orlo && x.corpo && x.luce; }); });
    });
    return { disegna: disegna, pezzi: P, completo: completo };
  }

  var prendi = function (id) { return document.getElementById(id); };
  var figuraF = prendi('seta-firma'), svgF = prendi('setaSvg'), leggiF = prendi('setaLeggi');
  var SETA = svgF ? creaSeta(svgF, DATI) : null;
  var BOTTONI = [].slice.call(document.querySelectorAll('.seta__modi button[data-modo]'));
  var TF = DATI.tempi;
  var faseF = 'fatta', modoF = '', rafF = 0, guardiaF = 0, larghezzaAvvioF = 0, corseF = 0, pianoF = null;
  var MF = 0, TT = 1, VF = 0;
  var destinazioneF = { m: 0 };
  var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
  var CURVE = {
    dolce: function (u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; },
    lineare: function (u) { return u; }
  };
  function annunciaF(m) {
    var el = document.querySelector('.seta__d[data-m="' + m + '"]');
    if (leggiF) leggiF.textContent = el ? el.textContent : '';
  }
  function disegnaF(m, t, v) {
    if (m !== MF || figuraF.getAttribute('data-modo') !== String(m)) {
      MF = m;
      figuraF.setAttribute('data-modo', String(m));
      BOTTONI.forEach(function (bt) { bt.setAttribute('aria-pressed', String(+bt.getAttribute('data-modo') === m)); });
    }
    TT = t; VF = v;
    SETA.disegna(m, t, v);
  }
  /* un piano: tratti { da, a, m, x0: {t, v}, x1: {…}, curva } */
  function fotogrammaF(t) {
    var P = pianoF.piano, cur = null;
    for (var i = 0; i < P.length; i++) if (t >= P[i].da) cur = P[i];
    if (!cur) return;
    var q = t < cur.a ? c01((t - cur.da) / Math.max(1, cur.a - cur.da)) : 1, e = CURVE[cur.curva](q), A = cur.x0, B = cur.x1;
    disegnaF(cur.m, A.t + (B.t - A.t) * e, A.v + (B.v - A.v) * e);
  }
  var st2 = function (t, v) { return { t: t, v: v }; };
  function sorvegliaF() { clearTimeout(guardiaF); guardiaF = setTimeout(chiudiF, 1500); }
  function chiudiF() {
    cancelAnimationFrame(rafF); rafF = 0;
    clearTimeout(guardiaF);
    disegnaF(destinazioneF.m, 1, 0);
    /* gli altri modi tornano come nell'HTML (#257) */
    DATI.modi.forEach(function (_, k) { if (k !== destinazioneF.m) SETA.disegna(k, 1, 0); });
    SETA.disegna(destinazioneF.m, 1, 0);
    if (figuraF) figuraF.setAttribute('data-firma', 'fatta');
    root.classList.remove('firma-attesa');
    faseF = 'fatta';
  }
  /* un gesto durante un'animazione (o nell'attesa): tutto si ferma dov'è (#244); dall'attesa restano i nodi */
  function fermaF() {
    cancelAnimationFrame(rafF); rafF = 0;
    clearTimeout(guardiaF);
    if (root.classList.contains('firma-attesa')) { disegnaF(MF, 0, 0); root.classList.remove('firma-attesa'); }
    else disegnaF(MF, TT, VF);
    if (figuraF) figuraF.setAttribute('data-firma', 'fatta');
    faseF = 'fatta';
  }
  function avviaF(modo, piano) {
    cancelAnimationFrame(rafF); rafF = 0;
    modoF = modo; pianoF = piano;
    root.classList.remove('firma-attesa');
    faseF = 'corre'; if (figuraF) figuraF.setAttribute('data-firma', 'corre');
    larghezzaAvvioF = window.innerWidth;
    var t0 = null, corsa = ++corseF;
    function fotogramma(ts) {
      rafF = 0;
      /* un fotogramma rimasto in coda dopo la chiusura (o di una corsa vecchia) non riapre niente */
      if (faseF !== 'corre' || corsa !== corseF) return;
      if (t0 === null) t0 = ts;
      var t = ts - t0;
      fotogrammaF(t);
      if (t >= pianoF.fine) { chiudiF(); return; }
      sorvegliaF();
      rafF = requestAnimationFrame(fotogramma);
    }
    sorvegliaF();
    rafF = requestAnimationFrame(fotogramma);
  }
  function avviaIntroF() {
    /* dalla classe d'attesa agli attributi senza cambiare un pixel: il nastro coi nodi */
    disegnaF(0, 0, 0);
    destinazioneF = { m: 0 };
    var P = [{ da: 0, a: TF.inizio, m: 0, x0: st2(0, 0), x1: st2(0, 0), curva: 'lineare' }, { da: TF.inizio, a: TF.inizio + TF.seta, m: 0, x0: st2(0, 0), x1: st2(1, 0), curva: 'lineare' }];
    avviaF('intro', { piano: P, fine: TF.inizio + TF.seta });
  }
  /* il gesto: scegliere il massaggio. Se è quello che si sta già facendo, niente; altrimenti tutto si ferma dov'è, il nastro
     esce a destra, entra da sinistra quello nuovo coi nodi e si scioglie da capo. */
  function sceltaF(m) {
    if (faseF === 'corre' && destinazioneF.m === m) return;
    if (faseF === 'corre' || root.classList.contains('firma-attesa')) fermaF();
    destinazioneF = { m: m };
    annunciaF(m);
    if (reducedMotion) { chiudiF(); return; }
    var P = [], t = 0, mm = MF, a = st2(TT, VF);
    var passo = function (dura, m2, b, curva) { P.push({ da: t, a: t + dura, m: m2, x0: a, x1: b, curva: curva }); t += dura; a = b; };
    if (a.v >= 0) {
      passo(TF.servi, mm, st2(a.t, 1), 'dolce');
      a = st2(0, -1);
    }
    passo(TF.arriva, m, st2(0, 0), 'dolce');
    passo(TF.setaV, m, st2(1, 0), 'lineare');
    avviaF('prepara', { piano: P, fine: t });
  }

  /* la testata segna la sezione in cui ti trovi */
  var linkVoci = [].slice.call(document.querySelectorAll('#mainNav a'));
  var bersagliVoci = linkVoci.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function aggiornaVoci() {
    var y = (document.getElementById('testata') || { offsetHeight: 80 }).offsetHeight + 40, ora = -1;
    for (var i = 0; i < bersagliVoci.length; i++) { if (bersagliVoci[i] && bersagliVoci[i].getBoundingClientRect().top <= y) ora = i; }
    linkVoci.forEach(function (a, k) { if (k === ora) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  }
  var tickVoci = 0;
  window.addEventListener('scroll', function () {
    if (tickVoci) return;
    tickVoci = requestAnimationFrame(function () { tickVoci = 0; aggiornaVoci(); });
  }, { passive: true });
  aggiornaVoci();

  /* lo stato degli orari anche sopra la tabella */
  function copiaStato() {
    var primo = document.getElementById(SITE.hoursStatusId);
    if (!primo) return;
    var aperto = hoursState().open;
    ['orarioStato', 'orarioStato2'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (el !== primo) el.textContent = primo.textContent;
      el.classList.toggle('is-aperto', aperto);
    });
  }
  copiaStato();
  setInterval(copiaStato, 60000);
  /* la copia segue lo stato principale a ogni cambio, anche di lingua (#243, stato-lingua-check) */
  (function () {
    var primoS = document.getElementById(SITE.hoursStatusId);
    if (primoS && window.MutationObserver) new MutationObserver(copiaStato).observe(primoS, { childList: true, characterData: true, subtree: true });
  })();

  /* la firma è «in vista» quando se ne vede almeno il 60% (o il 60% della finestra, se è più alta della finestra); l'altezza è quella
     del documento: all'avvio innerHeight di un telefono può non essere ancora quella vera (#233) */
  function altezzaVista() { return document.documentElement.clientHeight || window.innerHeight || 800; }
  function abbastanza(top, bottom, alto, vh) { return Math.min(bottom, vh) - Math.max(top, 0) >= 0.6 * Math.min(alto, vh); }
  function inVistaF() { var r = svgF.getBoundingClientRect(); return abbastanza(r.top, r.bottom, r.height, altezzaVista()); }

  if (figuraF && svgF && SETA && SETA.completo && BOTTONI.length === DATI.modi.length) {
    try { clearTimeout(window.__attesaSeta); } catch (e) {}
    window.__seta = {
      stato: function () {
        return { fase: faseF, modo: modoF, corse: corseF, m: MF, t: TT, v: VF, meta: destinazioneF.m };
      },
      tempi: TF,
    };
    var daFareF = !reducedMotion && root.classList.contains('firma-attesa');
    /* la pagina aperta su una sezione (#orari): il browser ci scorre dopo, la firma non si vedrebbe */
    var ancoraF = location.hash && location.hash.length > 1 && location.hash !== '#inizio';
    var inVista = inVistaF();
    /* perché la firma è partita o no (lo legge il check) */
    window.__seta.avvio = { daFare: daFareF, ancora: !!ancoraF, inVista: inVista, top: svgF.getBoundingClientRect().top, vh: altezzaVista() };
    if (!daFareF || ancoraF) chiudiF();
    else if (inVista) avviaIntroF();
    else if ('IntersectionObserver' in window) {
      /* la firma sotto la piega (sul telefono): parte quando se ne vede abbastanza; fino ad allora resta il nastro coi nodi */
      var soglie = []; for (var sg = 0; sg <= 20; sg++) soglie.push(sg / 20);
      var ioF = new IntersectionObserver(function (voci) {
        if (!voci.some(function (v) { return v.isIntersecting && abbastanza(v.boundingClientRect.top, v.boundingClientRect.bottom, v.boundingClientRect.height, altezzaVista()); })) return;
        ioF.disconnect();
        if (faseF === 'fatta' && root.classList.contains('firma-attesa')) avviaIntroF();
      }, { threshold: soglie });
      ioF.observe(svgF);
      window.__seta.avvio.aspetta = true;
    } else chiudiF();
    /* un resize chiude la firma solo se cambia la LARGHEZZA (sul telefono arrivano resize della sola altezza, #228) */
    window.addEventListener('resize', function () {
      if (faseF !== 'corre' || Math.abs(window.innerWidth - larghezzaAvvioF) <= 1) return;
      chiudiF();
    });
    BOTTONI.forEach(function (b) { b.addEventListener('click', function () { sceltaF(+b.getAttribute('data-modo')); }); });
  }
})();
