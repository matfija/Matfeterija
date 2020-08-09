import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-guest',
  templateUrl: './guest.component.html',
  styleUrls: ['./guest.component.css']
})
export class GuestComponent implements OnInit {

  constructor() {}

  ngOnInit() {
    // Any time you see 'document', that is client-side JS, bc
    // we are interacting with the web page (the html file).
    const form: HTMLFormElement = document.querySelector('form');

    // We will be making a post request against this URL to actually
    // send this object to out dynamic server
    const API_URL = 'http://localhost:3000/poruke';

    // We want to hide it until the submit button is clicked.
    const loadingElement: HTMLElement = document.querySelector('.loading');
    const porukeElement: HTMLElement = document.querySelector('.poruke');

    function listAllPoruke() {
      porukeElement.innerHTML = '';
      fetch(API_URL)
        .then(response => response.json())
        .then(poruke => {
          // We want to show the poruke in reverse.
          poruke.reverse();

          // In order to add the poruke to the page, we need some reference
          // of where to add it on the page.
          poruke.forEach(poruka => {
            const div = document.createElement('div');

            const header = document.createElement('h3');
            header.textContent = poruka.name;

            const content = document.createElement('p');
            content.textContent = poruka.content;

            const date = document.createElement('small');
            date.textContent = new Date(poruka.created).toString();

            div.appendChild(header);
            div.appendChild(content);
            div.appendChild(date);

            porukeElement.appendChild(div);
          });

          loadingElement.style.display = 'none';
      });
    }

    // We want to show the loading element at first, and then call the
    // listAllPoruke function.
    loadingElement.style.display = '';
    listAllPoruke();

    form.addEventListener('submit', (event) => {
      // By default, when a form is submitted, the browser automatically
      // tries to send the data soporukahere, but we don't want that, since
      // we want to do sth with it here.
      event.preventDefault();
      const formData = new FormData(form);
      const name = formData.get('username');
      const content = formData.get('content');

      const poruka = {
        name,
        content
      };

      form.style.display = 'none';
      loadingElement.style.display = '';

      // Instead of just logging to the console, we're going to send the data.
      fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(poruka),
        headers: {
          'content-type': 'application/json'
        }
      }).then(response => response.json())
        .then(createdPoruka => {
          form.reset();
          form.style.display = '';
          loadingElement.style.display = 'none';
          listAllPoruke();
        });
    });
  }

}
