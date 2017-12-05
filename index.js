#!/usr/bin/env node

const axios = require('axios')
const cheerio = require('cheerio')
const urls = require('./urls')

const getProductId = (url) => {
  const match = url.match(/\/(\d+)\/?/)
  return match ? match[1] : null
}

const buildUrl = (url, id) => `${url}/${id}`

const getPages = async (baseUrl, urls) => {
  const productId = getProductId(baseUrl)
  const resolve = urls.map(shop => axios.get(buildUrl(shop.url, productId)))
  return Promise.all(resolve)
}

const getPriceInfo = (page) => {
  const $ = cheerio.load(page.data)

  const price = $('.main-price .sales-price').text()
  const paymentOptions = $('.payment-option-rate').text()
  const title = $('title').text()

  return {
    title,
    price,
    paymentOptions
  }
}

const logResults = result => console.log(JSON.stringify(result, null, 2))

const buildPrices = async (baseUrl, done) => {
  const pages = await getPages(baseUrl, urls)
  done(pages.map(getPriceInfo))
}

const site = process.argv[2]

buildPrices(site, logResults)
