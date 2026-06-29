const COUNTRY_TO_CODE: Record<string, string> = {
  "Afghanistan": "AF", "Albania": "AL", "Algeria": "DZ", "American Samoa": "AS",
  "Andorra": "AD", "Angola": "AO", "Anguilla": "AI", "Antigua and Barbuda": "AG",
  "Argentina": "AR", "Armenia": "AM", "Aruba": "AW", "Australia": "AU",
  "Austria": "AT", "Azerbaijan": "AZ",
  "Bahamas": "BS", "Bahrain": "BH", "Bangladesh": "BD", "Barbados": "BB",
  "Belarus": "BY", "Belgium": "BE", "Belize": "BZ", "Benin": "BJ",
  "Bermuda": "BM", "Bhutan": "BT", "Bolivia": "BO",
  "Bosnia and Herzegovina": "BA", "Botswana": "BW", "Brazil": "BR",
  "British Virgin Islands": "VG", "Brunei Darussalam": "BN", "Bulgaria": "BG",
  "Burkina Faso": "BF", "Burundi": "BI",
  "Cambodia": "KH", "Cameroon": "CM", "Canada": "CA", "Cape Verde": "CV",
  "Cayman Islands": "KY", "Central African Republic": "CF", "Chad": "TD",
  "Chile": "CL", "China": "CN", "Chinese Taipei": "TW", "Colombia": "CO",
  "Comoros": "KM", "Congo": "CG", "Congo DR": "CD", "Cook Islands": "CK",
  "Costa Rica": "CR", "Croatia": "HR", "Cuba": "CU", "Curaçao": "CW",
  "Cyprus": "CY", "Czech Republic": "CZ",
  "Denmark": "DK", "Djibouti": "DJ", "Dominica": "DM", "Dominican Republic": "DO",
  "Ecuador": "EC", "Egypt": "EG", "El Salvador": "SV",
  "England": "GB-ENG", "Equatorial Guinea": "GQ", "Eritrea": "ER", "Estonia": "EE",
  "Eswatini": "SZ", "Ethiopia": "ET",
  "Faroe Islands": "FO", "Fiji": "FJ", "Finland": "FI", "France": "FR",
  "Gabon": "GA", "Gambia": "GM", "Georgia": "GE", "Germany": "DE", "Ghana": "GH",
  "Gibraltar": "GI", "Greece": "GR", "Grenada": "GD", "Guam": "GU",
  "Guatemala": "GT", "Guinea": "GN", "Guinea-Bissau": "GW", "Guyana": "GY",
  "Haiti": "HT", "Honduras": "HN", "Hong Kong": "HK", "Hungary": "HU",
  "Iceland": "IS", "India": "IN", "Indonesia": "ID", "Iran": "IR", "Iraq": "IQ",
  "Israel": "IL", "Italy": "IT", "Ivory Coast": "CI",
  "Jamaica": "JM", "Japan": "JP", "Jordan": "JO",
  "Kazakhstan": "KZ", "Kenya": "KE", "Kosovo": "XK", "Kuwait": "KW",
  "Kyrgyzstan": "KG",
  "Laos": "LA", "Latvia": "LV", "Lebanon": "LB", "Lesotho": "LS", "Liberia": "LR",
  "Libya": "LY", "Liechtenstein": "LI", "Lithuania": "LT", "Luxembourg": "LU",
  "Macau": "MO", "Madagascar": "MG", "Malawi": "MW", "Malaysia": "MY",
  "Maldives": "MV", "Mali": "ML", "Malta": "MT", "Mauritania": "MR",
  "Mauritius": "MU", "Mexico": "MX", "Moldova": "MD", "Mongolia": "MN",
  "Montenegro": "ME", "Montserrat": "MS", "Morocco": "MA", "Mozambique": "MZ",
  "Myanmar": "MM",
  "Namibia": "NA", "Nepal": "NP", "Netherlands": "NL", "New Caledonia": "NC",
  "New Zealand": "NZ", "Nicaragua": "NI", "Niger": "NE", "Nigeria": "NG",
  "North Korea": "KP", "North Macedonia": "MK", "Northern Ireland": "GB-NIR",
  "Norway": "NO",
  "Oman": "OM",
  "Pakistan": "PK", "Palestine": "PS", "Panama": "PA", "Papua New Guinea": "PG",
  "Paraguay": "PY", "Peru": "PE", "Philippines": "PH", "Poland": "PL",
  "Portugal": "PT", "Puerto Rico": "PR",
  "Qatar": "QA",
  "Republic of Ireland": "IE", "Romania": "RO", "Russia": "RU", "Rwanda": "RW",
  "Saint Kitts and Nevis": "KN", "Saint Lucia": "LC",
  "Saint Vincent and the Grenadines": "VC", "Samoa": "WS", "San Marino": "SM",
  "Sao Tome and Principe": "ST", "Saudi Arabia": "SA",
  "Scotland": "GB-SCT", "Senegal": "SN", "Serbia": "RS", "Seychelles": "SC",
  "Sierra Leone": "SL", "Singapore": "SG", "Slovakia": "SK", "Slovenia": "SI",
  "Solomon Islands": "SB", "Somalia": "SO", "South Africa": "ZA",
  "South Korea": "KR", "South Sudan": "SS", "Spain": "ES", "Sri Lanka": "LK",
  "Sudan": "SD", "Suriname": "SR", "Sweden": "SE", "Switzerland": "CH",
  "Syria": "SY",
  "Tahiti": "PF", "Tajikistan": "TJ", "Tanzania": "TZ", "Thailand": "TH",
  "Timor-Leste": "TL", "Togo": "TG", "Tonga": "TO",
  "Trinidad and Tobago": "TT", "Tunisia": "TN", "Turkey": "TR",
  "Turkmenistan": "TM", "Turks and Caicos Islands": "TC",
  "Uganda": "UG", "Ukraine": "UA", "United Arab Emirates": "AE",
  "United States": "US", "Uruguay": "UY", "US Virgin Islands": "VI",
  "Uzbekistan": "UZ",
  "Vanuatu": "VU", "Venezuela": "VE", "Vietnam": "VN",
  "Wales": "GB-WLS",
  "Yemen": "YE",
  "Zambia": "ZM", "Zimbabwe": "ZW",
};

function countryCodeToFlag(code: string): string {
  if (/^[A-Z]{2}$/.test(code)) {
    return String.fromCodePoint(
      ...code.split("").map((c) => 0x1F1E6 + c.charCodeAt(0) - 65)
    );
  }
  if (code === "GB-ENG")
    return "\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67\uDB40\uDC7F";
  if (code === "GB-SCT")
    return "\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74\uDB40\uDC7F";
  if (code === "GB-WLS")
    return "\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73\uDB40\uDC7F";
  return "\uD83C\uDDEC\uD83C\uDDE7";
}

export function getFlagEmoji(countryName: string): string {
  const code = COUNTRY_TO_CODE[countryName];
  if (!code) return "";
  return countryCodeToFlag(code);
}
