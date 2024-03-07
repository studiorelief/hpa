import axios from 'axios';
import { fromEvent } from 'rxjs';
import { debounceTime, filter, map, switchMap } from 'rxjs/operators';

/*
 * * SignUpLoad - wrapper global
 * * setupPostalCodeInput - avoid space & access to input
 * * loadCamping - Fetch camping
 * * updateDropdownOptions - Push Camping data in Dropdown
 * * fetchVilleByCodePostal - Fetch & Push Data Commune in Input
 * * getCodeInfos - Get Datas code DEP / REG / ETN for new Camping
 * * matchCampingPseudo - Match Camping name in DB
 * * generateCodePseudo - Get codePseudo from Mapping
 * * getCodeEmplacement - Generate code Emplacement from number
 * * fillIfEmpty - Put text if empty
 * * disabledTabInForm - UX for Tab Key
 */

interface Camping {
  id: number;
  created_at: number;
  Nom: string;
  adresse_ville: string;
  adresse_codePostal: string; // Changé de number à string
  classement_nombreEtoiles: number;
  description_emplNus: number;
  description_emplHebergementHLL: number;
  identifiant: string;
  code_pseudo: string;
}

interface CodeInfos {
  Code_postal: string; // Changé de number à string
  DEP: string;
  REG: string;
  ETN: string;
}

/*
 * * SignUpLoad - wrapper global
 */

