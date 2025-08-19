import { Component, OnInit, inject } from "@angular/core";
import { AsyncPipe } from "@angular/common";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { NominatimService } from "../../services/nominatim.service";
import {
  finalize,
  distinctUntilChanged,
  Observable,
  switchMap,
  of,
  catchError,
} from "rxjs";
import type { Location } from "../../services/nominatim.service";

@Component({
  selector: "app-location",
  imports: [AsyncPipe, ReactiveFormsModule],
  templateUrl: "./location.component.html",
  styleUrl: "./location.component.css",
})
export class LocationComponent implements OnInit {
  nominatim = inject(NominatimService);
  locations$!: Observable<Location[]>;
  search = new FormControl(this.nominatim.location().description);
  loading = false;
  updatedByHandleClick = false;

  handleClick(location: Location) {
    this.updatedByHandleClick = true;
    this.nominatim.setLocation(location);
    this.search.setValue(location.description);
    this.updatedByHandleClick = false;
  }

  ngOnInit(): void {
    this.locations$ = this.search.valueChanges.pipe(
      distinctUntilChanged(),
      switchMap((value) => {
        if (this.updatedByHandleClick) return of([]);

        if (!value || value.trim().length < 3) {
          return of([]);
        }

        this.loading = true;
        return this.nominatim.getLocationsFromNominatim(value).pipe(
          catchError((err) => {
            console.error("Error while fetching locations: ", err);
            return of([]);
          }),
          finalize(() => (this.loading = false)),
        );
      }),
    );
  }
}
