/**
 * APEX MOVEMENT – tptpskripte.js
 * Autor JS-a: Ajdin Mehmedović
 *
 * Sadržaj:
 * 1. Dark/Light mode toggle + LocalStorage
 * 2. Filtriranje kartica bez reloada
 * 3. Interaktivna statistika (animirani brojači)
 * 4. Validacija kontakt forme (isključivo JS, bez HTML5 required)
 * 5. Smooth scroll za bookmark navigaciju
 * 6. Dinamički brojač znakova u textarea
 */

/* ============================================================
   1. DARK / LIGHT MODE TOGGLE + LOCALSTORAGE
   Uz pomoć Claudea sam razumio/la kako localStorage.setItem()
   i localStorage.getItem() čuvaju podatke između sesija.
   'light-mode' class se dodaje/uklanja s document.body.
   ============================================================ */

(function inicijalizujMod() {
  var sacuvaniMod = localStorage.getItem('apex-mod');
  if (sacuvaniMod === 'light') {
    document.body.classList.add('light-mode');
  }
})();

document.addEventListener('DOMContentLoaded', function () {

  var toggleDugme = document.getElementById('dark-mode-toggle');

  if (toggleDugme) {
    toggleDugme.addEventListener('click', function () {
      // Prebaci klasu na body
      document.body.classList.toggle('light-mode');

      // Sačuvaj preferenciju u localStorage
      if (document.body.classList.contains('light-mode')) {
        localStorage.setItem('apex-mod', 'light');
      } else {
        localStorage.setItem('apex-mod', 'dark'); 
      }
    });
  }


  /* ============================================================
     2. FILTRIRANJE KARTICA BEZ RELOADA
     Uz pomoć Claudea sam razumio/la kako querySelectorAll vraća
     NodeList, te kako dataset.kategorija čita data-kategorija
     atribut iz HTML-a. Kartica se skriva postavljanjem
     display:'none', a prikazuje s display:''.
     ============================================================ */

  var filterDugmad = document.querySelectorAll('.filter-btn');
  var karticaGrid  = document.getElementById('kartice-grid');
  var brojanikEl   = document.getElementById('broj');
  var nemaRezultata = document.getElementById('nema-rezultata');

  if (filterDugmad.length > 0 && karticaGrid) {

    filterDugmad.forEach(function (dugme) {
      dugme.addEventListener('click', function () {

        // Ukloni 'aktivan-filter' sa svih dugmadi
        filterDugmad.forEach(function (d) {
          d.classList.remove('aktivan-filter');
        });

        // Dodaj 'aktivan-filter' na kliknuto dugme
        this.classList.add('aktivan-filter');

        var odabraniFilter = this.dataset.filter;
        var kartice = karticaGrid.querySelectorAll('.kartica');
        var brPrikazanih = 0;

        kartice.forEach(function (kartica) {
          var kategorija = kartica.dataset.kategorija;

          if (odabraniFilter === 'sve' || kategorija === odabraniFilter) {
            kartica.style.display = '';
            // Dodaj malu fade-in animaciju
            kartica.style.animation = 'none';
            kartica.offsetHeight; // reflow – resetuj animaciju
            kartica.style.animation = 'fadeInUp 0.35s ease both';
            brPrikazanih++;
          } else {
            kartica.style.display = 'none';
          }
        });

        // Ažuriraj brojač prikazanih
        if (brojanikEl) {
          brojanikEl.textContent = brPrikazanih;
        }

        // Prikaži poruku ako nema rezultata
        if (nemaRezultata) {
          nemaRezultata.style.display = brPrikazanih === 0 ? 'block' : 'none';
        }
      });
    });
  }


  /* ============================================================
     3. INTERAKTIVNA STATISTIKA – ANIMIRANI BROJAČI
     Uz pomoć Claudea sam razumio/la kako setInterval() periodično
     poziva funkciju, a clearInterval() je zaustavlja kad dostignes
     ciljanu vrijednost. Math.ceil() zaokružuje na gore.
     ============================================================ */

  function animirajBrojac(elementId, ciljnaVrijednost, trajanje) {
    var el = document.getElementById(elementId);
    if (!el) return;

    var pocetak = 0;
    var korak = Math.ceil(ciljnaVrijednost / (trajanje / 50));
    var interval = setInterval(function () {
      pocetak += korak;
      if (pocetak >= ciljnaVrijednost) {
        pocetak = ciljnaVrijednost;
        clearInterval(interval);
      }
      el.textContent = pocetak;
    }, 50);
  }

  // Nasumične ali realistične vrijednosti za demonstraciju
  var posjetilaca = Math.floor(Math.random() * 80) + 20;  // 20–100
  var narudzbi    = Math.floor(Math.random() * 30) + 5;   // 5–35
  var artikala    = 127; // fiksno – broj artikala u ponudi

  animirajBrojac('posjetilaca-brojac', posjetilaca, 1200);
  animirajBrojac('narudzbi-danas', narudzbi, 900);
  animirajBrojac('dostupno-artikala', artikala, 1500);


  /* ============================================================
     4. SMOOTH SCROLL ZA BOOKMARK NAVIGACIJU
     Uz pomoć Claudea sam razumio/la kako event.preventDefault()
     zaustavlja default ponašanje linka, a scrollIntoView s
     opcijom {behavior:'smooth'} glatko skrolja do ciljnog elementa.
     ============================================================ */

  var bookmarkLinkovi = document.querySelectorAll('.bookmark-nav a, .skok-na-vrh');

  bookmarkLinkovi.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = this.getAttribute('href');

      // Smooth scroll samo za interni hash (#...)
      if (href && href.startsWith('#')) {
        e.preventDefault();
        var cilj = document.querySelector(href);
        if (cilj) {
          cilj.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });


  /* ============================================================
     5. VALIDACIJA KONTAKT FORME
     Isključivo JavaScript validacija – bez HTML5 required/pattern.
     Uz pomoć Claudea sam razumio/la regex pattern za email:
       ^ – početak stringa
       [\w.-]+ – jedno ili više: slova, cifara, tačke ili crtice
       @ – literal znak
       [\w.-]+ – domen
       \. – tačka
       [a-z]{2,} – ekstenzija min 2 slova
       $ – kraj stringa, /i – case-insensitive
     Za telefon:
       ^\+? – opcionalni +
       [\d\s\-]{6,15}$ – cifre, razmaci, crtice, 6–15 znakova
     ============================================================ */

  var forma = {
    ime:     document.getElementById('ime'),
    prezime: document.getElementById('prezime'),
    email:   document.getElementById('email'),
    telefon: document.getElementById('telefon'),
    tema:    document.getElementById('tema'),
    poruka:  document.getElementById('poruka')
  };

  var greske = {
    ime:     document.getElementById('ime-greska'),
    prezime: document.getElementById('prezime-greska'),
    email:   document.getElementById('email-greska'),
    telefon: document.getElementById('telefon-greska'),
    tema:    document.getElementById('tema-greska'),
    poruka:  document.getElementById('poruka-greska')
  };

  // Regex za validaciju
  var emailRegex   = /^[\w.-]+@[\w.-]+\.[a-z]{2,}$/i;
  var telefonRegex = /^\+?[\d\s\-]{6,15}$/;

  // ---- Helper: prikaži grešku ----
  function prikaziGresku(polje, greska, poruka) {
    if (greska) greska.textContent = poruka;
    if (polje)  polje.classList.add('greska');
  }

  // ---- Helper: ukloni grešku ----
  function ukloniGresku(polje, greska) {
    if (greska) greska.textContent = '';
    if (polje)  polje.classList.remove('greska');
  }

  // ---- Validacija pojedinih polja ----
  function validirajIme() {
    if (!forma.ime) return true;
    var vrijednost = forma.ime.value.trim();
    if (vrijednost.length === 0) {
      prikaziGresku(forma.ime, greske.ime, 'Unesite vaše ime.');
      return false;
    }
    if (vrijednost.length < 2) {
      prikaziGresku(forma.ime, greske.ime, 'Ime mora imati najmanje 2 znaka.');
      return false;
    }
    ukloniGresku(forma.ime, greske.ime);
    return true;
  }

  function validirajPrezime() {
    if (!forma.prezime) return true;
    var vrijednost = forma.prezime.value.trim();
    if (vrijednost.length === 0) {
      prikaziGresku(forma.prezime, greske.prezime, 'Unesite vaše prezime.');
      return false;
    }
    if (vrijednost.length < 2) {
      prikaziGresku(forma.prezime, greske.prezime, 'Prezime mora imati najmanje 2 znaka.');
      return false;
    }
    ukloniGresku(forma.prezime, greske.prezime);
    return true;
  }

  function validirajEmail() {
    if (!forma.email) return true;
    var vrijednost = forma.email.value.trim();
    if (vrijednost.length === 0) {
      prikaziGresku(forma.email, greske.email, 'Unesite e-mail adresu.');
      return false;
    }
    if (!emailRegex.test(vrijednost)) {
      prikaziGresku(forma.email, greske.email, 'Unesite ispravnu e-mail adresu (npr. ime@mail.com).');
      return false;
    }
    ukloniGresku(forma.email, greske.email);
    return true;
  }

  function validirajTelefon() {
    if (!forma.telefon) return true;
    var vrijednost = forma.telefon.value.trim();
    if (vrijednost.length === 0) {
      prikaziGresku(forma.telefon, greske.telefon, 'Unesite broj telefona.');
      return false;
    }
    if (!telefonRegex.test(vrijednost)) {
      prikaziGresku(forma.telefon, greske.telefon, 'Dozvoljene su samo cifre, razmaci i crtice (6–15 znakova).');
      return false;
    }
    ukloniGresku(forma.telefon, greske.telefon);
    return true;
  }

  function validirajTemu() {
    if (!forma.tema) return true;
    if (!forma.tema.value) {
      prikaziGresku(forma.tema, greske.tema, 'Odaberite temu upita.');
      return false;
    }
    ukloniGresku(forma.tema, greske.tema);
    return true;
  }

  function validirajPoruku() {
    if (!forma.poruka) return true;
    var vrijednost = forma.poruka.value.trim();
    if (vrijednost.length === 0) {
      prikaziGresku(forma.poruka, greske.poruka, 'Unesite poruku.');
      return false;
    }
    if (vrijednost.length < 20) {
      prikaziGresku(forma.poruka, greske.poruka, 'Poruka mora imati najmanje 20 znakova (još ' + (20 - vrijednost.length) + ').');
      return false;
    }
    ukloniGresku(forma.poruka, greske.poruka);
    return true;
  }

  // ---- Live validacija na blur ----
  if (forma.ime)     forma.ime.addEventListener('blur', validirajIme);
  if (forma.prezime) forma.prezime.addEventListener('blur', validirajPrezime);
  if (forma.email)   forma.email.addEventListener('blur', validirajEmail);
  if (forma.telefon) forma.telefon.addEventListener('blur', validirajTelefon);
  if (forma.tema)    forma.tema.addEventListener('change', validirajTemu);
  if (forma.poruka)  forma.poruka.addEventListener('blur', validirajPoruku);

  // ---- Brojač znakova u tekstualnom polju ----
  var porukaEl   = forma.poruka;
  var brojanikEl2 = document.getElementById('poruka-brojac');

  if (porukaEl && brojanikEl2) {
    porukaEl.addEventListener('input', function () {
      var duljina = porukaEl.value.trim().length;
      var min = 20;
      brojanikEl2.textContent = duljina + ' / ' + min + ' znakova minimalno';
      if (duljina >= min) {
        brojanikEl2.style.color = 'var(--boja-uspjeh)';
      } else {
        brojanikEl2.style.color = 'var(--boja-tekst-slabi)';
      }
    });
  }

  // ---- Submit dugme ----
  var btnPosalji = document.getElementById('btn-posalji');
  var uspjesnaPoruka = document.getElementById('uspjesna-poruka');
  var uspjesniTekst  = document.getElementById('uspjesna-tekst');

  if (btnPosalji) {
    btnPosalji.addEventListener('click', function () {
      // Pokreni sve validacije
      var imeOk     = validirajIme();
      var prezimeOk = validirajPrezime();
      var emailOk   = validirajEmail();
      var telefonOk = validirajTelefon();
      var temaOk    = validirajTemu();
      var porukaOk  = validirajPoruku();

      // Sve mora biti ispravno
      if (imeOk && prezimeOk && emailOk && telefonOk && temaOk && porukaOk) {
        // Prikaži personaliziranu uspješnu poruku s imenom korisnika
        var uneseroIme = forma.ime.value.trim();

        if (uspjesnaPoruka && uspjesniTekst) {
          uspjesniTekst.textContent = 'Hvala, ' + uneseroIme + '! Vaša poruka je uspješno poslana. Javit ćemo vam se u roku od 24 sata.';
          uspjesnaPoruka.style.display = 'flex';
          // Skroluj do poruke
          uspjesnaPoruka.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        // Resetuj polja forme
        if (forma.ime)     forma.ime.value     = '';
        if (forma.prezime) forma.prezime.value = '';
        if (forma.email)   forma.email.value   = '';
        if (forma.telefon) forma.telefon.value = '';
        if (forma.tema)    forma.tema.value    = '';
        if (forma.poruka)  forma.poruka.value  = '';

        // Resetuj brojač
        if (brojanikEl2) {
          brojanikEl2.textContent = '0 / 20 znakova minimalno';
          brojanikEl2.style.color = 'var(--boja-tekst-slabi)';
        }

        // Sakrij uspješnu poruku nakon 6 sekundi
        setTimeout(function () {
          if (uspjesnaPoruka) {
            uspjesnaPoruka.style.display = 'none';
          }
        }, 6000);

      } else {
        // Skroluj do prvog polja s greškom
        var prvaGreska = document.querySelector('.greska');
        if (prvaGreska) {
          prvaGreska.scrollIntoView({ behavior: 'smooth', block: 'center' });
          prvaGreska.focus();
        }
      }
    });
  }

  // ---- Reset dugme – briše formu i sve greške ----
  var btnReset = document.getElementById('btn-reset');

  if (btnReset) {
    btnReset.addEventListener('click', function () {
      // Resetuj vrijednosti svih polja
      var svaPolja = [forma.ime, forma.prezime, forma.email, forma.telefon, forma.poruka];
      svaPolja.forEach(function (polje) {
        if (polje) {
          polje.value = '';
          polje.classList.remove('greska');
        }
      });

      if (forma.tema) {
        forma.tema.value = '';
        forma.tema.classList.remove('greska');
      }

      // Obrisi sve greske
      var sveGreske = [greske.ime, greske.prezime, greske.email, greske.telefon, greske.tema, greske.poruka];
      sveGreske.forEach(function (g) {
        if (g) g.textContent = '';
      });

      // Resetuj brojač
      if (brojanikEl2) {
        brojanikEl2.textContent = '0 / 20 znakova minimalno';
        brojanikEl2.style.color = 'var(--boja-tekst-slabi)';
      }

      // Sakrij uspješnu poruku ako je prikazana
      if (uspjesnaPoruka) {
        uspjesnaPoruka.style.display = 'none';
      }
    });
  }

}); // kraj DOMContentLoaded
