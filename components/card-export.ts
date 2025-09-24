import domtoimage from 'dom-to-image-more'
import jsPDF from 'jspdf'

export const exportCardToPNG = async (elementId: string, filename: string) => {
  try {
    const element = document.getElementById(elementId)
    if (!element) {
      alert('Card element not found')
      return
    }

    // Use dom-to-image-more to capture the actual styled element
    const dataUrl = await domtoimage.toPng(element, {
      quality: 1.0,
      bgcolor: '#ffffff',
      width: element.offsetWidth * 2,
      height: element.offsetHeight * 2,
      style: {
        transform: 'scale(2)',
        transformOrigin: 'top left',
        width: element.offsetWidth + 'px',
        height: element.offsetHeight + 'px'
      }
    })

    // Create download link
    const link = document.createElement('a')
    link.download = filename
    link.href = dataUrl
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    console.log(`Successfully exported ${filename}`)
  } catch (error) {
    console.error('Export error:', error)
    
    // Fallback to simpler method if dom-to-image fails
    try {
      const element = document.getElementById(elementId)
      if (!element) return
      
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = 800
      canvas.height = 500
      
      // Create a simple fallback export
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      ctx.fillStyle = '#f0f0f0'
      ctx.fillRect(20, 20, canvas.width - 40, canvas.height - 40)
      
      ctx.fillStyle = '#333'
      ctx.font = '24px Inter, sans-serif'
      ctx.fillText('UK Digital ID Card', 40, 80)
      ctx.font = '16px Inter, sans-serif'
      ctx.fillText('Export functionality limited by browser security', 40, 120)
      ctx.fillText('Please use browser screenshot for full quality', 40, 150)
      
      const link = document.createElement('a')
      link.download = filename
      link.href = canvas.toDataURL('image/png')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
    } catch (fallbackError) {
      alert('Export failed due to browser security restrictions. Please use browser screenshot functionality.')
    }
  }
}

export const exportBothCardsToPDF = async () => {
  try {
    const frontElement = document.getElementById('card-front')
    const backElement = document.getElementById('card-back')
    
    if (!frontElement || !backElement) {
      alert('Card elements not found')
      return
    }

    // Capture both cards
    const frontDataUrl = await domtoimage.toPng(frontElement, {
      quality: 1.0,
      bgcolor: '#ffffff',
      width: frontElement.offsetWidth * 2,
      height: frontElement.offsetHeight * 2,
      style: {
        transform: 'scale(2)',
        transformOrigin: 'top left',
        width: frontElement.offsetWidth + 'px',
        height: frontElement.offsetHeight + 'px'
      }
    })

    const backDataUrl = await domtoimage.toPng(backElement, {
      quality: 1.0,
      bgcolor: '#ffffff',
      width: backElement.offsetWidth * 2,
      height: backElement.offsetHeight * 2,
      style: {
        transform: 'scale(2)',
        transformOrigin: 'top left',
        width: backElement.offsetWidth + 'px',
        height: backElement.offsetHeight + 'px'
      }
    })

    // Create PDF
    const pdf = new jsPDF('landscape', 'mm', 'a4')
    
    // Add front side (standard ID card size: 85.6mm x 54mm)
    pdf.addImage(frontDataUrl, 'PNG', 10, 10, 85.6, 54)
    
    // Add back side
    pdf.addImage(backDataUrl, 'PNG', 110, 10, 85.6, 54)
    
    // Add labels
    pdf.setFontSize(10)
    pdf.text('Front', 47, 70)
    pdf.text('Back', 152, 70)
    
    pdf.save('uk-id-card.pdf')
    console.log('Successfully exported PDF')
    
  } catch (error) {
    console.error('PDF export error:', error)
    alert('PDF export failed due to browser security restrictions. Please use individual PNG exports instead.')
  }
}
