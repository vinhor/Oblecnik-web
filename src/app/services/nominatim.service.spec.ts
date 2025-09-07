import { TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import {
  provideHttpClientTesting,
  HttpTestingController,
} from "@angular/common/http/testing";
import { NominatimService } from "./nominatim.service";
import { firstValueFrom } from "rxjs";

const RESPONSE = [
  {
    place_id: 226283940,
    licence:
      "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright",
    osm_type: "relation",
    osm_id: 13676883,
    lat: "29.3433143",
    lon: "79.1300368",
    class: "waterway",
    type: "river",
    place_rank: 18,
    importance: 0.4441262148166757,
    addresstype: "river",
    name: "Kosi",
    display_name: "Kosi, Uttarakhand, India",
    address: {
      river: "Kosi",
      state: "Uttarakhand",
      "ISO3166-2-lvl4": "IN-UK",
      country: "India",
      country_code: "in",
    },
    boundingbox: ["28.6339239", "29.8615810", "78.9470298", "79.6475395"],
  },
  {
    place_id: 72059951,
    licence:
      "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright",
    osm_type: "relation",
    osm_id: 17088347,
    lat: "45.3952812",
    lon: "14.3755894",
    class: "boundary",
    type: "administrative",
    place_rank: 16,
    importance: 0.41372244811350606,
    addresstype: "village",
    name: "Kosi",
    display_name: "Kosi, Općina Viškovo, Primorje-Gorski Kotar County, Croatia",
    address: {
      village: "Kosi",
      municipality: "Općina Viškovo",
      county: "Primorje-Gorski Kotar County",
      "ISO3166-2-lvl6": "HR-08",
      country: "Croatia",
      country_code: "hr",
    },
    boundingbox: ["45.3854104", "45.4096393", "14.3691295", "14.3823109"],
  },
  {
    place_id: 224124970,
    licence:
      "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright",
    osm_type: "relation",
    osm_id: 5702599,
    lat: "26.1793956",
    lon: "86.5573310",
    class: "waterway",
    type: "river",
    place_rank: 18,
    importance: 0.4441262148166757,
    addresstype: "river",
    name: "Koshi River",
    display_name: "Koshi River, Bihar, India",
    address: {
      river: "Koshi River",
      state: "Bihar",
      "ISO3166-2-lvl4": "IN-BR",
      country: "India",
      country_code: "in",
    },
    boundingbox: ["25.4055708", "26.9102464", "86.4387130", "87.2586201"],
  },
];

describe("NominatimService", () => {
  let service: NominatimService;
  let httpTesting: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(NominatimService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should make an HTTP request", async () => {
    const locationPromise = firstValueFrom(
      service.getLocationsFromNominatim("kos"),
    ); // trigger the request

    const req = httpTesting.expectOne(
      "/nominatim?format=json&addressdetails=1&q=kos",
      "request the location data",
    );
    expect(req.request.method).toBe("GET");
    req.flush(RESPONSE);
    expect(await locationPromise).toBeTruthy();
    httpTesting.verify();
  });
});
