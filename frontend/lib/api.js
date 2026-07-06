const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function api(path, { method = "GET", body, token, isFormData = false } = {}) {
  const headers = { Accept: "application/json" };
  if (!isFormData) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  });

  const json = await res.json().catch(() => null);

  if (!res.ok || json?.flag === false) {
    throw { status: res.status, message: json?.msg, errors: json?.errors, data: json?.data };
  }
  return json;
}