
export interface FileWithPreview {
  file: File;
  previewUrl: string;
  base64?: string;
}

export type ExerciseType = 'Rozciąganie' | 'Mobilizacja' | 'Siła' | 'Stabilizacja';

// --- KONFIGURACJA GITHUB ---
// Wklej tutaj link do swojego folderu na GitHub (bez nazwy pliku na końcu).
// Wzór: https://raw.githubusercontent.com/[TWOJA_NAZWA]/[NAZWA_REPO]/main/
// Pamiętaj o ukośniku "/" na końcu!
export const GITHUB_BASE_URL = "https://raw.githubusercontent.com/macmich76/Fizjo-Studio-CP/main/"; 
// Przykład: "https://raw.githubusercontent.com/JanKowalski/fizjo-assets/main/";

export interface Exercise {
  Global_ID: number;
  Sesja: number;
  Source_ID: number;
  Tytuł: string;
  Media_URL: string; // Base64 or URL (Fallback)
  Typ_PL: ExerciseType;
  Cel_Target: string;
  Pozycja_wyjściowa: string;
  Partia_mięśniowa: string;
  Sprzęt: string;
  Instructions_JSON: string[];
  Uwaga_krytyczna: string;
  Param_sets: number;
  Param_reps: number;
  Param_duration_sec: number;
  Param_type: 'reps' | 'time';
  
  // URL to fetch image from automatically (GitHub, Imgur etc.)
  Remote_URL?: string; 

  // New field for matching uploaded files (aliases without extension)
  imageFileNames?: string[];

  // AI Generated fields (Optional)
  title?: string;
  target?: string;
  reps?: string;
  type?: string;
  instructions?: string[];
  critical?: string;
  matchedImageIdx?: number[];
  matchedAudioIdx?: number[];
}

export const EXERCISE_TYPES: Record<ExerciseType, { label: string; class: string; color: string; bg: string; border: string }> = {
  'Rozciąganie': { label: "Rozciąganie", class: "rozciaganie", color: "#047857", bg: "#ecfdf5", border: "#6ee7b7" },
  'Mobilizacja': { label: "Mobilizacja", class: "mobilizacja", color: "#7e22ce", bg: "#f3e8ff", border: "#d8b4fe" },
  'Siła': { label: "Siła", class: "sila", color: "#be123c", bg: "#ffe4e6", border: "#fda4af" },
  'Stabilizacja': { label: "Stabilizacja", class: "stabilizacja", color: "#0369a1", bg: "#e0f2fe", border: "#7dd3fc" }
};

