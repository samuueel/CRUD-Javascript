'use strict'

const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}

document.getElementById('cadastrarCliente')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

const tempClient = {
    nome: "Samuel",
    celular: "(51) 998433243",
    setor: "Desenvolvimento",
    salario: "3,000.00"
}

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_client')) ?? [];
const setLocalStorage = (dbClient) => localStorage.setItem('db_client', JSON.stringify(dbClient))

// DELETE
const deleteClient = (index) => {
    const dbClient = readClient();
    dbClient.splice(index, 1)
    setLocalStorage(dbClient)
}

// UPDATE
const updateClient = (index, client) => {
    const dbClient = readClient()
    dbClient[index] = client
    setLocalStorage(dbClient)
}

// READ
const readClient = () => getLocalStorage()

// CREATE
const createClient = (client) => {
    const dbClient = getLocalStorage()
    dbClient.push(client)
    setLocalStorage(dbClient)
}

// VALIDAÇÃO DOS INPUTS
const isValidFields = () => {
    return document.getElementById('form').reportValidity();
}

// INTERAÇÃO COM O LAYOUT

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach( field => field.velue = '');
}

const saveClient = () => {
    if (isValidFields()) {
        const client = {
            nome: document.getElementById('nome').value,
            celular: document.getElementById('celular').value,
            setor: document.getElementById('setor').value,
            salario: document.getElementById('salario').value,
        }
        const index = document.getElementById('nome').dataset.index
        if (index == 'new') {
            createClient(client)
            updateTable()
            closeModal() 
        } else {
            updateClient(index, client)
            updateTable()
            closeModal()
        }       
    }
}

const createRow = (client, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td data-label="Nome:">${client.nome}</td>
        <td data-label="Celular:">${client.celular}</td>
        <td data-label="Setor:">${client.setor}</td>
        <td data-label="Salario:">${client.salario}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}">Excluir</button>
        </td>
    `
    document.querySelector('#tableClient>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableClient>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbClient = readClient();
    clearTable();
    dbClient.forEach(createRow);
}

const fillFields = (client) => {
    document.getElementById('nome').value = client.nome
    document.getElementById('celular').value = client.celular
    document.getElementById('setor').value = client.setor
    document.getElementById('salario').value = client.salario
    document.getElementById('nome').dataset.index = client.index
}

const editClient = (index) => {
    const client = readClient()[index];
    client.index = index;
    fillFields(client)
    openModal()
}

const editDelete = (event) => {
    if (event.target.type === 'button') {
        const [action, index] = event.target.id.split('-')

        if (action === 'edit') {
            editClient(index)
        } else {
            const client = readClient()[index]
            const response = confirm(`Deseja excluir o cliente ${client.nome}?`)
            if (response) {
                deleteClient(index)
                updateTable() 
            }      
        }
    }
}

updateTable()

// EVENTOS
document.getElementById('cadastrarCliente')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', saveClient)

document.querySelector("#tableClient>tbody").addEventListener('click', editDelete)