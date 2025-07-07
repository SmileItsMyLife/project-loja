import { makeAutoObservable } from "mobx";

export default class ProductStore {
    constructor() {
        this._products = []
        this._basket = []
        this._page = 1
        this._totalCount = 0
        this._limit = 3
        this._totalPages = 1
        this._recommneds = []
        makeAutoObservable(this)
    }

    setBasket(basket) {
        this._basket = basket
    }

    setTotalPages(totalPages) {
        this._totalPages = totalPages
    }

    setProducts(products) {
        this._products = products
    }

    setPage(page) {
        this._page = page
    }
    setTotalCount(count) {
        this._totalCount = count
    }

    setRecommends(products) {
        this._recommneds = products
    }

    get recommends() {
        return this._recommneds
    }

    get products() {
        return this._products
    }

    get totalCount() {
        return this._totalCount
    }
    get page() {
        return this._page
    }
    get limit() {
        return this._limit
    }

    get basket() {
        return this._basket
    }

    get totalPages() {
        return this._totalPages
    }
}
