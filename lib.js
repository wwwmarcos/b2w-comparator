
const axios = require('axios')
const cheerio = require('cheerio')
const urls = require('./urls')

const getProductId = (url) => {
  const match = url.match(/\/(\d+)\/?/)
  return match ? match[1] : null
}

const buildUrl = (url, id) => `${url}/produto/${id}`

const getPages = async (baseUrl, urls) => {
  const productId = getProductId(baseUrl)

  const resolve = urls.map(async shop => {
    const productUrl = buildUrl(shop.url, productId)
    const page = await axios.get(productUrl)

    return {
      data: page.data,
      productUrl,
      shopUrl: shop.url,
      name: shop.name
    }
  })

  return Promise.all(resolve)
}

const getProductInfo = (page) => {
  const $ = cheerio.load(page.data)

  const price = $('.main-price .sales-price').text()
  const paymentOptions = $('.payment-option-rate').text()
  const name = $('.product-name').text()

  return {
    price,
    name,
    paymentOptions,
    url: page.productUrl
  }
}

const buildPrices = async (baseUrl, done) => {
  const pages = await getPages(baseUrl, urls)

  const result = pages.map(page => {
    return {
      shopName: page.name,
      shopUrl: page.shopUrl,
      product: getProductInfo(page)
    }
  })

  done(result)
}

module.exports = {
  buildPrices
}
