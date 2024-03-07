export function mirrorPopupInfo() {
  const triggerPopupInfo = document.querySelector('#trigger-popup-info') as HTMLElement | null;
  const targetPopupInfo = document.querySelector('#target-popup-info') as HTMLElement | null;

  triggerPopupInfo?.addEventListener('click', function () {
    targetPopupInfo?.click();
  });
}
