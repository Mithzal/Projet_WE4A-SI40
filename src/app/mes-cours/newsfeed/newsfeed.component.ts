import {Component, Input, OnInit} from '@angular/core';

interface NewsItem {
  text: string;
  courseId: string;
  courseCode?: string;
  contentId?: string;
  contentTitle?: string;
  date?: Date;
  type?: string;
}

@Component({
  selector: 'app-newsfeed',
  templateUrl: './newsfeed.component.html',
  styleUrls: ['./newsfeed.component.css']
})
export class NewsfeedComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input() newsItems: NewsItem[] = [];
  @Input() isLoading: boolean = false;

  // Track by function for ngFor optimization
  trackByNewsItem(index: number, item: NewsItem): string {
    // Use a combination of properties that would make each item unique
    return `${item.courseId}-${item.contentId}-${item.contentTitle}`;
  }

  // Helper method to check if an item is within the allowed time range
  private isWithinTimeRange(item: NewsItem): boolean {
    if (!item.date) return true; // Include items without dates

    const today = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);

    const itemDate = new Date(item.date);

    return itemDate >= oneWeekAgo;
  }

  // Getter to ensure only unique items are displayed
  get filteredUniqueNewsItems(): NewsItem[] {
    // First filter by date to only show items from one week ago or newer
    const recentItems = this.newsItems.filter(item => this.isWithinTimeRange(item));

    // Then use Map to keep only unique items based on a composite key
    const uniqueMap = new Map<string, NewsItem>();

    recentItems.forEach(item => {
      const key = this.trackByNewsItem(0, item);
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, item);
      }
    });

    return Array.from(uniqueMap.values());
  }
}
