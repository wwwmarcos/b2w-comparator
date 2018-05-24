#!/usr/bin/env node

const {buildPrices} = require('./lib')
const Table = require('cli-table2')

const baseUrl = process.argv[2]

const logResults = result => {
  const tables = result.map(data => {
    const table = new Table()

    table.push({
      loja: [data.shopName]
    }, {
      url: [data.product.url]
    }, {
      preco: [data.product.price]
    })

    return table
  })

  console.log('---')
  console.log(result[0].product.name)
  tables.forEach(table => console.log(table.toString()))
}

const start = async () => {
  try {
    const result = await buildPrices(baseUrl)
    logResults(result)
  } catch (error) {
    console.log('shhhh...')
  }
}

start()
