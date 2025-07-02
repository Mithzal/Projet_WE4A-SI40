import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-newsfeed-card',
  templateUrl: './newsfeed-card.component.html',
  styleUrls: ['./newsfeed-card.component.css']
})
export class NewsfeedCardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input() text: string = '';
  @Input() courseId: string = '';
  @Input() courseCode: string = '';
  @Input() contentTitle: string = '';
  @Input() date: Date | undefined;
  @Input() contentId: string = '';
  @Input() type: string = '';

  // Helper method to calculate days remaining
  getDaysRemaining(): string {
    if (!this.date) return '';

    const today = new Date();
    const targetDate = new Date(this.date);

    // Set time to midnight for both dates to compare just days
    today.setHours(0, 0, 0, 0);

    // Clone target date to not modify the original
    const compareDate = new Date(targetDate);
    compareDate.setHours(0, 0, 0, 0);

    // Calculate difference in days
    const diffTime = compareDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return `Dépassé de ${Math.abs(diffDays)} jour${Math.abs(diffDays) > 1 ? 's' : ''}`;
    } else if (diffDays === 0) {
      return 'Aujourd\'hui';
    } else if (diffDays === 1) {
      return 'Demain';
    } else {
      return `Dans ${diffDays} jours`;
    }
  }

  // Helper method to get appropriate icon based on content type
  getTypeIcon(): string {
    switch (this.type) {
      case 'info': return 'bi-info-circle-fill';
      case 'warning': return 'bi-exclamation-triangle-fill';
      case 'assignement': return 'bi-clipboard-check-fill';
      case 'file': return 'bi-file-earmark-arrow-down-fill';
      default: return 'bi-calendar-event';
    }
  }

  // Helper method to get color class based on due date proximity
  getUrgencyClass(): string {
    if (!this.date) return '';

    const today = new Date();
    const targetDate = new Date(this.date);
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return 'text-danger'; // Passed due date
    } else if (diffDays <= 2) {
      return 'text-warning'; // Due soon (within 2 days)
    } else {
      return 'text-success'; // Due later
    }
  }
}
