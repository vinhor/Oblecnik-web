import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { WeatherService } from '../../services/weather.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-clothing',
  imports: [AsyncPipe],
  templateUrl: './clothing.component.html',
  styleUrl: './clothing.component.css',
})
export class ClothingComponent implements OnInit {
  weather = inject(WeatherService);
  clothing$!: Observable<string>;

  ngOnInit(): void {
    this.clothing$ = this.weather.getClothing();
  }
}
