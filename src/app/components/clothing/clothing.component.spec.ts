import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";

import { ClothingComponent } from "./clothing.component";

describe("ClothingComponent", () => {
  let component: ClothingComponent;
  let fixture: ComponentFixture<ClothingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClothingComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ClothingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
