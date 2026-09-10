/**
 * Jaro-Winkler Similarity (BR-05)
 * Đo độ tương đồng giữa 2 chuỗi, trả về 0-1
 */
export function jaroWinkler(a: string, b: string): number {
  if (a === b) return 1;
  const lenA = a.length;
  const lenB = b.length;
  if (lenA === 0 || lenB === 0) return 0;

  const matchWindow = Math.floor(Math.max(lenA, lenB) / 2) - 1;
  if (matchWindow < 0) return 0;

  const aMatches = new Array(lenA).fill(false);
  const bMatches = new Array(lenB).fill(false);

  let matches = 0;
  let transpositions = 0;

  for (let i = 0; i < lenA; i++) {
    const start = Math.max(0, i - matchWindow);
    const end = Math.min(i + matchWindow + 1, lenB);
    for (let j = start; j < end; j++) {
      if (bMatches[j] || a[i] !== b[j]) continue;
      aMatches[i] = true;
      bMatches[j] = true;
      matches++;
      break;
    }
  }

  if (matches === 0) return 0;

  let k = 0;
  for (let i = 0; i < lenA; i++) {
    if (!aMatches[i]) continue;
    while (!bMatches[k]) k++;
    if (a[i] !== b[k]) transpositions++;
    k++;
  }

  const jaro = (matches / lenA + matches / lenB + (matches - transpositions / 2) / matches) / 3;

  // Winkler prefix (shared prefix ≤ 4 chars)
  let prefix = 0;
  for (let i = 0; i < Math.min(4, Math.min(lenA, lenB)); i++) {
    if (a[i] === b[i]) prefix++;
    else break;
  }

  return jaro + prefix * 0.1 * (1 - jaro);
}

/**
 * Jaccard Similarity (BR-05)
 * Đo overlap giữa 2 tập hợp, trả về 0-1
 */
export function jaccardSimilarity(setA: string[], setB: string[]): number {
  if (setA.length === 0 && setB.length === 0) return 1;
  if (setA.length === 0 || setB.length === 0) return 0;

  const a = new Set(setA.map(s => s.toLowerCase().trim()));
  const b = new Set(setB.map(s => s.toLowerCase().trim()));

  let intersection = 0;
  for (const item of a) {
    if (b.has(item)) intersection++;
  }

  const union = a.size + b.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

/**
 * Chuẩn hóa chuỗi Việt: bỏ dấu, lowercase, trim
 */
function normalizeVn(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, ' ');
}

/**
 * BR-05: Kiểm tra trùng lặp công thức
 * Title similarity ≥90% (Jaro-Winkler) + Ingredient overlap ≥80% (Jaccard)
 */
export function isDuplicate(
  titleA: string,
  ingredientsA: string[],
  titleB: string,
  ingredientsB: string[],
): boolean {
  const titleSim = jaroWinkler(normalizeVn(titleA), normalizeVn(titleB));
  const ingredientSim = jaccardSimilarity(ingredientsA, ingredientsB);

  return titleSim >= 0.9 && ingredientSim >= 0.8;
}
