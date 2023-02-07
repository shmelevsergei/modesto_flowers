document.addEventListener('DOMContentLoaded', () => {
   const formNexPrev = () => {
      const form = document.querySelector('.form');

      const buttonNext = form.querySelector('.js-next');
      const buttonPrev = form.querySelector('.js-prev');
      const contentForm = form.querySelectorAll('.js-form');

      function checkedForm(button, content) {
         button.addEventListener('click', () => {
            content.forEach(el => {
               el.classList.toggle('is-visible');
            })
         })
      }
      checkedForm(buttonNext, contentForm);
      checkedForm(buttonPrev, contentForm);
   }

   document.querySelector('.js-form').classList.add('is-visible');

   formNexPrev();
})