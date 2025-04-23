import { Component } from '@angular/core';
import { ClothingComponent } from './components/clothing/clothing.component';

@Component({
  selector: 'app-root',
  imports: [ClothingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Oblecnik-web';
}
