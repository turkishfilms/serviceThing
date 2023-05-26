


const addEntry = (entry) => { fetch(`https://localhost:5000/add${entry}`) }

const dropEntry = (entry) => { fetch(`https://localhost:5000/completed${entry}`) }

const showAllEntries = () => {
    showAllEntries.forEach(entry =>
        document.getElementById('full-list').appendChild(entry))
}