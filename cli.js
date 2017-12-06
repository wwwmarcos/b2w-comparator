#!/usr/bin/env node

const {buildPrices} = require('./lib')

const baseUrl = process.argv[2]

const logResults = result => console.log(JSON.stringify(result, null, 2))

buildPrices(baseUrl, logResults)
