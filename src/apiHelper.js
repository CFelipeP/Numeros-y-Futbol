export function getToken() {
  return localStorage.getItem("token");
}

export function getAuthHeaders(contentType) {
  const headers = {};
  if (contentType) headers["Content-Type"] = contentType;
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export function apiFetch(url, options = {}) {
  const headers = getAuthHeaders(options.contentType);
  if (options.headers) Object.assign(headers, options.headers);
  return fetch(url, { ...options, headers });
}

export function apiPost(url, body) {
  return apiFetch(url, {
    method: "POST",
    contentType: "application/json",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function apiPostForm(url, formData) {
  return apiFetch(url, {
    method: "POST",
    body: formData,
  });
}
