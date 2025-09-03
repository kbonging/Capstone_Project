export function toAbsoluteUrl(path = "") {
  const base = (import.meta.env.VITE_API_BASE || "").replace(/\/+$/, "");
  const raw  = String(path || "").trim().replace(/^\/\//, "/");
  if (/^https?:\/\//i.test(raw)) return raw;
  const parts = raw.split("/").filter(Boolean);
  const name = parts.pop() || "";
  const encoded = encodeURIComponent(name);
  const joined = [...parts, encoded].join("/");
  return base ? `${base}/${joined}` : `/${joined}`;
}