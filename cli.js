#!/usr/bin/env node

const {buildPrices} = require('./lib')
const Table = require('cli-table2')

const baseUrl = process.argv[2]

const logResults = result => {
  const table = new Table()

  result
    .map(data => [data.shopName, data.product.name, data.product.price])
    .forEach(data => table.push(data))

  console.log(table.toString())
}

buildPrices(baseUrl, logResults)
