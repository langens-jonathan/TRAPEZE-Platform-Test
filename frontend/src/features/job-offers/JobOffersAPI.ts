import JobOffer from "../../models/JobOffer";

export async function getJobOffers(filter: string, offset: number, limit: number): Promise<JobOffer[]> {
  const response = await fetch(`/job-offers?filter=${filter}&offset=${offset}&limit=${limit}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  });
  const json = await response.json();
  if(![200].includes(response.status)) {
    throw new Error(json.errors?.[0])
  }
  return json?.jobOffers;
}