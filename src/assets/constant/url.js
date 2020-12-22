class URL {
  static API_BASE = process.env.REACT_APP_MAIN_SERVER_API;

  // user auth
  static LOGIN = `${this.API_BASE}/auth`; // authenticate user

  // result
  static RESULT = `${this.API_BASE}/result`; // new result/get result
}

export default URL;
