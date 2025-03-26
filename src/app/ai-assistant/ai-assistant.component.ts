import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './ai-assistant.component.html',
  styleUrls: ['./ai-assistant.component.css']
})
export class AiAssistantComponent implements OnInit {
  messages: { text: string; isUser: boolean; isLoading?: boolean; isError?: boolean }[] = [];
  prompt: string = '';
  isLightMode = false;
  professionals = [
    {
      profileId: 'prof1',
      fullName: 'Juan Pérez',
      profession: 'Electricista',
      location: { city: 'San José', country: 'Costa Rica' },
      description: 'Especialista en instalaciones eléctricas con 10 años de experiencia.',
      rating: 4.5,
      availability: true,
      skills: ['Cableado', 'Instalación', 'Reparación', 'Diagnóstico'],
      experienceYears: 10
    },
    {
      profileId: 'prof2',
      fullName: 'María Gómez',
      profession: 'Plomera',
      location: { city: 'Heredia', country: 'Costa Rica' },
      description: 'Experta en tuberías y mantenimiento con 8 años de experiencia.',
      rating: 4.8,
      availability: true,
      skills: ['Tuberías', 'Reparación', 'Instalación', 'Mantenimiento'],
      experienceYears: 8
    }
  ];

  constructor() {}

  ngOnInit() {
    this.isLightMode = localStorage.getItem('themeColor') === 'light_mode';
    this.applyTheme();
  }

  toggleTheme() {
    this.isLightMode = !this.isLightMode;
    this.applyTheme();
    localStorage.setItem('themeColor', this.isLightMode ? 'light_mode' : 'dark_mode');
  }

  applyTheme() {
    document.body.classList.toggle('light_mode', this.isLightMode);
  }

  async sendPrompt() {
    if (!this.prompt.trim()) return;

    const userMessage = { text: this.prompt, isUser: true };
    const loadingMessage = { text: '', isUser: false, isLoading: true };
    this.messages.push(userMessage, loadingMessage);
    this.prompt = '';

    try {
      const response = await this.simulateRatonAIResponse(this.prompt);
      this.messages.pop();
      this.messages.push({ text: response, isUser: false });
    } catch (error) {
      this.messages.pop();
      this.messages.push({ text: 'Error al procesar la solicitud.', isUser: false, isError: true });
    }

    setTimeout(() => document.querySelector('.chats')?.scrollTo(0, document.querySelector('.chats')!.scrollHeight), 0);
  }

  clearChat() {
    this.messages = [];
    document.body.classList.add('hide-header');
  }

  async simulateRatonAIResponse(prompt: string): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const professionalsJson = JSON.stringify(this.professionals, null, 2);
        if (prompt.toLowerCase().includes('mejor') || prompt.toLowerCase().includes('profesional')) {
          const need = prompt.toLowerCase().match(/(electricista|plomera|diseñador|carpintera)/)?.[0] || 'general';
          const bestPros = this.professionals
            .filter(p => need === 'general' || p.profession.toLowerCase().includes(need))
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 2)
            .map(p => `- **${p.fullName}** (${p.profession}, ${p.location.city}): ${p.description} (Rating: ${p.rating} ★)`);

          resolve(
            bestPros.length > 0
              ? `Soy RatonAI 🐀🔥, tu asistente en ExpertHub. Basado en tus necesidades, aquí están los mejores profesionales:\n${bestPros.join('\n')}`
              : 'No encontré profesionales que coincidan con tu solicitud.'
          );
        } else if (prompt.toLowerCase().includes('qué significa ratonai')) {
          resolve(
            `Soy RatonAI 🐀🔥, y mi nombre significa: **Recomendaciones Asistente para Talentos con Optimización y Navegación**. Estoy aquí para recomendar profesionales, asistirte, conectar talentos, optimizar tu búsqueda y facilitar la navegación en ExpertHub.`
          );
        } else {
          resolve(`Soy RatonAI 🐀🔥, tu asistente en ExpertHub. Respuesta simulada para: "${prompt}"`);
        }
      }, 1500);
    });
  }
}