export const EXERCISES: Exercise[] = [
  {
    Global_ID: 1, Sesja: 1, Source_ID: 1,
    Tytuł: "Przyciąganie kolana po skosie", Media_URL: "", Typ_PL: "Rozciąganie",
    Cel_Target: "Rozciąganie pośladka", Pozycja_wyjściowa: "Leżenie na plecach", Partia_mięśniowa: "Pośladki", Sprzęt: "Mata",
    Uwaga_krytyczna: "Nie odrywamy lędźwi od maty!",
    Instructions_JSON: ["Leżenie na plecach.", "Przyciągnij kolano po skosie (przeciwny bark).", "Przytrzymaj 3-5 sekund.", "Druga noga wyprostowana palce w górę.", "Głowa leży na ziemi."],
    Param_sets: 2, Param_reps: 15, Param_duration_sec: 0, Param_type: "reps",
    imageFileNames: ["1_1_przyciaganie_kolana_po_skosie"]
  },
  {
    Global_ID: 2, Sesja: 1, Source_ID: 2,
    Tytuł: "Martwy Robak (Izometria)", Media_URL: "", Typ_PL: "Siła",
    Cel_Target: "Brzuch / Core", Pozycja_wyjściowa: "Leżenie na plecach", Partia_mięśniowa: "Brzuch / Core", Sprzęt: "Mata",
    Uwaga_krytyczna: "Nie odrywać lędźwi od podłogi!",
    Instructions_JSON: ["Leżenie na plecach.", "Dociskaj kolana do rąk i vice versa (siłowanie).", "Kąt prosty między udami a tułowiem.", "Przy napięciu wciągaj brzuch."],
    Param_sets: 3, Param_reps: 10, Param_duration_sec: 0, Param_type: "reps",
    imageFileNames: ["1_2_martwy_robak_izometria_"]
  },
  {
    Global_ID: 3, Sesja: 1, Source_ID: 3,
    Tytuł: "Upośledzony rowerek", Media_URL: "", Typ_PL: "Siła",
    Cel_Target: "Brzuch (Ekscentryka)", Pozycja_wyjściowa: "Leżenie na plecach", Partia_mięśniowa: "Brzuch / Core", Sprzęt: "Mata",
    Uwaga_krytyczna: "Stop gdy lędźwia tracą kontakt z ziemią!",
    Instructions_JSON: ["Kąt prosty w biodrach i kolanach.", "Jedna noga prostuje się i opada nisko.", "Druga zostaje zgięta.", "Lędźwia wbite w podłogę przez cały czas."],
    Param_sets: 3, Param_reps: 5, Param_duration_sec: 0, Param_type: "reps",
    imageFileNames: ["1_3_uposledzony_rowerek"]
  },
  {
    Global_ID: 4, Sesja: 1, Source_ID: 4,
    Tytuł: "Plank boczny z obciążeniem", Media_URL: "", Typ_PL: "Siła",
    Cel_Target: "Mięśnie skośne", Pozycja_wyjściowa: "Leżenie na boku", Partia_mięśniowa: "Mięśnie skośne", Sprzęt: "Mata, ciężarek/piłka",
    Uwaga_krytyczna: "Nie rób przeprostu kręgosłupa!",
    Instructions_JSON: ["Leżenie bokiem podparcie na łokciu.", "Ciężarek/piłka na biodrze.", "Unieś biodra trzymaj 3s u góry opadnij.", "Ciało w jednej linii."],
    Param_sets: 3, Param_reps: 8, Param_duration_sec: 0, Param_type: "reps",
    imageFileNames: ["1_4_plank_boczny_z_obciazeniem"]
  },
  {
    Global_ID: 5, Sesja: 1, Source_ID: 5,
    Tytuł: "Unoszenie kolan w klęku", Media_URL: "", Typ_PL: "Rozciąganie",
    Cel_Target: "Aktywacja Core", Pozycja_wyjściowa: "Pozycja na czworakach", Partia_mięśniowa: "Brzuch / Core", Sprzęt: "Mata",
    Uwaga_krytyczna: "Mocne napięcie brzucha.",
    Instructions_JSON: ["Pozycja na czworakach.", "Plecy lekko w łuk (koci grzbiet).", "Brzuch mocno wciągnięty i spięty.", "Unieś kolana minimalnie (1 cm) nad ziemię.", "Trzymaj 3 sekundy i odłóż."],
    Param_sets: 3, Param_reps: 10, Param_duration_sec: 0, Param_type: "reps",
    imageFileNames: ["1_5_unoszenie_kolan_w_kleku"]
  },
  {
    Global_ID: 6, Sesja: 1, Source_ID: 6,
    Tytuł: "Antyrotacja z gumą", Media_URL: "", Typ_PL: "Siła",
    Cel_Target: "Stabilizacja w staniu", Pozycja_wyjściowa: "Pozycja stojąca", Partia_mięśniowa: "Stabilizacja tułowia", Sprzęt: "Guma oporowa",
    Uwaga_krytyczna: "Biodra muszą być nieruchome!",
    Instructions_JSON: ["Stań bokiem guma na wysokości klatki.", "Wypchnij ręce przed siebie (pełny wyprost).", "Wróć powoli do klatki.", "Stoimy prosto brzuch wciągnięty."],
    Param_sets: 3, Param_reps: 10, Param_duration_sec: 0, Param_type: "reps",
    imageFileNames: ["1_6_antyrotacja_z_guma"]
  },
  {
    Global_ID: 7, Sesja: 1, Source_ID: 7,
    Tytuł: "Open Book", Media_URL: "", Typ_PL: "Mobilizacja",
    Cel_Target: "Mobilizacja odcinka piersiowego", Pozycja_wyjściowa: "Leżenie na boku", Partia_mięśniowa: "Odcinek piersiowy kręgosłupa", Sprzęt: "Mata",
    Uwaga_krytyczna: "Głowa musi leżeć wygodnie (nie wisieć).",
    Instructions_JSON: ["Leżenie na boku nogi zgięte.", "Ręce wyprostowane przed sobą złączone.", "Otwórz klatkę prowadząc rękę za siebie.", "Wzrok podąża za dłonią.", "Kolana złączone przy podłodze."],
    Param_sets: 1, Param_reps: 10, Param_duration_sec: 0, Param_type: "reps",
    imageFileNames: ["1_7_open_book"]
  },
  {
    Global_ID: 8, Sesja: 2, Source_ID: 1,
    Tytuł: "Rozciąganie boczne ('Na kaloryfer')", Media_URL: "", Typ_PL: "Rozciąganie",
    Cel_Target: "Taśma boczna ciała", Pozycja_wyjściowa: "Leżenie na plecach", Partia_mięśniowa: "Taśma boczna ciała", Sprzęt: "Mata",
    Uwaga_krytyczna: "Mocno wyciągaj rękę w górę, nie trać rotacji dłoni!",
    Instructions_JSON: ["Leżenie na plecach, nogi szeroko.", "Jedno kolano dociśnij do ziemi do wewnątrz.", "Ręka po tej samej stronie wyciągnięta pionowo w górę.", "Zrób rotację wewnętrzną dłoni (wkręcanie żarówki), palce do podłogi."],
    Param_sets: 3, Param_reps: 10, Param_duration_sec: 10, Param_type: "time",
    imageFileNames: ["2_1_rozciaganie_boczne_na_kaloryfer_"]
  },
  {
    Global_ID: 9, Sesja: 2, Source_ID: 2,
    Tytuł: "Neuromobilizacja I (Chwyt 'kołyska')", Media_URL: "", Typ_PL: "Mobilizacja",
    Cel_Target: "Nerw kulszowy / Taśma tylna", Pozycja_wyjściowa: "Leżenie na plecach", Partia_mięśniowa: "Nerw kulszowy, taśma tylna", Sprzęt: "Mata",
    Uwaga_krytyczna: "Tylko do 20% bólu/dyskomfortu. Nie szarp!",
    Instructions_JSON: ["Leżenie na plecach, jedna noga prosta.", "Drugą stopę chwyć ręką 'od dołu' (supinacja - podeszwa do środka).", "Drugą ręką trzymaj kolano.", "Prostuj kolano do sufitu utrzymując chwyt."],
    Param_sets: 1, Param_reps: 15, Param_duration_sec: 0, Param_type: "reps",
    imageFileNames: ["2_2_neuromobilizacja_i_chwyt_kolyska_"]
  },
  {
    Global_ID: 10, Sesja: 2, Source_ID: 3,
    Tytuł: "Neuromobilizacja II (Zgięcie grzbietowe)", Media_URL: "", Typ_PL: "Mobilizacja",
    Cel_Target: "Nerw strzałkowy", Pozycja_wyjściowa: "Leżenie na plecach", Partia_mięśniowa: "Nerw strzałkowy, łydka", Sprzęt: "Mata",
    Uwaga_krytyczna: "Pamiętaj o luzowaniu głowy przy wyproście nogi.",
    Instructions_JSON: ["Leżenie na plecach.", "Chwyć udo pod kolanem.", "Prostuj nogę zadzierając stopę na siebie (zgięcie grzbietowe).", "Jednocześnie przyciągaj brodę do klatki.", "Gdy uginasz nogę - odchylaj głowę do tyłu (flossing)."],
    Param_sets: 1, Param_reps: 15, Param_duration_sec: 0, Param_type: "reps"
  },
  {
    Global_ID: 11, Sesja: 2, Source_ID: 4,
    Tytuł: "Krążenia stawu skokowego w chwycie", Media_URL: "", Typ_PL: "Mobilizacja",
    Cel_Target: "Staw skokowy / Powięź", Pozycja_wyjściowa: "Siad / Leżenie", Partia_mięśniowa: "Staw skokowy, taśma powierzchowna tylna", Sprzęt: "Mata",
    Uwaga_krytyczna: "Maksymalny zakres ruchu - powoli!",
    Instructions_JSON: ["Siad lub leżenie, noga przyciągnięta do klatki.", "Udo przyklejone do brzucha przy klatce (chwyt pod kolanem).", "Palce stopy zadarte mocno na siebie ('na twarz').", "Wykonuj kółka stopą – to pięta ma prowadzić ruch."],
    Param_sets: 1, Param_reps: 20, Param_duration_sec: 0, Param_type: "reps",
    imageFileNames: ["2_3_krazenia_stawu_skokowego_w_chwycie", "2_4_krazenia_stawu_skokowego_w_chwycie"]
  },
  {
    Global_ID: 12, Sesja: 2, Source_ID: 5,
    Tytuł: "Sekwencja w siadzie na piętach", Media_URL: "", Typ_PL: "Mobilizacja",
    Cel_Target: "Biodra / Kręgosłup", Pozycja_wyjściowa: "Siad na piętach", Partia_mięśniowa: "Biodra, kręgosłup", Sprzęt: "Mata",
    Uwaga_krytyczna: "Przy powrocie podwiń miednicę ('schowaj ogon').",
    Instructions_JSON: ["Siad na piętach, ręce z tyłu. Przetaczaj ciężar z pośladka na pośladek.", "Wypchnij biodra mocno do przodu do pełnego wyprostu.", "W górze skręć głowę i popatrz za siebie.", "Wróć na dół powoli."],
    Param_sets: 1, Param_reps: 10, Param_duration_sec: 0, Param_type: "reps",
    imageFileNames: ["2_5_sekwencja_w_siadzie_na_pietach"]
  },
  {
    Global_ID: 13, Sesja: 2, Source_ID: 6,
    Tytuł: "Mobilizacja miednicy w siadzie (Z-sit)", Media_URL: "", Typ_PL: "Mobilizacja",
    Cel_Target: "Miednica / Biodra", Pozycja_wyjściowa: "Siad Z (Z-sit)", Partia_mięśniowa: "Miednica, biodra", Sprzęt: "Mata",
    Uwaga_krytyczna: "Izoluj ruch w biodrach, nie ruszaj całym tułowiem.",
    Instructions_JSON: ["Siad 'Z' (jedna noga zgięta z przodu, druga z boku).", "Stopa przedniej nogi przytulona do uda.", "Delikatne ruchy samą miednicą: przód-tył, na boki, kółeczka."],
    Param_sets: 1, Param_reps: 1, Param_duration_sec: 60, Param_type: "time",
    imageFileNames: ["2_6_mobilizacja_miednicy_w_siadzie_z-sit_"]
  },
  {
    Global_ID: 14, Sesja: 2, Source_ID: 7,
    Tytuł: "Dynamiczne otwarcie biodra (Syrenka)", Media_URL: "", Typ_PL: "Mobilizacja",
    Cel_Target: "Otwarcie taśmy przedniej", Pozycja_wyjściowa: "Siad Z (Z-sit)", Partia_mięśniowa: "Biodra, taśma przednia", Sprzęt: "Mata",
    Uwaga_krytyczna: "Wypychaj biodro 'tylnej' nogi mocno w przód.",
    Instructions_JSON: ["Z pozycji Z-sit.", "Podnieś się na kolana, wypychając biodra w przód.", "Ręka robi duży łuk nad głową (otwarcie boku).", "Wróć do siadu.", "Na koniec zrób po 5 skłonów w każdym kierunku: wzdłuż nóg i na wprost."],
    Param_sets: 1, Param_reps: 8, Param_duration_sec: 0, Param_type: "reps",
    imageFileNames: ["2_7_dynamiczne_otwarcie_biodra_syrenka_1", "2_7_dynamiczne_otwarcie_biodra_syrenka_2"]
  },
  {
    Global_ID: 15, Sesja: 3, Source_ID: 1,
    Tytuł: "Wykroki do przodu", Media_URL: "", Typ_PL: "Siła",
    Cel_Target: "Mięśnie czworogłowe ud, pośladkowe", Pozycja_wyjściowa: "Pozycja stojąca", Partia_mięśniowa: "Czworogłowe ud, pośladki", Sprzęt: "Brak (masa ciała)",
    Uwaga_krytyczna: "Pod żadnym pozorem nie odrywaj pięty nogi przedniej od ziemi!",
    Instructions_JSON: ["Stań prosto, wykonaj głęboki krok do przodu.", "Obniżaj biodra dopóki kolano zakroczne nie dotknie podłoża.", "Utrzymuj tułów pionowo nie pochylając się do przodu.", "Zadbaj aby pięta nogi wykrocznej przylegała do podłoża."],
    Param_sets: 3, Param_reps: 8, Param_duration_sec: 0, Param_type: "reps",
    imageFileNames: ["3_1_wykroki_do_przodu"]
  },
  {
    Global_ID: 16, Sesja: 3, Source_ID: 2,
    Tytuł: "Przyciąganie drążka (ruch narciarski)", Media_URL: "", Typ_PL: "Siła",
    Cel_Target: "Mięśnie najszersze, naramienne, core", Pozycja_wyjściowa: "Pozycja stojąca", Partia_mięśniowa: "Najszersze grzbietu, naramienne, core", Sprzęt: "Guma oporowa, drążek",
    Uwaga_krytyczna: "Utrzymuj proste ręce i unikaj gwałtownych szarpnięć!",
    Instructions_JSON: ["Stań przodem do gumy w lekkim rozkroku.", "Chwyć drążek obiema rękami i unieś nad głowę.", "Ściągaj drążek w dół na prostych rękach (ruch narciarski).", "Kontroluj napięcie gumy podczas powrotu rąk."],
    Param_sets: 3, Param_reps: 12, Param_duration_sec: 0, Param_type: "reps",
    imageFileNames: ["3_2_przyciaganie_drazka_ruch_narciarski_"]
  },
  {
    Global_ID: 17, Sesja: 3, Source_ID: 3,
    Tytuł: "Przysiad z odważnikiem kettlebell", Media_URL: "", Typ_PL: "Siła",
    Cel_Target: "Mięśnie nóg, pośladki, brzuch głęboki", Pozycja_wyjściowa: "Pozycja stojąca", Partia_mięśniowa: "Nogi, pośladki, brzuch głęboki", Sprzęt: "Kettlebell",
    Uwaga_krytyczna: "Kluczowe jest izometryczne napięcie brzucha i prowadzenie kolan w linii palców.",
    Instructions_JSON: ["Przyjmij szeroki rozstaw stóp palce lekko na zewnątrz.", "Schodź w dół prowadząc kolana szeroko w linii stóp.", "Przed wstawaniem napnij mocno mięśnie brzucha.", "W końcowej fazie wyprostu wykonaj spięcie pośladków."],
    Param_sets: 3, Param_reps: 10, Param_duration_sec: 0, Param_type: "reps",
    imageFileNames: ["3_3_przysiad_z_odwaznikiem_kettlebell"]
  },
  {
    Global_ID: 18, Sesja: 3, Source_ID: 4,
    Tytuł: "Rumuński martwy ciąg", Media_URL: "", Typ_PL: "Siła",
    Cel_Target: "Grupa kulszowo-goleniowa, pośladki, prostowniki grzbietu", Pozycja_wyjściowa: "Pozycja stojąca", Partia_mięśniowa: "Tył uda, pośladki, plecy", Sprzęt: "Kettlebell",
    Uwaga_krytyczna: "Plecy muszą pozostać idealnie proste przez cały czas trwania ruchu!",
    Instructions_JSON: ["Stań ze stopami na szerokość bioder chwytając ciężar.", "Lekko ugnij kolana i wypychaj biodra mocno w tył.", "Opuszczaj ciężar prowadząc go blisko nóg.", "Poczuj rozciąganie z tyłu uda i dynamicznie wyprostuj biodra."],
    Param_sets: 3, Param_reps: 10, Param_duration_sec: 0, Param_type: "reps",
    imageFileNames: ["3_4_rumunski_martwy_ciag"]
  },
  {
    Global_ID: 19, Sesja: 4, Source_ID: 1,
    Tytuł: "Przenoszenie ciężaru ciała na beret rehabilitacyjny", Media_URL: "", Typ_PL: "Stabilizacja",
    Cel_Target: "Staw skokowy, kontrola nerwowo-mięśniowa", Pozycja_wyjściowa: "Pozycja stojąca", Partia_mięśniowa: "Mięśnie stopy, stawu skokowego, czworogłowy uda", Sprzęt: "Beret rehabilitacyjny",
    Uwaga_krytyczna: "Stopy muszą być ustawione równolegle do siebie przez całe ćwiczenie.",
    Instructions_JSON: ["Stań w lekkim rozkroku", "stopy ustawione równolegle.", "Wykonaj wykrok jedną nogą na beret rehabilitacyjny.", "Przenieś ciężar ciała na nogę wykroczną utrzymując równowagę.", "Przytrzymaj pozycję przez 5 sekund i wróć do pozycji wyjściowej."],
    Param_sets: 1, Param_reps: 5, Param_duration_sec: 0, Param_type: "time",
    imageFileNames: ["4_1_przenoszenie_ciezaru_ciala_na_beret_rehabilitacyjny"]
  },
  {
    Global_ID: 20, Sesja: 4, Source_ID: 2,
    Tytuł: "Wykrok na beret z kettlebell nad głową (Overhead Lunge)", Media_URL: "", Typ_PL: "Stabilizacja",
    Cel_Target: "Całe ciało, stabilizacja centralna (core), barki", Pozycja_wyjściowa: "Pozycja stojąca / Wykrok", Partia_mięśniowa: "Nogi, pośladki, brzuch, obręcz barkowa", Sprzęt: "Kettlebell, beret rehabilitacyjny",
    Uwaga_krytyczna: "Trzymaj ramię z ciężarkiem idealnie pionowo i blisko ucha; nie wyginaj pleców w łuk.",
    Instructions_JSON: ["Chwyć kettlebell w rękę przeciwną do nogi wykrocznej (np. prawa noga w przód, ciężarek w lewej ręce).", "Wyciśnij ciężarek nad głowę, ramię wyprostowane, łokieć zablokowany.", "Wykonaj wykrok na beret, utrzymując stabilną sylwetkę.", "Wróć do pozycji stojącej, cały czas trzymając ciężar nad głową."],
    Param_sets: 1, Param_reps: 15, Param_duration_sec: 0, Param_type: "reps",
    imageFileNames: ["4_2_wykrok_na_beret_z_kettlebell_nad_glowa_overhead_lunge_"]
  },
  {
    Global_ID: 21, Sesja: 4, Source_ID: 3,
    Tytuł: "Wypad boczny na beret (Lateral Lunge)", Media_URL: "", Typ_PL: "Stabilizacja",
    Cel_Target: "Przywodziciele, pośladki, stabilizacja boczna", Pozycja_wyjściowa: "Pozycja stojąca", Partia_mięśniowa: "Mięsień czworogłowy, pośladkowy średni, przywodziciele", Sprzęt: "Beret rehabilitacyjny, opcjonalnie kettlebell",
    Uwaga_krytyczna: "Noga zostająca w miejscu musi pozostać całkowicie wyprostowana w kolanie.",
    Instructions_JSON: ["Stań bokiem do beretu.", "Wykonaj obszerny krok w bok", "stawiając stopę na berecie.", "Zrób ćwierć-przysiad na nodze wykrocznej, przenosząc na nią ciężar.", "Zatrzymaj ruch na chwilę i dynamicznie wróć do pozycji wyjściowej."],
    Param_sets: 1, Param_reps: 15, Param_duration_sec: 0, Param_type: "reps",
    imageFileNames: ["4_3_wypad_boczny_na_beret_lateral_lunge_"]
  },
  {
    Global_ID: 22, Sesja: 4, Source_ID: 4,
    Tytuł: "Pozycja 'Bocian' z kettlebell nad głową", Media_URL: "", Typ_PL: "Stabilizacja",
    Cel_Target: "Równowaga, stabilizacja miednicy", Pozycja_wyjściowa: "Stanie jednonóż", Partia_mięśniowa: "Mięśnie głębokie (core), pośladkowy średni, barki", Sprzęt: "Kettlebell",
    Uwaga_krytyczna: "Nie odchylaj tułowia w bok",
    Instructions_JSON: ["Stań na jednej nodze, drugą unieś zgiętą w kolanie do 90 stopni. Miednica musi być ustawiona poziomo.", "Trzymaj KB w jednej ręce, wyciśnięty nad głowę.", "Utrzymaj idealny pion ciała, napinając brzuch i pośladki.", "Wzrok skierowany przed siebie w jeden punkt."],
    Param_sets: 1, Param_reps: 30, Param_duration_sec: 30, Param_type: "time",
    imageFileNames: ["4_4_pozycja_bocian_z_kettlebell_nad_glowa"]
  },
  {
    Global_ID: 23, Sesja: 4, Source_ID: 5,
    Tytuł: "Skręt tułowia w leżeniu (Rotacje)", Media_URL: "", Typ_PL: "Mobilizacja",
    Cel_Target: "Mobilizacja kręgosłupa", Pozycja_wyjściowa: "Leżenie na plecach", Partia_mięśniowa: "Kręgosłup, mięśnie skośne brzucha", Sprzęt: "Mata",
    Uwaga_krytyczna: "Barki muszą przylegać do podłogi przez cały czas.",
    Instructions_JSON: ["Leżenie na plecach, ręce szeroko na boki.", "Zegnij nogi w kolanach i unieś stopy nad podłogę.", "Powoli przenoś złączone kolana z jednej strony na drugą.", "Staraj się dotknąć kolanami podłogi, nie odrywając przeciwnego barku."],
    Param_sets: 2, Param_reps: 10, Param_duration_sec: 0, Param_type: "reps",
    imageFileNames: ["skret"]
  }
];
