import {makeAutoObservable} from "mobx";

export default class UserStore {
    constructor() {
        this._isAuth = false
        this._isVerified = false
        this._id = 0
        this._role = "GUEST"
        this._email = "experement"
        makeAutoObservable(this)
    }

    setIsAuth(bool) {
        this._isAuth = bool
    }
    setId(id) {
        this._id = id
    }
    setRole(role) {
        this._role = role
    }
    setEmail(email) {
        this._email = email
    }

    setIsVerified(verified) {
        this._isVerified = verified
    }

    get isAuth() {
        return this._isAuth
    }
    get id() {
        return this._id
    }
    get email() {
        return this._email
    }
    get role() {
        return this._role
    }

    get isVerified() {
        return this._isVerified
    }
}
