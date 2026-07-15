// Strips MongoDB operator keys ($gt, $where, etc.) and dotted keys (which
// can be used for nested-field injection) from user-controlled input, to
// prevent NoSQL operator-injection attacks — e.g. a login payload of
// { email: { "$gt": "" }, password: { "$gt": "" } } matching every user
// instead of comparing against a real string.
//
// Written from scratch rather than using the popular `express-mongo-sanitize`
// package: that package unconditionally reassigns `req.query = ...`, which
// throws on Express 5 (`req.query` is a getter-only accessor there — verified
// directly against a live Express 5 server before writing this). This
// middleware instead uses Object.defineProperty to safely replace req.query,
// and mutates req.body/req.params in place since those remain plain writable
// objects in Express 5.

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function sanitizeValue(value) {
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (isPlainObject(value)) {
    const clean = {};
    for (const [key, val] of Object.entries(value)) {
      if (key.startsWith("$") || key.includes(".")) continue; // drop dangerous keys entirely
      clean[key] = sanitizeValue(val);
    }
    return clean;
  }
  return value;
}

function mongoSanitize() {
  return (req, res, next) => {
    if (req.body && isPlainObject(req.body)) {
      const clean = sanitizeValue(req.body);
      // Mutate in place rather than reassign — req.body is a plain
      // writable object in Express 5, so this is simpler and doesn't need
      // the defineProperty workaround req.query requires.
      for (const key of Object.keys(req.body)) delete req.body[key];
      Object.assign(req.body, clean);
    }

    if (req.query && isPlainObject(req.query)) {
      const clean = sanitizeValue(req.query);
      Object.defineProperty(req, "query", {
        value: clean,
        writable: true,
        configurable: true,
      });
    }

    if (req.params && isPlainObject(req.params)) {
      const clean = sanitizeValue(req.params);
      for (const key of Object.keys(req.params)) delete req.params[key];
      Object.assign(req.params, clean);
    }

    next();
  };
}

module.exports = mongoSanitize;
