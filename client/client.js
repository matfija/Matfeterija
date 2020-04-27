// Any time you see 'document', that is client-side JS, bc
// we are interacting with the web page (the html file).
const form = document.querySelector('form');

// We will be making a post request against this URL to actually
// send this object to out dynamic server
const API_URL = 'http://localhost:5000/mews'

// We want to hide it until the submit button is clicked.
const loadingElement = document.querySelector('.loading');
const mewsElement = document.querySelector('.mews');

function listAllMews() {
  console.log("listing all mews")
  mewsElement.innerHTML = '';
  fetch(API_URL)
    .then(response => response.json())
    .then(mews => {
      console.log("Ovde sam");
      console.log(mews);
      // We want to show the mews in reverse.
      mews.reverse();

      // In order to add the mews to the page, we need some reference
      // of where to add it on the page.
      mews.forEach(mew => {
        const div = document.createElement('div');

        const header = document.createElement('h3');
        header.textContent = mew.name;

        const content = document.createElement('p');
        content.textContent = mew.content;

        const date = document.createElement('small');
        date.textContent = new Date(mew.created);

        div.appendChild(header);
        div.appendChild(content);
        div.appendChild(date);

        mewsElement.appendChild(div);
      });
    });
}

// We want to show the loading element at first, and then call the
// listAllMews function.
loadingElement.style.display = '';
listAllMews();

form.addEventListener('submit', (event) => {
  // By default, when a form is submitted, the browser automatically
  // tries to send the data somewhere, but we don't want that, since
  // we want to do sth with it here.
  event.preventDefault();
  const formData = new FormData(form);
  const name = formData.get('username');
  const content = formData.get('content');

  const mew = {
    name,
    content
  };

  form.style.display = 'none';
  loadingElement.style.display = '';

  // Instead of just logging to the console, we're going to send the
  // data somewhere.
  // console.log(mew);
  fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify(mew),
    headers: {
      'content-type': 'application/json'
    }
  }).then(response => response.json())
    .then(createdMew => {
      console.log(createdMew);
      form.reset();
      form.style.display = '';
      loadingElement.style.display = 'none';
      listAllMews();
    });
});
