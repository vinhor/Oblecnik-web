import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class NominatimService {
  http = inject(HttpClient);
  getLocations(location: string): Observable<Location[]> {
    let locationURI = encodeURI(location);
    return this.http
      .get<
        LocationInformation[]
      >(`/nominatim?format=json&addressdetails=1&q=${locationURI}`)
      .pipe(
        map((locations) =>
          locations.map((loc) => {
            const address = loc.address as { [key: string]: any };
            const state = address["state"] || "";
            const country = address["country"] || "";
            const descriptionParts = [loc.name, state, country].filter(Boolean);
            return {
              lat: parseFloat(loc.lat),
              long: parseFloat(loc.lon),
              description: descriptionParts.join(", "),
            };
          }),
        ),
      );
  }
}
export type Location = {
  long: number;
  lat: number;
  description: string;
};

type LocationInformation = {
  place_id: number;
  license: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  class: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  address: object;
  boundingbox: string[];
};
