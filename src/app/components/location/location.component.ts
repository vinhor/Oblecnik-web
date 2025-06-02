import { Component, inject } from "@angular/core";
import { AsyncPipe, JsonPipe } from "@angular/common";
import { NominatimService } from "../../services/nominatim.service";
import { Observable } from "rxjs";
import type { Location } from "../../services/nominatim.service";

@Component({
  selector: "app-location",
  imports: [AsyncPipe, JsonPipe],
  templateUrl: "./location.component.html",
  styleUrl: "./location.component.css",
})
export class LocationComponent {
  nominatim = inject(NominatimService);
  locations$!: Observable<Location[]>;

  handleClick() {
    this.locations$ = this.nominatim.getLocations("Prague");
  }
}
