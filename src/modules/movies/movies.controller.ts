import { Router, Request, Response } from 'express'
import * as cheerio from 'cheerio'
import axios from 'axios'
import { parse } from 'qs'
import { SearchRequest } from './movies.interfaces'

const router = Router()

const RUTOR_URL = 'https:/rutor.org'
const BASE_SEARCH_URL = 'https://rutor.org/search/1/0/000/0'
const MAGNET_KEY = 'magnet:?xt'
const SPLIT_MAGNET_STRING = 'urn:btih'

router.get('/search', async ({query: { searchTerm}}: SearchRequest, res) => {
    try {
        const searchResult = await axios.get(`${BASE_SEARCH_URL}/${searchTerm}`)
        const $ = cheerio.load(searchResult.data)

        const data = $('#index tr').toArray()

        const results = data.map(item => {
            const [_, magnetTag, title] = $(item).find('a').toArray()

            const magnetLink = $(magnetTag).attr('href')
            const parsedMagnetLink = parse(magnetLink)
            const magnet = String(parsedMagnetLink[MAGNET_KEY]).replace(SPLIT_MAGNET_STRING, '')
            
            const torrentUrl = `${RUTOR_URL}${$(title).attr('href')}`

            return ({
                magnet,
                title: $(title).text(),
                torrentUrl
            })

        }).filter(item => item.title)

        res.status(200).send(results)
    } catch (err) {
        res.status(400).send(err)
    }
})

export default router