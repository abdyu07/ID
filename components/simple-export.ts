// Simple export functionality that works around CSP restrictions
export const exportCardAsPNG = async (elementId: string, filename: string) => {
  try {
    const element = document.getElementById(elementId)
    if (!element) {
      alert('Card element not found')
      return
    }

    // Use canvas to capture the element
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      alert('Canvas not supported')
      return
    }

    // Set canvas size to match element
    const rect = element.getBoundingClientRect()
    canvas.width = rect.width * 2 // Higher resolution
    canvas.height = rect.height * 2
    ctx.scale(2, 2)

    // Create SVG with foreign object containing the HTML
    const data = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${rect.width}" height="${rect.height}">
        <foreignObject width="100%" height="100%">
          <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: Inter, sans-serif;">
            ${element.outerHTML}
          </div>
        </foreignObject>
      </svg>
    `

    const img = new Image()
    img.onload = () => {
      ctx.drawImage(img, 0, 0)
      
      // Create download link
      const link = document.createElement('a')
      link.download = filename
      link.href = canvas.toDataURL('image/png')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
    
    img.onerror = () => {
      // Fallback: create a simple representation
      createFallbackExport(element, filename)
    }
    
    const svgBlob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(svgBlob)
    img.src = url
    
  } catch (error) {
    console.error('Export error:', error)
    alert('Export failed. This may be due to browser security restrictions.')
  }
}

const createFallbackExport = (element: Element, filename: string) => {
  // Create a simple canvas-based export as fallback
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  canvas.width = 400
  canvas.height = 250
  
  // Draw a simple representation
  ctx.fillStyle = '#f0f0f0'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  ctx.fillStyle = '#333'
  ctx.font = '16px Inter, sans-serif'
  ctx.fillText('UK Digital ID Card', 20, 40)
  ctx.fillText('Export functionality limited', 20, 70)
  ctx.fillText('due to browser restrictions', 20, 90)
  
  // Create download
  const link = document.createElement('a')
  link.download = filename
  link.href = canvas.toDataURL('image/png')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const exportBothCardsAsPDF = () => {
  alert('PDF export is currently limited due to browser security restrictions. Please use the PNG export options instead.')
}
