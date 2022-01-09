// const cookies = document.cookie.split(';').reduce((acc, cookie) => {
//   const [name, value] = cookie.split('=');
//   return {
//     ...acc,
//     [name]: value
//   }
// }, {})

type CookieDict = { [id: string]: string }

export function getCookies(cookies: string) {
  return cookies.split(';').reduce((acc: CookieDict, cookie: string) => {
    const [name, value] = cookie.split('=');
    return {
      ...acc,
      [name]: value
    }
  }, {})
}

// export function setCookies(cookieObj: CookieDict): void {
//   let cookieStr = '';
//   for (const cookie in cookieObj) {
//     const cookieSection = cookie + '=' + cookieObj[cookie] + ';'
//     cookieStr += cookieSection
//   }
//   document.cookie = cookieStr
// }