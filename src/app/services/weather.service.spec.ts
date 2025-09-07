import { TestBed } from "@angular/core/testing";

import { WeatherService, Rain, Trousers, Jacket } from "./weather.service";
import { provideHttpClient } from "@angular/common/http";
import {
  provideHttpClientTesting,
  HttpTestingController,
} from "@angular/common/http/testing";
import { firstValueFrom } from "rxjs";

const now = new Date();
const YEAR = now.getFullYear();
const MONTH = now.getMonth(); // zero-based
const DATE = now.getDate();

function makeTime(year: number, month: number, day: number, hour: number) {
  const localDate = new Date(year, month, day, hour, 0, 0, 0); // local time
  return localDate.toISOString(); // UTC ISO string
}

const DEFAULT_FORECAST = {
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [14, 50, 295],
  },
  properties: {
    meta: {
      updated_at: "2025-08-23T11:20:04Z",
      units: {
        air_pressure_at_sea_level: "hPa",
        air_temperature: "celsius",
        cloud_area_fraction: "%",
        precipitation_amount: "mm",
        relative_humidity: "%",
        wind_from_direction: "degrees",
        wind_speed: "m/s",
      },
    },
    timeseries: [
      {
        time: makeTime(YEAR, MONTH, DATE, 7),
        data: {
          instant: {
            details: {
              air_pressure_at_sea_level: 1014.1,
              air_temperature: 16.4,
              cloud_area_fraction: 100.0,
              relative_humidity: 56.6,
              wind_from_direction: 286.5,
              wind_speed: 4.3,
            },
          },
          next_12_hours: {
            summary: {
              symbol_code: "fair_day",
            },
            details: {},
          },
          next_1_hours: {
            summary: {
              symbol_code: "rain",
            },
            details: {
              precipitation_amount: 0.3,
            },
          },
          next_6_hours: {
            summary: {
              symbol_code: "fair_day",
            },
            details: {
              precipitation_amount: 0.3,
            },
          },
        },
      },
      {
        time: makeTime(YEAR, MONTH, DATE, 12),
        data: {
          instant: {
            details: {
              air_pressure_at_sea_level: 1014.1,
              air_temperature: 16.4,
              cloud_area_fraction: 100.0,
              relative_humidity: 56.6,
              wind_from_direction: 286.5,
              wind_speed: 4.3,
            },
          },
          next_12_hours: {
            summary: {
              symbol_code: "fair_day",
            },
            details: {},
          },
          next_1_hours: {
            summary: {
              symbol_code: "rain",
            },
            details: {
              precipitation_amount: 0.3,
            },
          },
          next_6_hours: {
            summary: {
              symbol_code: "fair_day",
            },
            details: {
              precipitation_amount: 0.3,
            },
          },
        },
      },
      {
        time: makeTime(YEAR, MONTH, DATE, 15),
        data: {
          instant: {
            details: {
              air_pressure_at_sea_level: 1014.1,
              air_temperature: 16.4,
              cloud_area_fraction: 100.0,
              relative_humidity: 56.6,
              wind_from_direction: 286.5,
              wind_speed: 4.3,
            },
          },
          next_12_hours: {
            summary: {
              symbol_code: "fair_day",
            },
            details: {},
          },
          next_1_hours: {
            summary: {
              symbol_code: "rain",
            },
            details: {
              precipitation_amount: 0.3,
            },
          },
          next_6_hours: {
            summary: {
              symbol_code: "fair_day",
            },
            details: {
              precipitation_amount: 0.3,
            },
          },
        },
      },
      {
        time: makeTime(YEAR, MONTH, DATE + 1, 7),
        data: {
          instant: {
            details: {
              air_pressure_at_sea_level: 1014.1,
              air_temperature: 16.4,
              cloud_area_fraction: 100.0,
              relative_humidity: 56.6,
              wind_from_direction: 286.5,
              wind_speed: 4.3,
            },
          },
          next_12_hours: {
            summary: {
              symbol_code: "fair_day",
            },
            details: {},
          },
          next_1_hours: {
            summary: {
              symbol_code: "rain",
            },
            details: {
              precipitation_amount: 0.3,
            },
          },
          next_6_hours: {
            summary: {
              symbol_code: "fair_day",
            },
            details: {
              precipitation_amount: 0.3,
            },
          },
        },
      },
      {
        time: makeTime(YEAR, MONTH, DATE + 1, 12),
        data: {
          instant: {
            details: {
              air_pressure_at_sea_level: 1014.0,
              air_temperature: 15.8,
              cloud_area_fraction: 52.3,
              relative_humidity: 62.0,
              wind_from_direction: 280.0,
              wind_speed: 3.6,
            },
          },
          next_12_hours: {
            summary: {
              symbol_code: "fair_day",
            },
            details: {},
          },
          next_1_hours: {
            summary: {
              symbol_code: "partlycloudy_day",
            },
            details: {
              precipitation_amount: 0.0,
            },
          },
          next_6_hours: {
            summary: {
              symbol_code: "fair_day",
            },
            details: {
              precipitation_amount: 0.1,
            },
          },
        },
      },
      {
        time: makeTime(YEAR, MONTH, DATE + 1, 15),
        data: {
          instant: {
            details: {
              air_pressure_at_sea_level: 1013.9,
              air_temperature: 16.1,
              cloud_area_fraction: 57.0,
              relative_humidity: 60.1,
              wind_from_direction: 286.5,
              wind_speed: 3.6,
            },
          },
          next_12_hours: {
            summary: {
              symbol_code: "fair_night",
            },
            details: {},
          },
          next_1_hours: {
            summary: {
              symbol_code: "partlycloudy_day",
            },
            details: {
              precipitation_amount: 0.0,
            },
          },
          next_6_hours: {
            summary: {
              symbol_code: "fair_night",
            },
            details: {
              precipitation_amount: 0.0,
            },
          },
        },
      },
    ],
  },
};

