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

  return {
    price,
    paymentOptions
  }
}

const buildPrices = async (baseUrl) => {
  const pages = await getPages(baseUrl, urls)

  const prices = pages.map(getPriceInfo)

  console.log('prices', JSON.stringify(prices, null, 2))
}

buildPrices('https://www.submarino.com.br/produto/132116662/notebook-dell-inspiron-i15-5566-a30p-intel-core-i5-4gb-1tb-tela-led-15.6-windows-10-preto')
