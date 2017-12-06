
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

const getProductInfo = (page) => {
  const $ = cheerio.load(page.data)

  const price = $('.main-price .sales-price').text()
  const paymentOptions = $('.payment-option-rate').text()
  const name = $('.product-name').text()

  return {
    price,
    name,
    paymentOptions
  }
}

const buildPrices = async (baseUrl, done) => {
  const pages = await getPages(baseUrl, urls)

  const result = pages.map(page => {
    return {
      url: page.url,
      shopName: page.name,
      product: getProductInfo(page)
    }
  })

  done(result)
}

module.exports = {
  buildPrices
}
