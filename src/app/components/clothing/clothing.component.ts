import { Component, inject, OnInit, computed, Signal } from "@angular/core";
import { AsyncPipe, DatePipe } from "@angular/common";
import { WeatherService } from "../../services/weather.service";
import { Observable } from "rxjs";
import type { ClothingSummary } from "../../services/weather.service";
import { NominatimService } from "../../services/nominatim.service";

@Component({
  selector: "app-clothing",
  imports: [AsyncPipe, DatePipe],
  templateUrl: "./clothing.component.html",
  styleUrl: "./clothing.component.css",
})
export class ClothingComponent implements OnInit {
  weather = inject(WeatherService);
  nominatim = inject(NominatimService);
  clothing$!: Signal<Observable<ClothingSummary>>;

  ngOnInit(): void {
    this.clothing$ = computed(() =>
      this.weather.getClothing(
        this.nominatim.location().latitude,
        this.nominatim.location().longitude,
      ),
    );
  }
}
