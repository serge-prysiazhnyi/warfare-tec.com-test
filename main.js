axios.get('http://localhost:8080/')
  .then((response) => {
    let persons = response.data.data;
    renderTable(persons);
    search(persons);
    pagination(persons);
  })
  .catch((error) => {
    console.log(error);
  });

function pagination(data) {
  let paginationButtons = document.querySelector('.pagination');
  let page = 0;
  let maxPageValue = Math.ceil(data.length / 10 ) - 1;
  paginationButtons.addEventListener('click', (e) => {
    if(e.target.classList.contains('next')) {
      page === maxPageValue ? maxPageValue : page++;
    }
    if(e.target.classList.contains('prev')) {
      page === 0 ? 0 : page--;
    }
    renderTable(data, page);
  });
}

function renderTable(data, page = 0) {
  let tbody = document.querySelector('tbody');
  let pageNum = document.querySelector('.pagenumber');
  tbody.innerHTML = "";
  for(let i = 0 + page * 10; i < 10 + page * 10 && i < data.length; i++) {
    tbody.innerHTML += `<tr>
                          <td>${data[i].id}</td>
                          <td>${data[i].name}</td>
                          <td>${data[i].email}</td>
                          <td>${data[i].funds}</td>
                          <td>${data[i].city}</td>
                          <td>${data[i].phone}</td>
                        </tr>`;
  }
  pageNum.innerHTML = page + 1;
}

function search(data) {
  let input = document.querySelector('input');
  let btn = document.querySelector('#search-btn');
  const filterData = () => {
    let query = input.value;
    if(!query) {
      return renderTable(data);
    }
    if(!isNaN(Number(query))) {
      query = Number(query);
    }
    let filteredData = data.filter(item => {
      return Object.values(item).includes(query);
    })
    renderTable(filteredData, 0);
  };
  btn.addEventListener('click', filterData);
  input.addEventListener('keydown', (e) => {
    if(e.keyCode === 13) {
      filterData();
    }
  });
};

document.querySelector('#sendRequest').addEventListener('click', () => {
  let id = document.querySelector('#id').value;
  let name = document.querySelector('#name').value;
  let city = document.querySelector('#city').value;
  let email = document.querySelector('#email').value;
  let funds = document.querySelector('#funds').value;
  let phone = document.querySelector('#phone').value;
  axios.put(`http://localhost:8080/update/:id`, {
    id,
    name,
    city,
    email,
    funds,
    phone
  })
  .then(function (response) {
    let tableRow = response.data;
    axios.get('http://localhost:8080/')
    .then((response) => {
      let persons = response.data.data;
      persons[id - 1] = tableRow
      renderTable(persons);
    })
    .catch(function (error) {
      console.log(error);
    });
  })
  .catch(function (error) {
    console.log(error);
  });
});