export async function authedFetch() {}

export async function unauthedFetch(url, options) {
  const o = {
    body: JSON.stringify(options.body),
    method: options.method,
    headers: {
      "Content-Type": "application/json",
    },
  };
  return await fetch(url, o);
}
