import { Component, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';

import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements AfterViewChecked {
  @ViewChild('chatbotBody') private chatbotBody!: ElementRef;
  
  isChatbotVisible = false;
  messageInput = '';

  toggleChatbot() {
    this.isChatbotVisible = !this.isChatbotVisible;
  }

  sendMessage() {
    if (this.messageInput.trim()) {
      this.addMessage(this.messageInput, 'user');
      this.messageInput = '';
      
      // Simular respuesta del bot
      setTimeout(() => {
        this.addMessage('Gracias por tu mensaje. Estoy procesando tu solicitud.', 'bot');
      }, 1000);
    }
  }

  sendQuickReply(message: string) {
    this.addMessage(message, 'user');
    
    // Simular respuesta del bot
    setTimeout(() => {
      this.addMessage('Entiendo que te interesa ' + message + '. Déjame proporcionarte más información.', 'bot');
    }, 1000);
  }

  addMessage(text: string, sender: 'user' | 'bot') {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
    
    const timeString = this.getCurrentTime();
    
    messageElement.innerHTML = `
      ${text}
      <div class="message-time">${timeString}</div>
    `;
    
    if (this.chatbotBody && this.chatbotBody.nativeElement) {
      this.chatbotBody.nativeElement.appendChild(messageElement);
    }
  }

  getCurrentTime(): string {
    const now = new Date();
    return now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      if (this.chatbotBody && this.chatbotBody.nativeElement) {
        this.chatbotBody.nativeElement.scrollTop = this.chatbotBody.nativeElement.scrollHeight;
      }
    } catch(err) { }
  }

  // Manejar el evento de teclado
  handleKeyup(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  }
}