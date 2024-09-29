import {
  afterNextRender,
  Directive,
  ElementRef,
  inject,
  OnDestroy,
  output,
} from "@angular/core";

@Directive({
  selector: "[appIsVisible]",
  standalone: true,
})
export class IsVisibleDirective implements OnDestroy {
  elementRef = inject(ElementRef);

  visible = output<boolean>({ alias: "appIsVisible" });

  private observer: IntersectionObserver | undefined;

  constructor() {
    afterNextRender(() => {
      this.observer = new IntersectionObserver(([entry]) => {
        this.visible.emit(entry.isIntersecting);
      });

      this.observer.observe(this.elementRef.nativeElement);
    });
  }

  public ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
