export async function api(path, method = "GET", body) {
  const response = await fetch(path, {
    method,
    headers: body === undefined ? {} : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });
  const data = await response.json();
  if (!response.ok)
    throw Error(data.error || `Request failed (${response.status}).`);
  return data;
}
export const inputClass =
  "mt-1.5 block min-h-[41px] w-full rounded-[10px] border border-[#d7e3d6] bg-white px-3 text-[12px] outline-offset-2 focus:border-[#417a50]";
export const buttonClass =
  "inline-flex min-h-[40px] items-center justify-center gap-2 rounded-full bg-[#193f2b] px-5 text-[12px] font-extrabold text-white hover:bg-[#2b6643] disabled:opacity-50";
