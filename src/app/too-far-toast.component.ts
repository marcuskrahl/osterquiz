import { Component, ElementRef, ViewChild } from '@angular/core';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'oq-too-far-toast',
  template: `
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      <div
        #toastElem
        id="liveToast"
        class="toast"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div class="toast-header">
          <strong class="me-auto">Zu weit weg</strong>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
        <div class="toast-body">
          Um diese Frage beantworten zu können, musst du näher am Zielort sein.
        </div>
      </div>
    </div>
  `,
  standalone: true,
})
export class TooFarToastComponent {
  @ViewChild('toastElem', { read: ElementRef })
  private elem: ElementRef | undefined;
  public show(): void {
    const toast = bootstrap.Toast.getOrCreateInstance(this.elem?.nativeElement);
    toast.show();
  }
}
