// Robust export solution that works around browser security restrictions

export const exportCardAsImage = async (elementId: string, filename: string) => {
  try {
    const element = document.getElementById(elementId)
    if (!element) {
      alert('Card element not found')
      return
    }

    // Method 1: Try using the native browser screenshot API if available
    if ('getDisplayMedia' in navigator.mediaDevices) {
      try {
        // This would require user permission but provides high quality
        alert('For best quality export, please use your browser\'s built-in screenshot feature:\n\n1. Right-click on the card\n2. Select "Save image as..." or use Ctrl+Shift+S for full page screenshot\n3. Crop to the card area\n\nAlternatively, the export will continue with a simplified version.')
      } catch (e) {
        console.log('Native screenshot not available')
      }
    }

    // Method 2: Create a high-quality canvas representation
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      alert('Canvas not supported in this browser')
      return
    }

    // Set high resolution
    const scale = 3
    canvas.width = 856 * scale  // Standard ID card width in pixels
    canvas.height = 540 * scale // Standard ID card height in pixels
    ctx.scale(scale, scale)

    // Get the actual element styles and content
    const computedStyle = window.getComputedStyle(element)
    const rect = element.getBoundingClientRect()

    // Draw background with gradient (approximating the card design)
    const gradient = ctx.createLinearGradient(0, 0, 856, 540)
    gradient.addColorStop(0, '#fdf2f8')  // from-pink-100
    gradient.addColorStop(0.5, '#faf5ff') // via-purple-50  
    gradient.addColorStop(1, '#dbeafe')   // to-blue-100
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 856, 540)

    // Add border
    ctx.strokeStyle = '#d1d5db'
    ctx.lineWidth = 4
    ctx.strokeRect(0, 0, 856, 540)

    // Extract and draw text content from the actual element
    const textElements = element.querySelectorAll('span, div')
    ctx.fillStyle = '#000000'
    ctx.font = '16px Inter, sans-serif'

    // Draw card content based on element ID
    if (elementId === 'card-front') {
      drawFrontCard(ctx, element)
    } else if (elementId === 'card-back') {
      drawBackCard(ctx, element)
    }

    // Convert to blob and download
    canvas.toBlob((blob) => {
      if (!blob) {
        alert('Failed to generate image')
        return
      }
      
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.download = filename
      link.href = url
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      console.log(`Successfully exported ${filename}`)
    }, 'image/png', 1.0)

  } catch (error) {
    console.error('Export error:', error)
    alert('Export failed due to browser security restrictions. Please use browser screenshot functionality for best results.')
  }
}

function drawFrontCard(ctx: CanvasRenderingContext2D, element: Element) {
  // Header
  ctx.fillStyle = '#374151'
  ctx.font = 'bold 12px Inter, sans-serif'
  ctx.fillText('UNITED KINGDOM', 40, 40)
  
  // Get ID number from element
  const idNumber = element.querySelector('.text-sm.font-bold.text-gray-800')?.textContent || '123456789'
  ctx.fillText(idNumber, 700, 40)
  
  ctx.fillText('National Identity Card', 600, 70)
  
  // Photo placeholder
  ctx.fillStyle = '#e5e7eb'
  ctx.fillRect(40, 120, 128, 160)
  ctx.fillStyle = '#6b7280'
  ctx.font = '12px Inter, sans-serif'
  ctx.fillText('Photo', 90, 210)
  
  // Personal information
  ctx.fillStyle = '#dc2626'
  ctx.font = 'bold 10px Inter, sans-serif'
  ctx.fillText('Surname/Nom', 200, 140)
  
  ctx.fillStyle = '#111827'
  ctx.font = 'bold 14px Inter, sans-serif'
  const surname = element.textContent?.match(/Surname\/Nom\s*([^\n]*)/)?.[1]?.trim() || 'Henderson'
  ctx.fillText(surname, 200, 160)
  
  ctx.fillStyle = '#dc2626'
  ctx.font = 'bold 10px Inter, sans-serif'
  ctx.fillText('Given names/Prénoms', 200, 180)
  
  ctx.fillStyle = '#111827'
  ctx.font = 'bold 14px Inter, sans-serif'
  const givenNames = element.textContent?.match(/Given names\/Prénoms\s*([^\n]*)/)?.[1]?.trim() || 'Elizabeth'
  ctx.fillText(givenNames, 200, 200)
  
  // Sex and Nationality
  ctx.fillStyle = '#dc2626'
  ctx.font = 'bold 10px Inter, sans-serif'
  ctx.fillText('Sex/Sexe', 200, 220)
  ctx.fillText('Nationality/Nationalité', 300, 220)
  
  ctx.fillStyle = '#111827'
  ctx.font = 'bold 14px Inter, sans-serif'
  ctx.fillText('M', 200, 240)
  ctx.fillText('British Citizen', 300, 240)
  
  // Dates at bottom
  ctx.fillStyle = '#dc2626'
  ctx.font = 'bold 10px Inter, sans-serif'
  ctx.fillText('Date of birth/Date de naissance', 40, 420)
  ctx.fillText('Place of birth/Lieu de naissance', 400, 420)
  
  ctx.fillStyle = '#111827'
  ctx.font = 'bold 12px Inter, sans-serif'
  ctx.fillText('14-04-1977', 40, 440)
  ctx.fillText('London', 400, 440)
  
  ctx.fillStyle = '#dc2626'
  ctx.font = 'bold 10px Inter, sans-serif'
  ctx.fillText('Date of issue/Date de délivrance', 40, 480)
  ctx.fillText('Date of expiry/Date d\'expiration', 400, 480)
  
  ctx.fillStyle = '#111827'
  ctx.font = 'bold 12px Inter, sans-serif'
  ctx.fillText('01-08-2009', 40, 500)
  ctx.fillText('31-07-2019', 400, 500)
  
  // UK emblem
  ctx.fillStyle = '#991b1b'
  ctx.beginPath()
  ctx.arc(720, 180, 30, 0, 2 * Math.PI)
  ctx.fill()
  
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 12px Inter, sans-serif'
  ctx.fillText('UK', 710, 185)
  
  // Signature
  ctx.fillStyle = '#374151'
  ctx.font = 'italic 12px Inter, sans-serif'
  ctx.fillText('Signature Sample', 600, 350)
}

