import { Component } from "@angular/core";

@Component({
  selector: "app-not-found",
  standalone: true,
  template: `
    <h2>Page non trouvée</h2>
    <p>La page demandée n'existe pas.</p>
  `,
})
export class NotFoundComponent {}