let btn = document.querySelector('#addBtn');
let input = document.querySelector('input');
let mainRow = document.querySelector('#main-row')

btn.addEventListener('click',() => {
    let inputVal = input.value;
    let xml = new XMLHttpRequest();
    xml.open('post', '/save');
    xml.onreadystatechange = () => {
        if (xml.readyState == 4 && xml.status == 200) {
            //ovde kada se klikne na create pokrece funkcija displayTodos koja ponovo kreira todo
            displayTodos();
        }
    }
    xml.setRequestHeader('Content-Type', 'application/json');
    xml.send(JSON.stringify({msg: inputVal}));
})

function displayTodos(){
    let data = new Promise((resolve, reject) => {
        let xml = new XMLHttpRequest();
        xml.open('get',  '/get_data');
        xml.onreadystatechange = () => {
            if (xml.readyState == 4 && xml.status == 200) {
                resolve(JSON.parse(xml.responseText));                
            }
        }
        xml.send();
    })
    data.then((data) => {
        let text = '';
        for (let i = 0; i < data.length; i++) {
            text += `
            <div class="col-4">
                <div class="card">
                    <div class="card-header">
                        <div class="d-flex justify-content-between">
                            <button class="btn btn-sm btn-secondary">Todo : ${i + 1}</button>
                            <button class="btn btn-sm btn-success">${data[i].date}</button>
                        </div>
                    </div>
                    <div class="card-body text-center">
                        <h3>${data[i].msg}</h3>
                    </div>
                    <div class="card-footer text-end">
                        <button data-id="${data[i]._id}" class="btn btn-sm btn-danger">Delete</button>
                    </div>
                </div>
            </div>
            `
        }
        mainRow.innerHTML = text;
        let allDeleteBtns = document.querySelectorAll('[data-id]');
        for (let i = 0; i < allDeleteBtns.length; i++) {
            allDeleteBtns[i].addEventListener('click', deleteTodo);
        }
    })
}

function deleteTodo(){
    let xml = new XMLHttpRequest();
    xml.open('post', '/delete');
    xml.onreadystatechange = () => {
        if (xml.readyState == 4 && xml.status == 200) {
            displayTodos();            
        }
    }
    xml.setRequestHeader('Content-Type', 'application/json')
    xml.send(JSON.stringify({id:this.getAttribute('data-id')}));
}

displayTodos();