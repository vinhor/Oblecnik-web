export const onRequestGet = async (context) => {
  const { search } = new URL(context.request.url);
  const apiUrl = `https://api.met.no/weatherapi/locationforecast/2.0/compact${search}`;

  const response = await fetch(apiUrl, {
    headers: {
      "User-Agent": "oblecnik/1.0 (vincent.horecky@seznam.cz)",
    },
  });

  const data = await response.json();
  return new Response(data, {
    headers: { "Content-Type": "application/json" },
  });
};
