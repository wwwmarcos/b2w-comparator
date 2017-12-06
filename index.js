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

  const resolve = urls.map(async shop => {
    const url = buildUrl(shop.url, productId)
    const page = await axios.get(url)

    return {
      data: page.data,
      url,
      name: shop.name
    }
  })

  return Promise.all(resolve)
}

const getPriceInfo = (page) => {
  const $ = cheerio.load(page.data)

  const price = $('.main-price .sales-price').text()
  const paymentOptions = $('.payment-option-rate').text()

  return {
    price,
    paymentOptions
  }
}

const logResults = result => console.log(JSON.stringify(result, null, 2))

const buildPrices = async (baseUrl, done) => {
  const pages = await getPages(baseUrl, urls)

  const result = pages.map(page => {
    return {
      url: page.url,
      name: page.name,
      priceInfo: getPriceInfo(page)
    }
  })

  done(result)
}

const baseUrl = process.argv[2]

buildPrices(baseUrl, logResults)
