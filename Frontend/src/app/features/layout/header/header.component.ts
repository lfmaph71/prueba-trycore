import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="header">
      <div class="header-container">
        <h1 class="logo">📊 EVM Dashboard</h1>
        <nav class="header-nav">
          <a routerLink="/dashboard" class="nav-link">Inicio</a>
          <a routerLink="/projects" class="nav-link">Proyectos</a>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background-color: #2c3e50;
      color: white;
      padding: 1rem 0;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .header-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo {
      margin: 0;
      font-size: 24px;
      font-weight: bold;
    }
    .header-nav {
      display: flex;
      gap: 20px;
    }
    .nav-link {
      color: white;
      text-decoration: none;
      font-weight: 500;
      padding: 8px 16px;
      border-radius: 4px;
      transition: background-color 0.3s;
    }
    .nav-link:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  `]
})
export class HeaderComponent {}
