import { Component, OnInit, inject, signal } from "@angular/core";
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
  debounceTime,
  tap,
} from "rxjs";
import type { Location } from "../../services/nominatim.service";
import { LoaderComponent } from "../loader/loader.component";

@Component({
  selector: "app-location",
  imports: [AsyncPipe, ReactiveFormsModule, LoaderComponent],
  templateUrl: "./location.component.html",
  styleUrl: "./location.component.css",
})
export class LocationComponent implements OnInit {
  nominatim = inject(NominatimService);
  locations$!: Observable<Location[]>;
  search = new FormControl(this.nominatim.location().description);
  loading = signal(false);
  updatedByHandleClick = false;
  locationSet = false;

  handleClick(location: Location) {
    this.updatedByHandleClick = true;
    this.locationSet = true;
    this.nominatim.setLocation(location);
    this.search.setValue(location.description);
  }

  ngOnInit(): void {
    this.locations$ = this.search.valueChanges.pipe(
      tap(() => {
        if (!this.updatedByHandleClick) {
          this.loading.set(true);
          this.locationSet = false;
        }
      }),
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap((value) => {
        if (this.updatedByHandleClick) {
          return of([]);
        }

        if (!value || value.trim().length < 3) {
          return of([]);
        }
        return this.nominatim.getLocationsFromNominatim(value).pipe(
          catchError((err) => {
            console.error("Error while fetching locations: ", err);
            return of([]);
          }),
          finalize(() => this.loading.set(false)),
        );
      }),
    );
  }
}
