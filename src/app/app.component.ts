import { Component } from "@angular/core";
import { ClothingComponent } from "./components/clothing/clothing.component";
import { LocationComponent } from "./components/location/location.component";
import { RouterLink } from "@angular/router";
@Component({
  selector: "app-root",
  imports: [ClothingComponent, LocationComponent, RouterLink],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  title = "Oblecnik-web";
}
