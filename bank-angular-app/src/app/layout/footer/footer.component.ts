import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {

  getAngularVersion(): string {
    return '17+'; // O la versión que estés usando
  }
}