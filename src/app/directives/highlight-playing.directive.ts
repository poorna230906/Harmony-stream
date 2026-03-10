import { Directive, ElementRef, Input, OnChanges, SimpleChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHighlightPlaying]',
  standalone: true
})
export class HighlightPlayingDirective implements OnChanges {
  @Input() appHighlightPlaying: boolean = false;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appHighlightPlaying']) {
      if (this.appHighlightPlaying) {
        this.renderer.addClass(this.el.nativeElement, 'now-playing-highlight');
        this.renderer.setStyle(this.el.nativeElement, 'border', '2px solid #1db954');
        this.renderer.setStyle(this.el.nativeElement, 'box-shadow', '0 0 12px rgba(29,185,84,0.4)');
      } else {
        this.renderer.removeClass(this.el.nativeElement, 'now-playing-highlight');
        this.renderer.removeStyle(this.el.nativeElement, 'border');
        this.renderer.removeStyle(this.el.nativeElement, 'box-shadow');
      }
    }
  }
}
