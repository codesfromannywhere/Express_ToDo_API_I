import express from "express";
import { writeFile } from "node:fs";
import fs from "node:fs/promises"


//             ==========  BASIC STUFF ==========

const app = express();
app.use(express.json())
const port = 4000;

app.get("/status", (req, res) => {
    res.status(200).send("OKAY");
});

app.listen(port, () => {
    console.log(`Hausnummer: ${port}`);
});




//             ==========  FETCHING DATA ==========

const getResponse = async () => {

    let error;
    let data;
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/todos`)

        data = await response.json();

    } catch (error) {
        console.log(error);
        error = "Schade, Schokolade! ";

    }

    return [error, data]


}

console.log(getResponse());



//             ==========  WRITING DATA TO FILE & GET ALL TODO ==========

app.get("/todos", async (req, res) => {

    const [error, data] = await getResponse();

    await fs.writeFile('mytodos.json', JSON.stringify(data, null, 2))

    if (error) {
        return res.status(500).send("Failed to connect!")
    }

    res.send(data);

})



//             ==========  GET SINGLE TODO ==========

app.get("/todos/:id", async (req, res) => {

    const [error, data] = await getResponse()

    const { id } = req.params;
    const filterToDo = data.filter((elt) => {
        return elt.id === Number(id)
    })

    await fs.writeFile('mytodos.json', JSON.stringify(data, null, 2))

    if (error) {
        return res.status(500).send("Failed to connect!")
    }

    res.send(filterToDo)
})



//             ==========  UPDATE TODO ==========

app.patch('/todos/:id/complete', async (req, res) => {

    const [error, data] = await getResponse()

    const { id } = req.params;
    const index = data.findIndex((elt) => {
        return elt.id = Number(id);
    })

    // setting To-Do to "complete" :)
    data[index].completed = true

    if (error) {
        return res.status(500).send("Failed to connect!")
    }
    await fs.writeFile('mytodos.json', JSON.stringify(data, null, 2))
    res.send(data[index])

})

