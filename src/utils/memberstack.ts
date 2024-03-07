import memberstackDOM from '@memberstack/dom';

const memberstack = memberstackDOM.init({
  publicKey: 'pk_sb_60f02c0066b414d61dba',
});

/**
 * * 💙 MEMBERSCRIPT #46 v0.1 💙 CONFIRM PASSWORD INPUT
 **/
export function confirmPasswordInput(): void {
  const password = document.querySelector('[data-ms-member=password]') as HTMLInputElement;
  const confirm_password = document.querySelector('[ms-code-password=confirm]') as HTMLInputElement;

  function validatePassword(): void {
    if (password.value !== confirm_password.value) {
      confirm_password.setCustomValidity("Passwords Don't Match");
      confirm_password.classList.add('is-error');
      confirm_password.classList.remove('is-valid');
    } else {
      confirm_password.setCustomValidity('');
      confirm_password.classList.remove('is-error');
      confirm_password.classList.add('is-valid');
    }
  }

  // Event listeners for password and confirm password fields
  password.addEventListener('change', validatePassword);
  confirm_password.addEventListener('keyup', validatePassword);
}

/**
 *  * 💙 MEMBERSCRIPT #45 v0.2 💙 SHOW AND HIDE PASSWORD
 **/
export function showHidePassword(): void {
  document.querySelectorAll("[ms-code-password='transform']").forEach((button: Element) => {
    button.addEventListener('click', transform);
  });

  let isPassword: boolean = true;

  function transform(): void {
    const passwordInputs: NodeListOf<HTMLInputElement> = document.querySelectorAll(
      "[data-ms-member='password'], [data-ms-member='new-password'], [data-ms-member='current-password'], [ms-code-password='confirm']"
    );

    passwordInputs.forEach((myInput: HTMLInputElement) => {
      if (isPassword) {
        myInput.setAttribute('type', 'text');
      } else {
        myInput.setAttribute('type', 'password');
      }
    });

    isPassword = !isPassword;
  }
}

/**
 *  * 💙 MEMBERSCRIPT #36 v0.1 💙 PASSWORD VALIDATION
 **/
export function passwordValidation(): void {
  window.addEventListener('load', () => {
    const passwordInput = document.querySelector(
      'input[data-ms-member="password"]'
    ) as HTMLInputElement | null;
    const submitButton = document.querySelector('[ms-code-submit-button]') as HTMLElement | null;

    if (!passwordInput || !submitButton) return; // Return if essential elements are not found

    function checkAllValid(): boolean {
      const validationPoints = document.querySelectorAll('[ms-code-pw-validation]');
      return Array.from(validationPoints).every((validationPoint: Element) => {
        const validIcon = validationPoint.querySelector(
          '[ms-code-pw-validation-icon="true"]'
        ) as HTMLElement | null;
        return validIcon && validIcon.style.display === 'flex'; // Check for validIcon existence before accessing style
      });
    }

    passwordInput.addEventListener('keyup', () => {
      const password = passwordInput.value;
      const validationPoints = document.querySelectorAll('[ms-code-pw-validation]');

      validationPoints.forEach((validationPoint: Element) => {
        const rule = validationPoint.getAttribute('ms-code-pw-validation');
        let isValid = false;

        if (rule) {
          // MINIMUM LENGTH VALIDATION POINT
          if (rule.startsWith('minlength-')) {
            const minLength = parseInt(rule.split('-')[1]);
            isValid = password.length >= minLength;
          }

          // SPECIAL CHARACTER VALIDATION POINT
          else if (rule === 'special-character') {
            isValid = /[!@#$%^&*(),.?":{}|<>]/g.test(password);
          }

          // UPPER AND LOWER CASE VALIDATION POINT
          else if (rule === 'upper-lower-case') {
            isValid = /[a-z]/.test(password) && /[A-Z]/.test(password);
          }

          // NUMBER VALIDATION POINT
          else if (rule === 'number') {
            isValid = /\d/.test(password);
          }
        }

        const validIcon = validationPoint.querySelector(
          '[ms-code-pw-validation-icon="true"]'
        ) as HTMLElement | null;
        const invalidIcon = validationPoint.querySelector(
          '[ms-code-pw-validation-icon="false"]'
        ) as HTMLElement | null;

        if (validIcon && invalidIcon) {
          if (isValid) {
            validIcon.style.display = 'flex';
            invalidIcon.style.display = 'none';
          } else {
            validIcon.style.display = 'none';
            invalidIcon.style.display = 'flex';
          }
        }
      });

      if (checkAllValid()) {
        submitButton.classList.remove('disabled');
      } else {
        submitButton.classList.add('disabled');
      }
    });

    // Trigger keyup event after adding event listener
    const event = new Event('keyup');
    passwordInput.dispatchEvent(event);
  });
}

/**
 *  * 💙 MEMBERSCRIPT #CUSTOM SR 💙
 *  * Not log - Redirect Dashboard > Login
 *  TODO Redirect Dashboard > Success if plan don't fit
 **/

export function redirectNotLog() {
  memberstack.getCurrentMember().then((member: { data: unknown }) => {
    const url = window.location.href;
    if (!member.data && url.includes('/dashboard/')) {
      window.location.replace('/login');
    }
  });
}

export function redirectIfNotOnValidatedPlan() {
  memberstack.getCurrentMember().then(({ data: member }) => {
    const url = window.location.href;
    const validatedPlanId = 'pln_signup-validated-8il70t5o';
    let isOnValidatedPlan = false;

    if (member && member.planConnections && url.includes('/dashboard/')) {
      // Check if the member is on the validated plan
      isOnValidatedPlan = member.planConnections.some(
        (planConnection) => planConnection.planId === validatedPlanId && planConnection.active
      );

      // If the member is not on the validated plan, redirect to the /success page
      if (!isOnValidatedPlan) {
        window.location.replace('/success');
      }
    }
  });
}

/**
 * * 🧡 CUSTOM Studio Relief 🧡 HIDE ELEMENTS IF CUSTOM FIELD IS BLANK
 **/

interface CustomFields {
  prenom?: string;
}

interface Member {
  customFields?: CustomFields;
}

export async function displayCurrentMemberData(): Promise<void> {
  // Assumer que memberstack.getCurrentMember() retourne un type approprié
  const { data: member } = (await memberstack.getCurrentMember()) as { data: Member | null };

  if (member) {
    /**
     * * 🚨 Show Current Member Data - Hide Prod 🚨
     **/
    // eslint-disable-next-line no-console
    /* console.log('Données du membre actuel :', member); */

    const popupInfo = document.getElementById('popup-info');
    if (!popupInfo) {
      return;
    }

    if (
      member.customFields &&
      member.customFields.prenom &&
      member.customFields.prenom.trim().length > 0
    ) {
      popupInfo.style.display = 'none';
    } else {
      popupInfo.style.display = 'flex';
    }
  }
}
