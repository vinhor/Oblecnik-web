import { Component } from "@angular/core";
import { ClothingComponent } from "./components/clothing/clothing.component";
import { LocationComponent } from "./components/location/location.component";

@Component({
  selector: "app-root",
  imports: [ClothingComponent, LocationComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  title = "Oblecnik-web";
}
