const countries = [
  {
    "Country": "Afghanistan",
    "Slug": "afghanistan"
  },
  {
    "Country": "Albania",
    "Slug": "albania"
  },
  {
    "Country": "Algeria",
    "Slug": "algeria"
  },
  {
    "Country": "Andorra",
    "Slug": "andorra"
  },
  {
    "Country": "Angola",
    "Slug": "angola"
  },
  {
    "Country": "Antigua and Barbuda",
    "Slug": "antigua-and-barbuda"
  },
  {
    "Country": "Argentina",
    "Slug": "argentina"
  },
  {
    "Country": "Armenia",
    "Slug": "armenia"
  },
  {
    "Country": "Australia",
    "Slug": "australia"
  },
  {
    "Country": "Austria",
    "Slug": "austria"
  },
  {
    "Country": "Azerbaijan",
    "Slug": "azerbaijan"
  },
  {
    "Country": "Bahamas",
    "Slug": "bahamas"
  },
  {
    "Country": "Bahrain",
    "Slug": "bahrain"
  },
  {
    "Country": "Bangladesh",
    "Slug": "bangladesh"
  },
  {
    "Country": "Barbados",
    "Slug": "barbados"
  },
  {
    "Country": "Belarus",
    "Slug": "belarus"
  },
  {
    "Country": "Belgium",
    "Slug": "belgium"
  },
  {
    "Country": "Belize",
    "Slug": "belize"
  },
  {
    "Country": "Benin",
    "Slug": "benin"
  },
  {
    "Country": "Bhutan",
    "Slug": "bhutan"
  },
  {
    "Country": "Bolivia",
    "Slug": "bolivia"
  },
  {
    "Country": "Bosnia and Herzegovina",
    "Slug": "bosnia-and-herzegovina"
  },
  {
    "Country": "Botswana",
    "Slug": "botswana"
  },
  {
    "Country": "Brazil",
    "Slug": "brazil"
  },
  {
    "Country": "Brunei",
    "Slug": "brunei"
  },
  {
    "Country": "Bulgaria",
    "Slug": "bulgaria"
  },
  {
    "Country": "Burkina Faso",
    "Slug": "burkina-faso"
  },
  {
    "Country": "Burma",
    "Slug": "burma"
  },
  {
    "Country": "Burundi",
    "Slug": "burundi"
  },
  {
    "Country": "Cabo Verde",
    "Slug": "cabo-verde"
  },
  {
    "Country": "Cambodia",
    "Slug": "cambodia"
  },
  {
    "Country": "Cameroon",
    "Slug": "cameroon"
  },
  {
    "Country": "Canada",
    "Slug": "canada"
  },
  {
    "Country": "Central African Republic",
    "Slug": "central-african-republic"
  },
  {
    "Country": "Chad",
    "Slug": "chad"
  },
  {
    "Country": "Chile",
    "Slug": "chile"
  },
  {
    "Country": "China",
    "Slug": "china"
  },
  {
    "Country": "Colombia",
    "Slug": "colombia"
  },
  {
    "Country": "Comoros",
    "Slug": "comoros"
  },
  {
    "Country": "Congo (Brazzaville)",
    "Slug": "congo-(brazzaville)"
  },
  {
    "Country": "Congo (Kinshasa)",
    "Slug": "congo-(kinshasa)"
  },
  {
    "Country": "Costa Rica",
    "Slug": "costa-rica"
  },
  {
    "Country": "Cote d'Ivoire",
    "Slug": "cote-d'ivoire"
  },
  {
    "Country": "Croatia",
    "Slug": "croatia"
  },
  {
    "Country": "Cuba",
    "Slug": "cuba"
  },
  {
    "Country": "Cyprus",
    "Slug": "cyprus"
  },
  {
    "Country": "Czechia",
    "Slug": "czechia"
  },
  {
    "Country": "Denmark",
    "Slug": "denmark"
  },
  {
    "Country": "Diamond Princess",
    "Slug": "diamond-princess"
  },
  {
    "Country": "Djibouti",
    "Slug": "djibouti"
  },
  {
    "Country": "Dominica",
    "Slug": "dominica"
  },
  {
    "Country": "Dominican Republic",
    "Slug": "dominican-republic"
  },
  {
    "Country": "Ecuador",
    "Slug": "ecuador"
  },
  {
    "Country": "Egypt",
    "Slug": "egypt"
  },
  {
    "Country": "El Salvador",
    "Slug": "el-salvador"
  },
  {
    "Country": "Equatorial Guinea",
    "Slug": "equatorial-guinea"
  },
  {
    "Country": "Eritrea",
    "Slug": "eritrea"
  },
  {
    "Country": "Estonia",
    "Slug": "estonia"
  },
  {
    "Country": "Eswatini",
    "Slug": "eswatini"
  },
  {
    "Country": "Ethiopia",
    "Slug": "ethiopia"
  },
  {
    "Country": "Fiji",
    "Slug": "fiji"
  },
  {
    "Country": "Finland",
    "Slug": "finland"
  },
  {
    "Country": "France",
    "Slug": "france"
  },
  {
    "Country": "Gabon",
    "Slug": "gabon"
  },
  {
    "Country": "Gambia",
    "Slug": "gambia"
  },
  {
    "Country": "Georgia",
    "Slug": "georgia"
  },
  {
    "Country": "Germany",
    "Slug": "germany"
  },
  {
    "Country": "Ghana",
    "Slug": "ghana"
  },
  {
    "Country": "Greece",
    "Slug": "greece"
  },
  {
    "Country": "Grenada",
    "Slug": "grenada"
  },
  {
    "Country": "Guatemala",
    "Slug": "guatemala"
  },
  {
    "Country": "Guinea",
    "Slug": "guinea"
  },
  {
    "Country": "Guinea-Bissau",
    "Slug": "guinea-bissau"
  },
  {
    "Country": "Guyana",
    "Slug": "guyana"
  },
  {
    "Country": "Haiti",
    "Slug": "haiti"
  },
  {
    "Country": "Holy See",
    "Slug": "holy-see"
  },
  {
    "Country": "Honduras",
    "Slug": "honduras"
  },
  {
    "Country": "Hungary",
    "Slug": "hungary"
  },
  {
    "Country": "Iceland",
    "Slug": "iceland"
  },
  {
    "Country": "India",
    "Slug": "india"
  },
  {
    "Country": "Indonesia",
    "Slug": "indonesia"
  },
  {
    "Country": "Iran",
    "Slug": "iran"
  },
  {
    "Country": "Iraq",
    "Slug": "iraq"
  },
  {
    "Country": "Ireland",
    "Slug": "ireland"
  },
  {
    "Country": "Israel",
    "Slug": "israel"
  },
  {
    "Country": "Italy",
    "Slug": "italy"
  },
  {
    "Country": "Jamaica",
    "Slug": "jamaica"
  },
  {
    "Country": "Japan",
    "Slug": "japan"
  },
  {
    "Country": "Jordan",
    "Slug": "jordan"
  },
  {
    "Country": "Kazakhstan",
    "Slug": "kazakhstan"
  },
  {
    "Country": "Kenya",
    "Slug": "kenya"
  },
  {
    "Country": "Korea, South",
    "Slug": "korea,-south"
  },
  {
    "Country": "Kosovo",
    "Slug": "kosovo"
  },
  {
    "Country": "Kuwait",
    "Slug": "kuwait"
  },
  {
    "Country": "Kyrgyzstan",
    "Slug": "kyrgyzstan"
  },
  {
    "Country": "Laos",
    "Slug": "laos"
  },
  {
    "Country": "Latvia",
    "Slug": "latvia"
  },
  {
    "Country": "Lebanon",
    "Slug": "lebanon"
  },
  {
    "Country": "Liberia",
    "Slug": "liberia"
  },
  {
    "Country": "Libya",
    "Slug": "libya"
  },
  {
    "Country": "Liechtenstein",
    "Slug": "liechtenstein"
  },
  {
    "Country": "Lithuania",
    "Slug": "lithuania"
  },
  {
    "Country": "Luxembourg",
    "Slug": "luxembourg"
  },
  {
    "Country": "MS Zaandam",
    "Slug": "ms-zaandam"
  },
  {
    "Country": "Madagascar",
    "Slug": "madagascar"
  },
  {
    "Country": "Malawi",
    "Slug": "malawi"
  },
  {
    "Country": "Malaysia",
    "Slug": "malaysia"
  },
  {
    "Country": "Maldives",
    "Slug": "maldives"
  },
  {
    "Country": "Mali",
    "Slug": "mali"
  },
  {
    "Country": "Malta",
    "Slug": "malta"
  },
  {
    "Country": "Mauritania",
    "Slug": "mauritania"
  },
  {
    "Country": "Mauritius",
    "Slug": "mauritius"
  },
  {
    "Country": "Mexico",
    "Slug": "mexico"
  },
  {
    "Country": "Moldova",
    "Slug": "moldova"
  },
  {
    "Country": "Monaco",
    "Slug": "monaco"
  },
  {
    "Country": "Mongolia",
    "Slug": "mongolia"
  },
  {
    "Country": "Montenegro",
    "Slug": "montenegro"
  },
  {
    "Country": "Morocco",
    "Slug": "morocco"
  },
  {
    "Country": "Mozambique",
    "Slug": "mozambique"
  },
  {
    "Country": "Namibia",
    "Slug": "namibia"
  },
  {
    "Country": "Nepal",
    "Slug": "nepal"
  },
  {
    "Country": "Netherlands",
    "Slug": "netherlands"
  },
  {
    "Country": "New Zealand",
    "Slug": "new-zealand"
  },
  {
    "Country": "Nicaragua",
    "Slug": "nicaragua"
  },
  {
    "Country": "Niger",
    "Slug": "niger"
  },
  {
    "Country": "Nigeria",
    "Slug": "nigeria"
  },
  {
    "Country": "North Macedonia",
    "Slug": "north-macedonia"
  },
  {
    "Country": "Norway",
    "Slug": "norway"
  },
  {
    "Country": "Oman",
    "Slug": "oman"
  },
  {
    "Country": "Pakistan",
    "Slug": "pakistan"
  },
  {
    "Country": "Panama",
    "Slug": "panama"
  },
  {
    "Country": "Papua New Guinea",
    "Slug": "papua-new-guinea"
  },
  {
    "Country": "Paraguay",
    "Slug": "paraguay"
  },
  {
    "Country": "Peru",
    "Slug": "peru"
  },
  {
    "Country": "Philippines",
    "Slug": "philippines"
  },
  {
    "Country": "Poland",
    "Slug": "poland"
  },
  {
    "Country": "Portugal",
    "Slug": "portugal"
  },
  {
    "Country": "Qatar",
    "Slug": "qatar"
  },
  {
    "Country": "Romania",
    "Slug": "romania"
  },
  {
    "Country": "Russia",
    "Slug": "russia"
  },
  {
    "Country": "Rwanda",
    "Slug": "rwanda"
  },
  {
    "Country": "Saint Kitts and Nevis",
    "Slug": "saint-kitts-and-nevis"
  },
  {
    "Country": "Saint Lucia",
    "Slug": "saint-lucia"
  },
  {
    "Country": "Saint Vincent and the Grenadines",
    "Slug": "saint-vincent-and-the-grenadines"
  },
  {
    "Country": "San Marino",
    "Slug": "san-marino"
  },
  {
    "Country": "Sao Tome and Principe",
    "Slug": "sao-tome-and-principe"
  },
  {
    "Country": "Saudi Arabia",
    "Slug": "saudi-arabia"
  },
  {
    "Country": "Senegal",
    "Slug": "senegal"
  },
  {
    "Country": "Serbia",
    "Slug": "serbia"
  },
  {
    "Country": "Seychelles",
    "Slug": "seychelles"
  },
  {
    "Country": "Sierra Leone",
    "Slug": "sierra-leone"
  },
  {
    "Country": "Singapore",
    "Slug": "singapore"
  },
  {
    "Country": "Slovakia",
    "Slug": "slovakia"
  },
  {
    "Country": "Slovenia",
    "Slug": "slovenia"
  },
  {
    "Country": "Somalia",
    "Slug": "somalia"
  },
  {
    "Country": "South Africa",
    "Slug": "south-africa"
  },
  {
    "Country": "South Sudan",
    "Slug": "south-sudan"
  },
  {
    "Country": "Spain",
    "Slug": "spain"
  },
  {
    "Country": "Sri Lanka",
    "Slug": "sri-lanka"
  },
  {
    "Country": "Sudan",
    "Slug": "sudan"
  },
  {
    "Country": "Suriname",
    "Slug": "suriname"
  },
  {
    "Country": "Sweden",
    "Slug": "sweden"
  },
  {
    "Country": "Switzerland",
    "Slug": "switzerland"
  },
  {
    "Country": "Syria",
    "Slug": "syria"
  },
  {
    "Country": "Taiwan",
    "Slug": "taiwan*"
  },
  {
    "Country": "Tajikistan",
    "Slug": "tajikistan"
  },
  {
    "Country": "Tanzania",
    "Slug": "tanzania"
  },
  {
    "Country": "Thailand",
    "Slug": "thailand"
  },
  {
    "Country": "Timor-Leste",
    "Slug": "timor-leste"
  },
  {
    "Country": "Togo",
    "Slug": "togo"
  },
  {
    "Country": "Trinidad and Tobago",
    "Slug": "trinidad-and-tobago"
  },
  {
    "Country": "Tunisia",
    "Slug": "tunisia"
  },
  {
    "Country": "Turkey",
    "Slug": "turkey"
  },
  {
    "Country": "US",
    "Slug": "us"
  },
  {
    "Country": "Uganda",
    "Slug": "uganda"
  },
  {
    "Country": "Ukraine",
    "Slug": "ukraine"
  },
  {
    "Country": "United Arab Emirates",
    "Slug": "united-arab-emirates"
  },
  {
    "Country": "United Kingdom",
    "Slug": "united-kingdom"
  },
  {
    "Country": "Uruguay",
    "Slug": "uruguay"
  },
  {
    "Country": "Uzbekistan",
    "Slug": "uzbekistan"
  },
  {
    "Country": "Venezuela",
    "Slug": "venezuela"
  },
  {
    "Country": "Vietnam",
    "Slug": "vietnam"
  },
  {
    "Country": "West Bank and Gaza",
    "Slug": "west-bank-and-gaza"
  },
  {
    "Country": "Western Sahara",
    "Slug": "western-sahara"
  },
  {
    "Country": "Yemen",
    "Slug": "yemen"
  },
  {
    "Country": "Zambia",
    "Slug": "zambia"
  },
  {
    "Country": "Zimbabwe",
    "Slug": "zimbabwe"
  }
];

export default countries;
export const preselectedCountry = process.env.VUE_APP_I18N_COUNTRY || 'germany';
export const selectedSlug = {"Slug": preselectedCountry};