export function signUpLoad(): void {
  const codePostalInput = document.getElementById('code-postal') as HTMLInputElement;
  const communeInput = document.getElementById('commune-check') as HTMLInputElement;
  const dropdownToggles = document.querySelectorAll('.w-dropdown-toggle, .form_input.is-dropdown');

  /*
   * * setupPostalCodeInput - avoid space & access to input
   */

  function setupPostalCodeInput(): void {
    if (!codePostalInput || !communeInput || dropdownToggles.length === 0) return;

    codePostalInput.addEventListener('input', () => {
      codePostalInput.value = codePostalInput.value.replace(/\s/g, '');

      if (codePostalInput.value.length === 5) {
        setTimeout(() => {
          dropdownToggles.forEach((dropdownToggle) => {
            (dropdownToggle as HTMLButtonElement).classList.remove('is-disabled');
          });
        }, 2000);
        loadCampings(codePostalInput.value);
      } else {
        dropdownToggles.forEach((dropdownToggle) => {
          (dropdownToggle as HTMLButtonElement).classList.add('is-disabled');
        });
      }
    });
  }

  /*
   * * loadCamping - Fetch camping
   */

  function loadCampings(codePostal: string): void {
    axios
      .get<Camping[]>(`https://x8ki-letl-twmt.n7.xano.io/api:3YZbHveI/hpa_camping-db-final`)
      .then((response) => {
        const filteredCampings = response.data.filter(
          (camping) => camping.adresse_codePostal === codePostal
        );
        updateDropdownOptions(filteredCampings);
      })
      .catch((error) => console.error('Error fetching campings:', error));
  }

  /*
   * * updateDropdownOptions - Push Camping data in Dropdown
   */

  function updateDropdownOptions(campings: Camping[]): void {
    const dropdownElement = document.getElementById('camping-dd-fetch') as HTMLSelectElement;
    if (!dropdownElement) return;

    dropdownElement.innerHTML = '<option value="">Sélectionnez votre camping...</option>';

    campings.forEach((camping) => {
      const option = document.createElement('option');
      option.value = camping.Nom;
      option.textContent = camping.Nom;
      dropdownElement.appendChild(option);
    });

    // S'assure que l'option "Nouveau camping" est toujours disponible
    addNewCampingOptionIfNeeded(dropdownElement);

    dropdownElement.addEventListener('change', (event) => {
      const target = event.target as HTMLSelectElement;
      const autresWrapper = document.querySelector('.form_autres-wrapper.is-camping');
      if (!autresWrapper || !(autresWrapper instanceof HTMLElement)) return;

      if (target.value === 'Nouveau camping') {
        autresWrapper.style.display = 'flex';
        autresWrapper.style.opacity = '1';
        autresWrapper.style.transform = 'translateY(0rem)';
      } else {
        autresWrapper.style.display = 'none';
        autresWrapper.style.transform = 'translateY(-1.5rem)';
      }
    });
  }

  function addNewCampingOptionIfNeeded(dropdownElement: HTMLSelectElement) {
    if (!Array.from(dropdownElement.options).some((option) => option.value === 'Nouveau camping')) {
      const newCampingOption = document.createElement('option');
      newCampingOption.value = 'Nouveau camping';
      newCampingOption.textContent = 'Nouveau camping';
      dropdownElement.appendChild(newCampingOption);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const selectOptionEmpty = document.getElementById('select-option-empty');

    if (selectOptionEmpty) {
      selectOptionEmpty.addEventListener('click', (e) => {
        e.preventDefault(); // Empêche le comportement par défaut du lien

        // Utilise querySelector pour cibler directement le premier lien correspondant
        const link = Array.from(
          document.querySelectorAll('.fs_selectcustom-3_link.w-dropdown-link[role="option"]')
        ).find((el) => el.textContent?.trim() === 'Nouveau camping');

        if (link && link instanceof HTMLElement) {
          link.click(); // Exécute un clic sur le lien trouvé
        }
      });
    }
  });

  /*
   * * fetchVilleByCodePostal - Fetch & Push Data Commune in Input
   */

  const fetchVilleByCodePostal = async (codePostal: string): Promise<string> => {
    try {
      const response = await axios.get<Camping[]>(
        `https://x8ki-letl-twmt.n7.xano.io/api:3YZbHveI/hpa_camping-db-final`
      );
      const filteredCampings = response.data.filter(
        (camping) => camping.adresse_codePostal === codePostal
      );
      const communes = filteredCampings.map((camping) => camping.adresse_ville);
      const uniqueCommunes = [...new Set(communes)]; // Supprime les doublons

      const communeDropdown = document.getElementById('commune-check') as HTMLSelectElement;
      const communeDropdownInput = document.getElementById('commune-name') as HTMLInputElement;

      communeDropdown.innerHTML = '';

      if (uniqueCommunes.length > 0) {
        uniqueCommunes.forEach((commune) => {
          const option = document.createElement('option');
          option.value = commune;
          option.textContent = commune;
          communeDropdown.appendChild(option);
        });

        const [firstCommune] = uniqueCommunes;
        communeDropdownInput.value = firstCommune;
        return firstCommune; // Retourne la première commune trouvée
      }
      /* communeDropdownInput.value = 'Remplir manuellement'; */ // Réactiver pour remplir champs explication
      return 'Aucune commune trouvée'; // Retourne cette chaîne si aucune commune n'est trouvée
    } catch (error) {
      console.error('Erreur lors de la récupération des données : ', error);
      const communeDropdown = document.getElementById('commune-check') as HTMLSelectElement;
      communeDropdown.innerHTML = '<option value="">Erreur de chargement</option>';
      return 'Erreur de chargement'; // Retourne cette chaîne en cas d'erreur
    }
  };

  /*
   * * getCodeInfos - Get Datas code DEP / REG / ETN for new Camping
   */

  const getCodeInfos = async () => {
    fromEvent(codePostalInput, 'input')
      .pipe(
        debounceTime(500),
        map((event) => (event.target as HTMLInputElement).value),
        filter((codePostal) => codePostal.length >= 4),
        switchMap((codePostal) =>
          axios
            .get<CodeInfos[]>(
              `https://x8ki-letl-twmt.n7.xano.io/api:3YZbHveI/hpa_code-postaux-final`
            )
            .then((response) => {
              const info = response.data.find((info) => info.Code_postal === codePostal);
              return info;
            })
        )
      )
      .subscribe((info) => {
        if (info) {
          (document.getElementById('Code-DEP') as HTMLInputElement).value = info.DEP;
          (document.getElementById('Code-REG') as HTMLInputElement).value = info.REG;
          (document.getElementById('Code-ETN') as HTMLInputElement).value = info.ETN;
        }
      });
  };

  /*
   * * matchCampingPseudo - Match Camping name in DB
   */

  function matchCampingPseudo(): void {
    const campingFetchSelect = document.getElementById('camping-dd-fetch') as HTMLSelectElement;
    const codePseudoInput = document.getElementById('code-pseudo-existant') as HTMLInputElement;
    const codePostalInput = document.getElementById('code-postal') as HTMLInputElement;

    if (!campingFetchSelect || !codePseudoInput || !codePostalInput) return;

    fromEvent(campingFetchSelect, 'change')
      .pipe(
        map((event) => (event.target as HTMLSelectElement).value),
        switchMap((campingName) =>
          axios
            .get<Camping[]>(`https://x8ki-letl-twmt.n7.xano.io/api:3YZbHveI/hpa_camping-db-final`)
            .then((response) => {
              const campingsAtPostalCode = response.data.filter(
                (camping) => camping.adresse_codePostal.toString() === codePostalInput.value
              );
              const matchingCamping = campingsAtPostalCode.find(
                (camping) => camping.Nom === campingName
              );
              return matchingCamping ? matchingCamping.code_pseudo : '';
            })
        )
      )
      .subscribe((codePseudo) => {
        codePseudoInput.value = codePseudo;
      });
  }

  /*
   * * generateCodePseudo - Get codePseudo from Mapping
   */

  function generateCodePseudo(): void {
    const codeETNInput = document.getElementById('Code-ETN') as HTMLInputElement;
    const codeREGInput = document.getElementById('Code-REG') as HTMLInputElement;
    const codeDEPInput = document.getElementById('Code-DEP') as HTMLInputElement;
    const nombreEmplacementsInput = document.getElementById(
      'nombre-emplacements'
    ) as HTMLInputElement;
    const codePseudoInput = document.getElementById('code-pseudo') as HTMLInputElement;

    function getCodeEtoile(): string {
      const starRatings = document.getElementsByName(
        'star-nouveau-camping'
      ) as NodeListOf<HTMLInputElement>;
      for (const rating of starRatings) {
        if (rating.checked) {
          switch (rating.id) {
            case 'non-communique':
              return 'E0';
            case '1-etoile':
              return 'E1';
            case '2-etoiles':
              return 'E2';
            case '3-etoiles':
              return 'E3';
            case '4-etoiles':
              return 'E4';
            case '5-etoiles':
              return 'E5';
            default:
              return 'E0';
          }
        }
      }
      return 'Nul';
    }

    /*
     * * getCodeEmplacement - Generate code Emplacement from number
     */

    function getCodeEmplacement(): string {
      const nombreEmplacements = parseInt(nombreEmplacementsInput.value);
      if (nombreEmplacements < 50) return '0';
      if (nombreEmplacements >= 50 && nombreEmplacements <= 99) return '1';
      if (nombreEmplacements >= 100 && nombreEmplacements <= 199) return '2';
      if (nombreEmplacements >= 200 && nombreEmplacements <= 499) return '3';
      if (nombreEmplacements >= 500) return '4';
      return '0';
    }

    // Générer le code pseudo
    const codeEtoile = getCodeEtoile();
    const codeEmplacement = getCodeEmplacement();
    const codeETN = codeETNInput.value;
    const codeREG = codeREGInput.value;
    const codeDEP = codeDEPInput.value;

    // Assemblage du code pseudo
    const codePseudo = `${codeEtoile}_${codeEmplacement}_${codeETN}_${codeREG}_D${codeDEP}`;
    codePseudoInput.value = codePseudo;
  }

  document
    .querySelectorAll(
      '#nombre-emplacements, [name="star-nouveau-camping"], #Code-ETN, #Code-REG, #Code-DEP'
    )
    .forEach((element) => element.addEventListener('change', generateCodePseudo));

  const init = () => {
    getCodeInfos();
    fromEvent(codePostalInput, 'input')
      .pipe(
        debounceTime(500),
        map((event) => (event.target as HTMLInputElement).value),
        filter((codePostal) => codePostal.length >= 4),
        switchMap((codePostal) => fetchVilleByCodePostal(codePostal))
      )
      .subscribe((ville: string) => {
        // Spécifiez le type de 'ville' pour éviter l'erreur TypeScript
        communeInput.value = ville ?? 'Ville introuvable';
      });

    matchCampingPseudo();
    generateCodePseudo();
  };

  init();
  setupPostalCodeInput();
}

