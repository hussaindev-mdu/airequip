// Prefix a /public path with the site's base URL, so assets still load when the site is hosted
// under a sub-path such as https://<user>.github.io/<repo>/
export const asset = (path) => import.meta.env.BASE_URL + path.replace(/^\//, '')
