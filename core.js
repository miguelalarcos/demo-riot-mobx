import {observable, asMap} from 'mobx'

export const collections = {}
export const metadata = observable(asMap())

export const newCollection = (name) => collections[name] = observable(asMap())
