import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appNumericInput]',
})
export class NumericInputDirective {

  constructor(private el: ElementRef) {}

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    const key = event.key;

    // Allow only numeric characters and Backspace/Delete
    if (!this.isNumericKey(key) && !this.isNavigationKey(key)) {
      // Prevent the input if the pressed key is not numeric or a navigation key
      event.preventDefault();
    }
  }

  // Check if the pressed key is a numeric key
  private isNumericKey(key: string): boolean {
    return /^[0-9]+$/.test(key);
  }

  // Check if the pressed key is a navigation key (Backspace, Delete, ArrowLeft, ArrowRight)
  private isNavigationKey(key: string): boolean {
    return ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'].includes(key);
  }
}
