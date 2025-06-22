import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  @Input() type!: 'information' | 'important' | 'depot';
  @Input() titre!: string;
  @Input() contenu!: string;
  constructor() { }

  ngOnInit(): void {
  }

}
