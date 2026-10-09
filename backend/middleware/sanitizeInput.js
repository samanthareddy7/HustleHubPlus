
// text fields where HTML tags are never legitimate
const TEXT_FIELDS = ["name", "title", "description", "category"];

const stripHtml = (value) =>
  value.replace(/<[^>]*>/g, "").replace(/[<>]/g, "").trim();

const clean = (value, key) => {
  if (Array.isArray(value)) {
    return value.map((item) => clean(item, key));
  }

  if (value !== null && typeof value === "object") {
    const safe = {};
    for (const [k, v] of Object.entries(value)) {
      if (k.startsWith("$") || k.includes(".")) continue;
      safe[k] = clean(v, k);
    }
    return safe;
  }

  if (typeof value === "string" && TEXT_FIELDS.includes(key)) {
    return stripHtml(value);
  }

  return value;
};

const sanitizeInput = (req, res, next) => {
  if (req.body && typeof req.body === "object") {
    req.body = clean(req.body);
  }
  next();
};

module.exports = sanitizeInput;