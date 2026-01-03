import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const skellyFolders = [
  '../mr skelly/Mr.+Skelly+Wallpapers-21+-+PACK+3+-+Still-1728621632472',
  '../mr skelly/Mr.+Skelly+Wallpapers-21+-+PACK+2+-+Still-1725280130916',
  '../mr skelly/Mr.+Skelly+Wallpapers-21+-+Still-1721394703091',
  '../mr skelly/SKELLY STILLS',
]

const publicImagesDir = path.join(__dirname, 'public', 'images', 'skelly')

// Create directory if it doesn't exist
if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true })
}

let copiedCount = 0

skellyFolders.forEach((folder) => {
  const folderPath = path.join(__dirname, folder)
  if (fs.existsSync(folderPath)) {
    const files = fs.readdirSync(folderPath)
    files.forEach((file) => {
      if (file.toLowerCase().endsWith('.png')) {
        const sourcePath = path.join(folderPath, file)
        const destPath = path.join(publicImagesDir, file)
        fs.copyFileSync(sourcePath, destPath)
        copiedCount++
        console.log(`Copied: ${file}`)
      }
    })
  }
})

console.log(`\n✅ Copied ${copiedCount} images to public/images/skelly/`)

