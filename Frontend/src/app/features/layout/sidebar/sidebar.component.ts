import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  template: `
    <aside class="sidebar">
      <p>EVM Analytics</p>
    </aside>
  `,
  styles: [`
    .sidebar {
      background-color: #f5f5f5;
      padding: 20px;
      min-width: 200px;
    }
    p {
      color: #666;
      font-weight: 600;
    }
  `]
})
export class SidebarComponent {}
