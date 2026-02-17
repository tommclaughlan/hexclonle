import {Directive, ElementRef, HostListener, inject} from '@angular/core';

@Directive({
  selector: 'input[hexDigit]'
})
export class HexDigit {
  private readonly el = inject<ElementRef<HTMLInputElement>>(ElementRef);

  private static readonly REGEX = /^[0-9A-F]$/;

  @HostListener('input')
  onInput(): void {
    const input = this.el.nativeElement;

    if (input.value.length > 1) {
      input.value = input.value[input.value.length - 1];
    }

    if (input.value === '') {
      input.value = '';
      return;
    }

    if (!HexDigit.REGEX.test(input.value.toUpperCase())) {
      input.value = '';
      return;
    }

    input.value = input.value.toUpperCase();

    if (input.value.length > 0) {
      let next = this.el.nativeElement.nextElementSibling;
      if (next !== null) {
        (next as HTMLInputElement).focus();
      }
    }
  }

}