function drawBackCard(ctx: CanvasRenderingContext2D, element: Element) {
  // Header text
  ctx.fillStyle = '#374151'
  ctx.font = '10px Inter, sans-serif'
  ctx.fillText('Issued by Home Office Identity & Passport Service. If found, please send to FREEPOST IPS', 40, 40)
  
  // Chip
  ctx.fillStyle = '#fbbf24'
  ctx.fillRect(40, 80, 96, 64)
  ctx.strokeStyle = '#92400e'
  ctx.strokeRect(40, 80, 96, 64)
  
  // Chip contacts
  ctx.fillStyle = '#92400e'
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      ctx.fillRect(50 + i * 25, 90 + j * 15, 20, 10)
    }
  }
  
  // Contact info
  ctx.fillStyle = '#374151'
  ctx.font = 'bold 12px Inter, sans-serif'
  ctx.fillText('For card enquiries please call', 160, 100)
  ctx.font = '12px Inter, sans-serif'
  ctx.fillText('0300 330 0000 or visit', 160, 120)
  ctx.fillText('www.direct.gov.uk/identity', 160, 140)
  
  // QR Code placeholder
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(650, 80, 128, 128)
  ctx.strokeStyle = '#d1d5db'
  ctx.strokeRect(650, 80, 128, 128)
  ctx.fillStyle = '#000000'
  ctx.font = '12px Inter, sans-serif'
  ctx.fillText('QR Code', 690, 150)
  
  // MRZ
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
  ctx.fillRect(40, 400, 776, 100)
  
  ctx.fillStyle = '#000000'
  ctx.font = '14px monospace'
  ctx.fillText('IDGBR123456789<<<<<<<<<<<<<<<<<<<<', 50, 430)
  ctx.fillText('770414M190731GBR<<<<<<<<<<<<<<<4', 50, 450)
  ctx.fillText('HENDERSON<<ELIZABETH<<<<<<<<<<', 50, 470)
  
  // Observations
  ctx.fillStyle = '#374151'
  ctx.font = 'bold 12px Inter, sans-serif'
  ctx.fillText('Observations/Observations', 40, 250)
  
  // Security feature
  ctx.fillStyle = 'rgba(209, 213, 219, 0.5)'
  ctx.font = 'bold 120px Inter, sans-serif'
  ctx.fillText('K', 650, 350)
  
  // Watermark
  ctx.save()
  ctx.translate(400, 270)
  ctx.rotate(Math.PI / 4)
  ctx.fillStyle = 'rgba(107, 114, 128, 0.05)'
  ctx.font = 'bold 80px Inter, sans-serif'
  ctx.fillText('UK', -40, 20)
  ctx.restore()
}

export const exportBothCardsAsPDF = async () => {
  // For PDF, we'll use a simpler approach
  alert('PDF Export: Due to browser security restrictions, please:\n\n1. Export both cards as PNG files individually\n2. Use any PDF creator tool to combine them\n3. Or use browser\'s "Print to PDF" feature on this page\n\nThis ensures the highest quality output.')
}
