import { Item, MatchScore } from '../types/index.js';

// Common words to filter out during keyword extraction
const STOP_WORDS = new Set([
  'the', 'and', 'with', 'for', 'this', 'that', 'from', 'into', 'over', 'after',
  'left', 'near', 'some', 'desk', 'room', 'floor', 'hall', 'case', 'campus', 'item',
]);

const tokenize = (text: string): string[] => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !STOP_WORDS.has(word));
};

export const calculateItemMatch = (target: Item, candidate: Item): MatchScore | null => {
  // Only match opposite types (lost vs found)
  if (target.type === candidate.type) return null;

  // Do not match already returned items
  if (candidate.status === 'Returned' || target.status === 'Returned') return null;

  let score = 0;
  const matchReasons: string[] = [];

  // 1. Category match (Critical baseline)
  if (target.category === candidate.category) {
    score += 0.35;
    matchReasons.push(`Both belong to the "${target.category}" category`);
  }

  // 2. Name keywords similarity
  const targetNameTokens = new Set(tokenize(target.name));
  const candidateNameTokens = new Set(tokenize(candidate.name));
  const nameIntersections = [...targetNameTokens].filter(t => candidateNameTokens.has(t));

  if (nameIntersections.length > 0) {
    const nameWeight = Math.min(0.35, nameIntersections.length * 0.18);
    score += nameWeight;
    matchReasons.push(`Matching keywords in title: ${nameIntersections.slice(0, 3).join(', ')}`);
  }

  // 3. Location match
  const targetLocTokens = new Set(tokenize(target.location));
  const candidateLocTokens = new Set(tokenize(candidate.location));
  const locIntersections = [...targetLocTokens].filter(t => candidateLocTokens.has(t));

  if (locIntersections.length > 0) {
    score += 0.20;
    matchReasons.push(`Both reported around: ${locIntersections.slice(0, 2).join(' ')}`);
  }

  // 4. Date proximity (within 5 days)
  try {
    const tDate = new Date(target.date).getTime();
    const cDate = new Date(candidate.date).getTime();
    const diffDays = Math.abs(tDate - cDate) / (1000 * 60 * 60 * 24);
    if (diffDays <= 4) {
      score += 0.10;
      matchReasons.push(`Report dates within ${Math.ceil(diffDays)} day(s) of each other`);
    }
  } catch {
    // ignore date parse issues
  }

  // 5. Description keyword overlap
  const targetDescTokens = new Set(tokenize(target.description));
  const candidateDescTokens = new Set(tokenize(candidate.description));
  const descIntersections = [...targetDescTokens].filter(t => candidateDescTokens.has(t));

  if (descIntersections.length >= 2) {
    score += 0.10;
    matchReasons.push(`Similar description features: ${descIntersections.slice(0, 3).join(', ')}`);
  }

  // Threshold for candidate match
  if (score >= 0.40) {
    return {
      item: candidate,
      score: Math.min(0.95, Number(score.toFixed(2))),
      matchReasons,
    };
  }

  return null;
};

export const findMatchesFor = (targetItem: Item, allItems: Item[]): MatchScore[] => {
  const matches: MatchScore[] = [];

  for (const candidate of allItems) {
    if (candidate.id === targetItem.id) continue;
    const result = calculateItemMatch(targetItem, candidate);
    if (result) {
      matches.push(result);
    }
  }

  return matches.sort((a, b) => b.score - a.score);
};
