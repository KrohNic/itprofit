import './styles/index.scss';

interface IField {
  element: HTMLFormElement;
  validators: ((el: HTMLFormElement) => string | null)[];
}

document.body.onload = async () => {
  const dialog = document.querySelector('#dialog') as HTMLDialogElement;
  const form = document.querySelector('#form') as HTMLFormElement;
  const dialogForm = document.querySelector('#dialog_form') as HTMLFormElement;
  const formReset = document.querySelector('#reset') as HTMLFormElement;
  const openResetDialog = document.querySelector(
    '#open-reset-dialog'
  ) as HTMLFormElement;

  const requiredValidator = (el: HTMLFormElement) => {
    if (el.value) return null;

    return 'Введите значение';
  };

  const emailValidator = (el: HTMLFormElement) => {
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value)) return null;

    return 'Введите корректный email';
  };

  const fields: IField[] = [
    {
      element: form.querySelector('#firstName') as HTMLFormElement,
      validators: [requiredValidator],
    },
    {
      element: form.querySelector('#email') as HTMLFormElement,
      validators: [requiredValidator, emailValidator],
    },
    {
      element: form.querySelector('#tel') as HTMLFormElement,
      validators: [requiredValidator],
    },
    {
      element: form.querySelector('#message') as HTMLFormElement,
      validators: [requiredValidator],
    },
  ];

  const setError = (element: HTMLFormElement, error?: string | null) => {
    const errorElement = element.parentElement!.querySelector(
      '.form--error_msg'
    ) as HTMLSpanElement;

    if (error) {
      errorElement.textContent = error;
      element.classList.add('invalid');
    } else {
      errorElement.textContent = '';
      element.classList.remove('invalid');
    }
  };

  const validateField = ({ element, validators }: IField): string | boolean => {
    console.log(element.tagName);

    for (const v of validators) {
      const msg = v(element);

      setError(element, msg);

      if (msg) return msg;
    }

    return false;
  };

  fields.forEach((field) => {
    field.element.addEventListener('change', () => validateField(field));
  });

  const resetForm = () => form.reset();

  formReset.addEventListener('click', resetForm);

  form.addEventListener('submit', async (submitEvent) => {
    submitEvent.preventDefault();

    const isInvalid = fields.reduce((acc, field) => {
      return !!validateField(field) || acc;
    }, false);

    if (isInvalid) return;

    try {
      const res = await fetch('http://localhost:9090/api/registration', {
        method: 'POST',
        body: new FormData(form),
      });

      if (res.status === 200) {
        const { msg } = await res.json();

        resetForm();
        alert(msg);
      } else if (res.status === 400) {
        const { fields: fieldsErrors } = await res.json();

        Object.entries(fieldsErrors).forEach(([field, msg]) => {
          const element = form.elements[field as any] as HTMLFormElement;

          setError(element, msg as string);
        });
      }
    } catch (error) {
      alert('Произошла ошибка, попробуйте позже');
    }
  });

  openResetDialog.addEventListener('click', () => {
    dialog.showModal();
    document.body.classList.add('hide_scroll');
    dialog.classList.add('enter');
    
    dialog.addEventListener('animationend', () => {
      dialog.classList.remove('enter');
    }, {once: true});
  });
    
  
  dialogForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    dialog.classList.add('exit');
    
    dialog.addEventListener('animationend', () => {
      dialog.close();
      dialog.classList.remove('exit');
      document.body.classList.remove('hide_scroll');
    }, {once: true});
  });
};
