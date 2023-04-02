export class User {
  constructor(
    private displayName: string,
    public email: string,
    public id: string,
    private _token: string,
    private _tokenExpirationDate: Date
  ) { }

  get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }
    return this._token;
  }

  log() {
    return `(${this.id}): ${this.email}`;
  }
}