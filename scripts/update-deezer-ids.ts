import { getDeezerTrackId } from '../app/utils/deezer-helper.js';

const songs = [
  {
    title: "Serserim Benim",
    artist: "Aşkın Nur Yengi",
    shareUrl: "https://dzr.page.link/rGiAXNYawpubZaSY6"
  },
  {
    title: "Yabani",
    artist: "Aşkın Nur Yengi",
    shareUrl: "https://dzr.page.link/3KP7xemUXtExLYnq5"
  },
  {
    title: "Geceler Düşman",
    artist: "Aşkın Nur Yengi",
    shareUrl: "https://dzr.page.link/wixmv15id86Ac3r96"
  },
  {
    title: "Benimsin",
    artist: "Aşkın Nur Yengi",
    shareUrl: "https://dzr.page.link/tBESo3TYpKkzX1YE6"
  },
  {
    title: "Hiç ummazdım",
    artist: "Aşkın Nur Yengi",
    shareUrl: "https://dzr.page.link/oeXxzGnpBso1vjU19"
  },
  {
    title: "Deli Gönlüm",
    artist: "Aşkın Nur Yengi",
    shareUrl: "https://dzr.page.link/DAEA7Xi8NufYboSNA"
  },
  {
    title: "Beni Hatırla",
    artist: "Nazan Öncel",
    shareUrl: "https://dzr.page.link/JJWkuRCZtYZTzHds8"
  },
  {
    title: "Geceler Kara Tren",
    artist: "Nazan Öncel",
    shareUrl: "https://dzr.page.link/THNF8mrG6CqsjQ2Q9"
  },
  {
    title: "Gitme Kal Bu Şehirde",
    artist: "Nazan Öncel",
    shareUrl: "https://dzr.page.link/DDUVVi5jfrrf9JBaA"
  },
  {
    title: "Aşkım Baksana Bana",
    artist: "Nazan Öncel",
    shareUrl: "https://dzr.page.link/M8AbEyZ9YMpRU21s7"
  },
  {
    title: "Aynı Nakarat",
    artist: "Nazan Öncel",
    shareUrl: "https://dzr.page.link/pTpsTi8Zv4P9qv3Q9"
  },
  {
    title: "Bu havada gidilmez",
    artist: "Nazan Öncel",
    shareUrl: "https://dzr.page.link/QgT2tCZRx1Di25NN8"
  },
  {
    title: "Ellerim Bomboş",
    artist: "Fatih Erkoç",
    shareUrl: "https://dzr.page.link/TSxKCRQZ9ZDFjR2J7"
  },
  {
    title: "Sultanım",
    artist: "Fatih Erkoç",
    shareUrl: "https://dzr.page.link/KFapZP28JKqdWZwp8"
  },
  {
    title: "Avuç İçi Kadar",
    artist: "Fatih Erkoç",
    shareUrl: "https://dzr.page.link/UKNa8YSp63pKwZat7"
  },
  {
    title: "Sev Beni",
    artist: "Fatih Erkoç",
    shareUrl: "https://dzr.page.link/8XurY9H6rh319iHx8"
  },
  {
    title: "Üzgünüm",
    artist: "Jale",
    shareUrl: "https://dzr.page.link/CRCh9iU76ukkTYro6"
  },
  {
    title: "Kolay Kolay",
    artist: "Jale",
    shareUrl: "https://dzr.page.link/YQrZBAFRCbnGZcBi6"
  },
  {
    title: "Gel Güzelim Gel",
    artist: "Jale",
    shareUrl: "https://dzr.page.link/ia1NSkP6xNDEHG726"
  },
  {
    title: "Bu Şarkılar Senin İçin",
    artist: "Jale",
    shareUrl: "https://dzr.page.link/8NqeuTiH3SiBq18j8"
  },
  {
    title: "Unutacaksan Sevme",
    artist: "Jale",
    shareUrl: "https://dzr.page.link/xQHNeoh67oYNugVh6"
  },
  {
    title: "Bandıra Bandıra",
    artist: "Yonca Evcimik",
    shareUrl: "https://dzr.page.link/ewaY5Sdd79gYvMnn8"
  },
  {
    title: "Kıyamet Günü",
    artist: "Yonca Evcimik",
    shareUrl: "https://dzr.page.link/9w3gyHct4S3rneQs5"
  },
  {
    title: "Tükendik",
    artist: "Yonca Evcimik",
    shareUrl: "https://dzr.page.link/gBMSeeV4fix4sjMr8"
  },
  {
    title: "Gel de İçme",
    artist: "Yonca Evcimik",
    shareUrl: "https://dzr.page.link/UK4apnKzocRbr5JH7"
  },
  {
    title: "Boomerang",
    artist: "Yonca Evcimik",
    shareUrl: "https://dzr.page.link/YW4MmKmzo78Cs4Nr9"
  },
  {
    title: "Abone",
    artist: "Yonca Evcimik",
    shareUrl: "https://dzr.page.link/9jR7uC9afRf1emRL8"
  },
  {
    title: "8:15 Vapuru",
    artist: "Yonca Evcimik",
    shareUrl: "https://dzr.page.link/sE4kNZYAfp6BovWw7"
  },
  {
    title: "Yalancı Bahar",
    artist: "Yonca Evcimik",
    shareUrl: "https://dzr.page.link/4j7FjQCgi6T4ksVq9"
  },
  {
    title: "Taksit Taksit",
    artist: "Yonca Evcimik",
    shareUrl: "https://dzr.page.link/D4kkqgaoSqjvRnT57"
  },
  {
    title: "Vefasız",
    artist: "Soner Arıca",
    shareUrl: "https://dzr.page.link/Dkd3Vrj53UkrGq6PA"
  },
  {
    title: "Tövbekar",
    artist: "Soner Arıca",
    shareUrl: "https://dzr.page.link/7iYtf7dkJZrfZDta8"
  },
  {
    title: "Derbeder",
    artist: "Soner Arıca",
    shareUrl: "https://dzr.page.link/vGiWkxcGVE4VpMLM6"
  },
  {
    title: "Deniz Gözlüm",
    artist: "Soner Arıca",
    shareUrl: "https://dzr.page.link/vGiWkxcGVE4VpMLM6"
  },
  {
    title: "Devlerin Aşkı",
    artist: "Soner Arıca",
    shareUrl: "https://dzr.page.link/nKBP3gtsZ4sk72nn8"
  },
  {
    title: "Seni kimler aldı",
    artist: "Sezen Aksu",
    shareUrl: "https://dzr.page.link/H7VDdhr4Xr6EX6Ra6"
  },
  {
    title: "Şinanay",
    artist: "Sezen Aksu",
    shareUrl: "https://dzr.page.link/fMYceR1m6L7Swcw97"
  },
  {
    title: "Son Bakış",
    artist: "Sezen Aksu",
    shareUrl: "https://dzr.page.link/MDaafhqJjxeGey1Q6"
  },
  {
    title: "Kaybolan Yıllar",
    artist: "Sezen Aksu",
    shareUrl: "https://dzr.page.link/KJs2jxNgs7z6WSay8"
  },
  {
    title: "Haydi Gel Benimle Ol",
    artist: "Sezen Aksu",
    shareUrl: "https://dzr.page.link/5JJXSzhYptpT37ZRA"
  },
  {
    title: "Ateşteyim",
    artist: "Çelik",
    shareUrl: "https://dzr.page.link/bYYRTkHRuHv1vR9N9"
  },
  {
    title: "Meyhaneci",
    artist: "Çelik",
    shareUrl: "https://dzr.page.link/Abj75k2tZCK1zsfp9"
  },
  {
    title: "Dilberim",
    artist: "Çelik",
    shareUrl: "https://dzr.page.link/pqCbyDp6sgvePzN2A"
  },
  {
    title: "Hercai",
    artist: "Çelik",
    shareUrl: "https://dzr.page.link/Ya8mP55szfZFyLaw6"
  },
  {
    title: "Delikanlım",
    artist: "Yıldız Tilbe",
    shareUrl: "https://dzr.page.link/FDhhx6B6AcAAtnV58"
  },
  {
    title: "Zülüf",
    artist: "Yıldız Tilbe",
    shareUrl: "https://dzr.page.link/8J8wiEFdZTok7Ckt7"
  },
  {
    title: "Sevemedim Ayrılığı",
    artist: "Yıldız Tilbe",
    shareUrl: "https://dzr.page.link/eWLxKRbS5ZuqRSDCA"
  },
  {
    title: "Dillere Destan",
    artist: "Yıldız Tilbe",
    shareUrl: "https://dzr.page.link/Lhav7haZD29cwDeD8"
  },
  {
    title: "El Adamı",
    artist: "Yıldız Tilbe",
    shareUrl: "https://dzr.page.link/ZVuwZVG2uVZGnNj96"
  },
  {
    title: "Aşk Yok Olmaktır",
    artist: "Yıldız Tilbe",
    shareUrl: "https://dzr.page.link/is3cFjnRsWC8B8Xv9"
  },
  {
    title: "Yarabbim",
    artist: "Yıldız Tilbe",
    shareUrl: "https://dzr.page.link/sEhVucmTPJ16xoz69"
  },
  {
    title: "Yalnız Çiçek",
    artist: "Yıldız Tilbe",
    shareUrl: "https://dzr.page.link/pyFEqgZtNoTYZ8pS8"
  },
  {
    title: "Tamam (Sustum)",
    artist: "Vega",
    shareUrl: "https://dzr.page.link/jrZz1mFURTBrsgsU9"
  },
  {
    title: "Alışamadım Yokluğuna",
    artist: "Vega",
    shareUrl: "https://dzr.page.link/kSvwVMsVfUbwcVV3A"
  },
  {
    title: "Fırtınalar",
    artist: "Ebru Gündeş",
    shareUrl: "https://dzr.page.link/VrRS6b6vuFc72Pbr8"
  },
  {
    title: "Senin Olmaya Geldim",
    artist: "Ebru Gündeş",
    shareUrl: "https://dzr.page.link/MKmksxEEXwG5wfdt7"
  },
  {
    title: "Dön Ne Olur",
    artist: "Ebru Gündeş",
    shareUrl: "https://dzr.page.link/WA5BXpYiSK6LyRb8A"
  },
  {
    title: "Deli Divane",
    artist: "Ebru Gündeş",
    shareUrl: "https://dzr.page.link/kRZyTyMoSR1T4pBP7"
  },
  {
    title: "Devlerin Aşkı",
    artist: "Seden Gürel",
    shareUrl: "https://dzr.page.link/ZSkRKvaZKrGsapd68"
  },
  {
    title: "Çalkala",
    artist: "Seden Gürel",
    shareUrl: "https://dzr.page.link/d1MdyTyGf6dDXZz5A"
  }
];

async function updateTrackIds() {
  for (const song of songs) {
    const trackId = await getDeezerTrackId(song.shareUrl);
    if (trackId) {
      console.log(`"${song.title}" by ${song.artist}: ${trackId}`);
    } else {
      console.error(`Failed to get track ID for "${song.title}" by ${song.artist}`);
    }
  }
}

updateTrackIds().catch(console.error); 