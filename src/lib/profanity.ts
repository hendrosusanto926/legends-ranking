const OFFENSIVE_WORDS = [
  "anjing", "babi", "bangsat", "kontol", "memek",
  "fuck", "shit", "asshole", "bastard", "bitch",
  "cunt", "dick", "piss", "slut", "damn",
];

export function filterProfanity(text: string): string {
  let result = text;
  for (const word of OFFENSIVE_WORDS) {
    const regex = new RegExp(word, "gi");
    result = result.replace(regex, "*****");
  }
  return result;
}
