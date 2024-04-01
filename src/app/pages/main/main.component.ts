import {AfterViewInit, Component, inject, OnInit} from '@angular/core';
import * as L from 'leaflet';
import {formatDate, NgFor, NgIf} from "@angular/common";
import {CoordinateService} from "../../services/coordinateService";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit, AfterViewInit {

  private map: any;
  savedCoordinates: Coordinate[] = [];

  icon = {
    icon: L.icon({
      iconSize: [ 25, 41 ],
      iconAnchor: [ 13, 0 ],
      iconUrl: './node_modules/leaflet/dist/images/marker-icon.png',
      shadowUrl: './node_modules/leaflet/dist/images/marker-shadow.png'
    })
  };

  coordinateService = inject(CoordinateService);

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.loadCoordinates();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [ 40.80276, 29.43068 ],
      zoom: 10
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3
    });

    tiles.addTo(this.map);
  }


  saveCenterCoordinate() {
    let center = this.map.getCenter();
    let lat = center.lat.toFixed(5);
    let lng = center.lng.toFixed(5);

    let coordinate = new Coordinate(lat, lng, formatDate(new Date(), 'dd-MM-yyyy hh:mm:ss', 'en-US'))
    //this.savedCoordinates.push(coordinate);

    console.log('coordinate ' + JSON.stringify(coordinate))

    this.coordinateService.createCoordinate(coordinate).subscribe(value => {
      this.savedCoordinates.push(value);
    })
    //L.marker([lat, lng], this.icon).addTo(this.map)
  }

  removeCoordinate(coordinate: Coordinate) {
    this.coordinateService.deleteById(coordinate.id).subscribe(value => {
      this.loadCoordinates()
    })

    //TODO below attempts did not solve the problem. Will be investigated!!!
    //L.marker([coordinate.lat, coordinate.lng], this.icon).removeFrom(this.map)
    //this.map.removeLayer(L.marker([coordinate.lat, coordinate.lng], this.icon))
  }

  showMarkerOfCurrentCoordinate(coordinate: Coordinate) {
    L.marker([coordinate.lat, coordinate.lng], this.icon).addTo(this.map)
  }

  downloadCoordinates() {
    var sJson = JSON.stringify(this.savedCoordinates);
    var element = document.createElement('a');
    element.setAttribute('href', "data:text/json;charset=UTF-8," + encodeURIComponent(sJson));
    element.setAttribute('download', "coordinates.json");
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click(); // simulate click
    document.body.removeChild(element);
  }

  private loadCoordinates() {
    this.coordinateService.getAll().subscribe(value => {
      this.savedCoordinates = value;
    })
  }
}

export class Coordinate {
  id!: number;
  lat!: number;
  lng!: number;
  datetime!: string;

  constructor(lat: number, lng: number, datetime: string) {
    this.lat = lat;
    this.lng = lng;
    this.datetime = datetime;
  }
}
