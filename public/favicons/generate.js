import favicons from "favicons"
import fs from "fs"

const config = {
  path: "/favicons/",
  appName: "Eclipse Vert.x",
  appShortName: "Vert.x",
  developerName: "Vert.x Community",
  start_url: "../",
  logging: true,
  icons: {
    android: false,
    appleIcon: false,
    appleStartup: false,
    coast: false,
    firefox: false,
    windows: false,
    yandex: false
  }
}

let response = await favicons("../../assets/vertx-favicon.svg", config)

for (let f of response.files) {
  console.log(`Write ${f.name} ...`)
  fs.writeFileSync(f.name, f.contents, "utf-8")
}

for (let f of response.images) {
  console.log(`Write ${f.name} ...`)
  fs.writeFileSync(f.name, f.contents)
}

console.log("---------------------------------------------------------------")
console.log("INSERT THE FOLLOWING INTO YOUR Header.jsx")
console.log("---------------------------------------------------------------")
for (let s of response.html) {
  s = s.replace(/>$/m, "/>")
  console.log(s)
}
