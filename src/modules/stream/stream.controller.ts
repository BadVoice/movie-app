import { Router } from 'express'
import  WebTorrent from 'webtorrent'

const router = Router()
const client = new WebTorrent()

//client info state
let state = {
    progress: 0,
    downloadSpeed: 0,
    ratio: 0
}  

let error;

client.on('error', (err: Error) => {
    console.log('err', err.message)
    error = err.message
})
//cd209eb39364b76fe82f2403c6f68d2fd2227f9b
//update state
client.on('torrent', () => {
    console.log(client.progress)
    state = {
        progress: Math.round(client.progress * 100 * 100) / 100,  //Recalculating the jump speed from kbits 
        downloadSpeed: client.downloadSpeed,
        ratio: client.ratio
    }
})

router.get('/add/:magnet', (req, res) => {
    const magnet = req.params.magnet

    client.add(magnet, torrent => {
        const files = torrent.files.map(data => ({
            name: data.name,
            length: data.length
        }))

        res.status(200).send(files)
    })
})


//stats endpoint
router.get('/stats', (req, res) => { 
    state = {
        progress: Math.round(client.progress * 100 * 100) / 100,  //Recalculating the jump speed from kbits 
        downloadSpeed: client.downloadSpeed,
        ratio: client.ratio
    }
    res.status(200).send(state)    

}) 

export default router