/*
 * * fillIfEmpty - Put text if empty
 */

/* export function fillIfEmpty() {
  document.querySelector('.fs-combobox_option-empty')?.addEventListener('click', () => {
    const inputElement = document.getElementById('camping-name') as HTMLInputElement;
    if (inputElement) {
      inputElement.value = 'Remplir manuellement';
    }
  });
} */

/*
 * * disabledTabInForm - UX for Tab Key + Autocomplete
 */

export function disabledTabInForm() {
  document.addEventListener('DOMContentLoaded', function () {
    const inputCodePostal = document.getElementById('code-postal');
    if (inputCodePostal) {
      inputCodePostal.addEventListener('keydown', function (e) {
        if (e.keyCode === 9) {
          e.preventDefault();
        }
      });

      inputCodePostal.setAttribute('autocomplete', 'new-password');
    }
  });
}

/*
 * *💙 MEMBERSCRIPT #22 v0.1 💙 DISABLE SUBMIT BUTTON UNTIL REQUIRED FIELDS ARE COMPLETE
 * * disabledTabInForm - UX for Tab Key + Autocomplete
 */

export function disableButtonIfRequired(): void {
  window.onload = function () {
    const forms = document.querySelectorAll('form[ms-code-submit-form]');

    forms.forEach((form) => {
      const submitButton = form.querySelector('input[type="submit"]');
      const requiredFields = form.querySelectorAll<HTMLInputElement>('input[required]');

      form.addEventListener('input', function () {
        const allFilled = Array.from(requiredFields).every((field) => field.value.trim() !== '');

        if (submitButton) {
          if (allFilled) {
            submitButton.classList.add('submit-enabled');
          } else {
            submitButton.classList.remove('submit-enabled');
          }
        }
      });
    });
  };
}
