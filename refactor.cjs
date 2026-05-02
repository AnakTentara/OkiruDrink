const fs = require('fs')
const path = require('path')

const walkSync = (dir, filelist = []) => {
  const files = fs.readdirSync(dir)
  for (const file of files) {
    const dirFile = path.join(dir, file)
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist)
    } else {
      if (dirFile.endsWith('.jsx')) {
        filelist.push(dirFile)
      }
    }
  }
  return filelist
}

const files = walkSync(path.join(__dirname, 'src'))

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8')
  let changed = false
  
  if (content.includes('UserContext')) {
    content = content.replace(/import \{ useUser \} from '\.\.\/context\/UserContext'/g, "import { useUserStore as useUser } from '../store/useUserStore'")
    content = content.replace(/import \{ useUser \} from '\.\.\/\.\.\/context\/UserContext'/g, "import { useUserStore as useUser } from '../../store/useUserStore'")
    changed = true
  }

  if (content.includes('CartContext')) {
    content = content.replace(/import \{ useCart \} from '\.\.\/context\/CartContext'/g, "import { useCartStore as useCart } from '../store/useCartStore'")
    content = content.replace(/import \{ useCart \} from '\.\.\/\.\.\/context\/CartContext'/g, "import { useCartStore as useCart } from '../../store/useCartStore'")
    changed = true
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8')
    console.log('Updated', file)
  }
}
