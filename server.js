const express = require('express')
const app = express()
const fs = require('fs')
const port = process.env.PORT || 8900
app.use(express.static(__dirname))
app.use(express.json({limit:'10mb'}))
app.get("/assetExercise/simple", (req, res)=>{
    res.sendFile("index.html",{root:__dirname})
})

app.post('/assetExercise/api/files',(req,res)=>{
    if(!req.body){
        return res.status(400).send("please add file")
    }
    const name = req.body.name
    const content = req.body.content
    fs.writeFile(`./files/${name}`,JSON.stringify(content),()=>{})   
})
app.get('/assetExercise/api/files',(req,res)=>{
    const filelist= []
    fs.readdir(`./files`,(err,files)=>{
        if(err){
            console.log(err)
        }
         files.forEach(e=>{filelist.push(e)})
        console.log(filelist)
    })
    res.json(filelist)
    
})

app.get('/assetExercise/api/files/:filename',(req,res)=>{
    const filename = req.params.filename
    const list = []
    fs.readdir(`./files`,(err,files)=>{
        if(err){
            console.log(err)
        }
        files.forEach(e=>{list.push(e)})
        console.log(list)
    })

    const file = list.find((e)=>{return e===filename})
    if(!file){
       return res.status(404).send("file does not exist")
    }
    const obj = {}
    
    fs.readFile(`./files/${file}`,(err,data)=>{
        if(err){
            return console.log('error reading file')
        }
        const str = data.toString()
        if(str){
            obj.content = JSON.parse(str)
        }
    })
    res.json(obj)
})

app.get(`/assetExercise/userUploads/:name`,(res,req)=>{
	const name = req.params.name
	
	if(name){
		res.sendFile(`${name}`, { root: path.join(__dirname, '../files') })
	}
})



app.listen(port,()=>{console.log(`listening on port ${port} `)})
