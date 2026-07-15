// Escapes regex special characters in user-supplied search text before it's
// used to build a MongoDB $regex filter — without this, a search string
// containing regex metacharacters (e.g. ".*", "(", "|") could either throw,
// match unintended documents, or in pathological cases cause catastrophic
// backtracking (ReDoS) against a large collection.
function escapeRegex(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Pagination is opt-in and backward-compatible: callers that don't pass
// `page`/`limit` get `null` back and should just run their query
// unpaginated exactly as before — existing frontend code that expects a
// flat, complete array keeps working unchanged. Only when a caller
// explicitly starts sending these params does the endpoint start slicing
// at the database level (via .skip()/.limit()) instead of loading
// everything into memory.
function parsePagination(query, { defaultLimit = 20, maxLimit = 100 } = {}) {
  const hasPage = query.page !== undefined;
  const hasLimit = query.limit !== undefined;
  if (!hasPage && !hasLimit) return null;

  let page = parseInt(query.page, 10);
  if (!Number.isFinite(page) || page < 1) page = 1;

  let limit = parseInt(query.limit, 10);
  if (!Number.isFinite(limit) || limit < 1) limit = defaultLimit;
  limit = Math.min(limit, maxLimit);

  return { page, limit, skip: (page - 1) * limit };
}

module.exports = { escapeRegex, parsePagination };
