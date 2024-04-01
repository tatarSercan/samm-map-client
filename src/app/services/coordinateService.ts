import {inject, Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Coordinate} from "../pages/main/main.component";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CoordinateService {

  httpClient = inject(HttpClient);

  createCoordinate (coordinate: Coordinate): Observable<Coordinate> {
    return this.httpClient.post<Coordinate>(`http://localhost:8080/app/v1/coordinates`, coordinate, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    })
  }

  getAll (): Observable<Coordinate[]> {
    return this.httpClient.get<Coordinate[]>(`http://localhost:8080/app/v1/coordinates`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    })
  }

  deleteById (id: number): Observable<void> {
    return this.httpClient.delete<void>(`http://localhost:8080/app/v1/coordinates/${id}`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    })
  }

}
