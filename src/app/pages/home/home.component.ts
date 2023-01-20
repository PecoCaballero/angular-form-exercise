import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { switchMap } from 'rxjs';
import { CountryCityService } from '../../services/country-city.service';
import { Country } from '../../interfaces/country.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  form: FormGroup = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    age: [35, Validators.required],
    country: ['', Validators.required],
    city: ['', Validators.required],
    people: this.formBuilder.array([], Validators.required),
  });

  countries: Country[] = [];

  cities: string[] = [];

  get people(): FormArray {
    return this.form.get('people') as FormArray;
  }

  constructor(
    private formBuilder: FormBuilder,
    private countryCityService: CountryCityService
  ) {}

  ngOnInit() {
    this.countryCityService
      .getCountries()
      .pipe(
        switchMap((countries) => {
          const country = countries[0].name;
          this.countries = countries;

          this.form.get('country')?.setValue(country);
          return this.countryCityService.getCities(country);
        })
      )
      .subscribe((cities) => {
        this.cities = cities;
        this.form.get('city')?.setValue(cities[0]);
      });
  }

  getPerson(i: number): FormGroup {
    return this.people.at(i) as FormGroup;
  }

  getPersonControl(i: number, control: string) {
    return this.people.at(i).get(control) as FormControl;
  }

  controlIsInvalid(control: string) {
    return (
      this.form.controls[control].errors && this.form.controls[control].touched
    );
  }

  personControlIsInvalid(i: number, control: string) {
    return (
      this.people.at(i).get(control)?.errors &&
      this.people.at(i).get(control)?.touched
    );
  }

  changeCountry(event: any) {
    let country = event.target.value;
    this.form.get('country')?.setValue(country);
    this.countryCityService.getCities(country).subscribe((cities) => {
      this.cities = cities;
      this.form.get('city')?.setValue(cities[0]);
    });
  }

  changeCity(event: any) {
    this.form.get('city')?.setValue(event.target.value);
  }

  addPerson() {
    this.people.push(
      this.formBuilder.group({
        fullName: ['', Validators.required],
        relation: ['', Validators.required],
        age: [18, Validators.required],
      })
    );
  }
  removePerson(i: number) {
    this.people.removeAt(i);
  }

  enviar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    console.log(this.form.value);
  }
}
