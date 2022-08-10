const express = require('express');
const {Router} = express;
const Contenedor = require('./api/productos');

//Router Productos

const prod = new Contenedor();
const routerProductos = new Router();
routerProductos.use(express.json());
routerProductos.use(express.urlencoded({extended: true}));

const app = express();

//MIDDLEWARE
const existe = (req, res, next) => {
    const id = req.params.id;
    if (!prod.getById(id)){
        res.status(500).json({error: 'Producto no encontrado'});
    }
    next();
}

routerProductos.get('/productos', (req, res) => {
    try {
        res.send(prod.getAll());
    } catch (error) {
        console.log(error)
    } 
    
})

routerProductos.get('/productos/:id', existe,(req, res) => {
    const id= req.params.id; 
    console.log(id);
    res.json(prod.getById(id));
})

routerProductos.post('/productos', (req, res) => {
    try {
    prod.save(req.body);
    res.json(req.body);
    } catch (error) {
       console.log(error); 
    }   
}) 

routerProductos.put('/productos/:id', existe ,(req, res) => {
   try {
    console.log (req.body, req.params.id);
    prod.update(req.body, req.params.id);
    res.send(prod.getAll());
   } catch (error) {
    console.log(error)
   }
})

routerProductos.delete('/productos/:id',existe , (req, res) => {
    try {
        const id = req.params.id;
        prod.deleteById(id);
        res.json( prod.getAll())
    } catch (error) {
       console.log(error); 
    }  
})

//SERVIDOR

app.use(express.static('public'))
app.use('/api', routerProductos);

const PORT= 8080;
const server = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`)
})

server.on("error" , error => console.log(`Error en el servidor ${error}`));