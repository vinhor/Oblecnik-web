import { Component, OnInit, inject } from "@angular/core";
import { AsyncPipe, JsonPipe } from "@angular/common";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { NominatimService } from "../../services/nominatim.service";
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  switchMap,
  of,
  catchError,
} from "rxjs";
import type { Location } from "../../services/nominatim.service";

@Component({
  selector: "app-location",
  imports: [AsyncPipe, JsonPipe, ReactiveFormsModule],
  templateUrl: "./location.component.html",
  styleUrl: "./location.component.css",
})
export class LocationComponent implements OnInit {
  nominatim = inject(NominatimService);
  locations$!: Observable<Location[]>;
  search = new FormControl("");

  handleClick() {
    this.locations$ = this.nominatim.getLocations("Prague");
  }

  ngOnInit(): void {
    this.locations$ = this.search.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap((value) => {
        if (!value || value.trim().length < 3) {
          return of([]);
        }

        return this.nominatim.getLocations(value).pipe(
          catchError((err) => {
            console.error("Error while fetching locations: ", err);
            return of([]);
          }),
        );
      }),
    );
  }
}
