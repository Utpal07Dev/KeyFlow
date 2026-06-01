// words.js
// Purpose: word bank + a function to pick random words
// No DOM, no events — pure data only

const WORDS = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "it",
  "for", "not", "on", "with", "he", "as", "you", "do", "at", "this",
  "but", "his", "by", "from", "they", "we", "say", "her", "she", "or",
  "an", "will", "my", "one", "all", "would", "there", "their", "what",
  "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
  "when", "make", "can", "like", "time", "no", "just", "him", "know",
  "take", "people", "into", "year", "your", "good", "some", "could",
  "them", "see", "other", "than", "then", "now", "look", "only", "come",
  "its", "over", "think", "also", "back", "after", "use", "two", "how",
  "our", "work", "first", "well", "way", "even", "new", "want", "because",
  "any", "these", "give", "day", "most", "us", "great", "between", "need",
  "large", "often", "hand", "high", "place", "hold", "turn", "such",
  "here", "why", "help", "talk", "again", "still", "every", "old", "tell",
  "much", "ask", "try", "world", "keep", "life", "never", "while", "last",
  "might", "next", "few", "more", "light", "thing", "point", "small",
  "number", "off", "always", "move", "show", "around", "form", "three",
  "small", "set", "put", "end", "home", "read", "left", "along", "both",
  "paper", "music", "those", "mark", "until", "far", "above", "page",
  "found", "real", "below", "draw", "short", "bring", "plain", "cross",
  "city", "open", "seem", "together", "start", "carry", "state", "once",
  "book", "hear", "stop", "without", "second", "later", "miss", "idea",
  "enough", "eat", "face", "watch", "far", "indian", "real", "almost",
  "let", "above", "girl", "sometimes", "mountain", "cut", "young", "talk",
  "soon", "list", "song", "being", "leave", "family", "body", "music",
  "color", "stand", "sun", "question", "fish", "area", "mark", "dog",
  "horse", "birds", "problem", "complete", "room", "knew", "since", "ever",
  "piece", "told", "usually", "didn't", "friends", "easy", "heard", "order",
  "red", "door", "sure", "become", "top", "ship", "across", "today",
  "during", "short", "better", "best", "however", "low", "hours", "black",
  "products", "happened", "whole", "measure", "remember", "early", "waves",
  "reached", "listen", "wind", "rock", "space", "covered", "fast", "several",
  "hold", "himself", "toward", "five", "step", "morning", "passed", "vowel",
  "true", "hundred", "against", "pattern", "numeral", "table", "north",
  "slowly", "money", "map", "farm", "pulled", "draw", "voice", "seen",
  "cold", "cried", "plan", "notice", "south", "sing", "war", "ground",
  "fall", "king", "town", "unit", "figure", "certain", "field", "travel",
  "wood", "fire", "upon", "done", "dark", "machine", "base", "ago",
  "stood", "plane", "system", "behind", "ran", "round", "boat", "game",
  "force", "brought", "understand", "warm", "common", "bring", "explain",
  "dry", "though", "language", "shape", "deep", "thousands", "yes", "clear",
  "equation", "yet", "government", "filled", "heat", "full", "hot", "check",
  "object", "rule", "among", "noun", "power", "cannot", "able", "six",
  "size", "dark", "ball", "material", "special", "heavy", "fine", "pair",
  "circle", "include", "built", "can't", "matter", "square", "syllables"
];

// Returns an array of n randomly picked words
function pickWords(n) {
  const result = [];
  for (let i = 0; i < n; i++) {
    const randomIndex = Math.floor(Math.random() * WORDS.length);
    result.push(WORDS[randomIndex]);
  }
  return result;
}