describe("WeatherService", () => {
  let service: WeatherService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(WeatherService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should make an HTTP request", async () => {
    const forecastPromise = firstValueFrom(service.getClothing(50, 14)); // trigger the request

    const req = httpTesting.expectOne(
      "/metno?lat=50&lon=14",
      "request the weather data",
    );
    expect(req.request.method).toBe("GET");
    req.flush(DEFAULT_FORECAST);
    expect(await forecastPromise).toBeTruthy();
    httpTesting.verify();
  });
});

describe("WeatherService - Clothing Algorithm", () => {
  let service: WeatherService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(WeatherService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  // Helper function to create forecast with custom temperatures and weather conditions
  function createForecast(
    temp: number,
    symbolCode: string,
    windSpeed: number = 4.3,
  ) {
    return {
      ...DEFAULT_FORECAST,
      properties: {
        ...DEFAULT_FORECAST.properties,
        timeseries: DEFAULT_FORECAST.properties.timeseries.map((entry) => ({
          ...entry,
          data: {
            ...entry.data,
            instant: {
              ...entry.data.instant,
              details: {
                ...entry.data.instant.details,
                air_temperature: temp,
                wind_speed: windSpeed,
              },
            },
            next_12_hours: {
              ...entry.data.next_12_hours,
              summary: {
                symbol_code: symbolCode,
              },
            },
          },
        })),
      },
    };
  }

  describe("Temperature-based clothing decisions", () => {
    it("should recommend heavy jacket for very cold weather (< 10°C)", async () => {
      const coldForecast = createForecast(5, "fair_day");

      const clothingPromise = firstValueFrom(service.getClothing(50, 14));
      const req = httpTesting.expectOne("/metno?lat=50&lon=14");
      req.flush(coldForecast);

      const result = await clothingPromise;
      expect(result.jacketIndex).toBe(Jacket.Heavy);
      expect(result.hoodie).toBe(true);
      expect(result.trousersIndex).toBe(Trousers.Warm);
    });

    it("should recommend light jacket for cool weather (10-15°C)", async () => {
      const coolForecast = createForecast(12, "fair_day");

      const clothingPromise = firstValueFrom(service.getClothing(50, 14));
      const req = httpTesting.expectOne("/metno?lat=50&lon=14");
      req.flush(coolForecast);

      const result = await clothingPromise;
      expect(result.jacketIndex).toBe(Jacket.Light);
      expect(result.hoodie).toBe(true);
      expect(result.trousersIndex).toBe(Trousers.Standard);
    });

    it("should recommend shorts for hot weather (> 25°C)", async () => {
      const hotForecast = createForecast(28, "fair_day");

      const clothingPromise = firstValueFrom(service.getClothing(50, 14));
      const req = httpTesting.expectOne("/metno?lat=50&lon=14");
      req.flush(hotForecast);

      const result = await clothingPromise;
      expect(result.jacketIndex).toBe(Jacket.No);
      expect(result.hoodie).toBe(false);
      expect(result.trousersIndex).toBe(Trousers.Shorts);
    });

    it("should recommend hoodie for moderate temps with rain (< 26°C + rain)", async () => {
      const rainyForecast = createForecast(24, "rain");

      const clothingPromise = firstValueFrom(service.getClothing(50, 14));
      const req = httpTesting.expectOne("/metno?lat=50&lon=14");
      req.flush(rainyForecast);

      const result = await clothingPromise;
      expect(result.hoodie).toBe(true);
      expect(result.rainIndex).toBe(Rain.HeavyRain);
    });
  });

  describe("Weather condition logic", () => {
    it("should detect drizzle and set light rain", async () => {
      const drizzleForecast = createForecast(20, "lightrain");

      const clothingPromise = firstValueFrom(service.getClothing(50, 14));
      const req = httpTesting.expectOne("/metno?lat=50&lon=14");
      req.flush(drizzleForecast);

      const result = await clothingPromise;
      expect(result.rainIndex).toBe(Rain.LightRain);
    });

    it("should detect heavy rain", async () => {
      const rainForecast = createForecast(20, "rain");

      const clothingPromise = firstValueFrom(service.getClothing(50, 14));
      const req = httpTesting.expectOne("/metno?lat=50&lon=14");
      req.flush(rainForecast);

      const result = await clothingPromise;
      expect(result.rainIndex).toBe(Rain.HeavyRain);
    });

    it("should set overcast for cloudy conditions when starting from sunny", async () => {
      const cloudyForecast = createForecast(20, "cloudy");

      const clothingPromise = firstValueFrom(service.getClothing(50, 14));
      const req = httpTesting.expectOne("/metno?lat=50&lon=14");
      req.flush(cloudyForecast);

      const result = await clothingPromise;
      expect(result.rainIndex).toBe(Rain.Overcast);
    });
  });

  describe("Wind conditions", () => {
    it("should detect high wind speed (> 12 m/s)", async () => {
      const windyForecast = createForecast(20, "fair_day", 15);

      const clothingPromise = firstValueFrom(service.getClothing(50, 14));
      const req = httpTesting.expectOne("/metno?lat=50&lon=14");
      req.flush(windyForecast);

      const result = await clothingPromise;
      expect(result.windSpeed).toBe(15);
      // Note: windIndex logic depends on initial state, might need service method exposure
    });
  });

  describe("Boundary conditions", () => {
    it("should handle temperature boundary at 21°C for hoodie decision", async () => {
      const boundaryForecast = createForecast(21, "fair_day");

      const clothingPromise = firstValueFrom(service.getClothing(50, 14));
      const req = httpTesting.expectOne("/metno?lat=50&lon=14");
      req.flush(boundaryForecast);

      const result = await clothingPromise;
      expect(result.hoodie).toBe(false); // >= 21, no hoodie
    });

    it("should handle temperature boundary at 20°C for hoodie decision", async () => {
      const boundaryForecast = createForecast(20, "fair_day");

      const clothingPromise = firstValueFrom(service.getClothing(50, 14));
      const req = httpTesting.expectOne("/metno?lat=50&lon=14");
      req.flush(boundaryForecast);

      const result = await clothingPromise;
      expect(result.hoodie).toBe(true); // < 21, hoodie recommended
    });

    it("should handle jacket boundary at exactly 10°C", async () => {
      const boundaryForecast = createForecast(10, "fair_day");

      const clothingPromise = firstValueFrom(service.getClothing(50, 14));
      const req = httpTesting.expectOne("/metno?lat=50&lon=14");
      req.flush(boundaryForecast);

      const result = await clothingPromise;
      expect(result.jacketIndex).toBe(Jacket.Light); // >= 10, light jacket
    });

    it("should handle shorts boundary at exactly 25°C", async () => {
      const boundaryForecast = createForecast(25, "fair_day");

      const clothingPromise = firstValueFrom(service.getClothing(50, 14));
      const req = httpTesting.expectOne("/metno?lat=50&lon=14");
      req.flush(boundaryForecast);

      const result = await clothingPromise;
      expect(result.trousersIndex).toBe(Trousers.Standard); // = 25, no shorts yet
    });
  });

  describe("Complex weather scenarios", () => {
    it("should handle heavy rain with warm temperature (light jacket scenario)", async () => {
      const forecast = createForecast(18, "rain"); // Temp between 15-20, heavy rain, minTemp >= 10
      // This should trigger: jacketIndex = Jacket.Light due to heavy rain + minTemp >= 10

      const clothingPromise = firstValueFrom(service.getClothing(50, 14));
      const req = httpTesting.expectOne("/metno?lat=50&lon=14");
      req.flush(forecast);

      const result = await clothingPromise;
      expect(result.rainIndex).toBe(Rain.HeavyRain);
      expect(result.jacketIndex).toBe(Jacket.Light);
      expect(result.hoodie).toBe(true); // < 21°C
    });
  });

  afterEach(() => {
    httpTesting.verify();
    TestBed.resetTestingModule();
  });
});
