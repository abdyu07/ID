import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export const exportElementToPNG = async (element: HTMLDivElement | null, filename: string) => {
  if (!element) {
    console.error('Element not found for export')
    return
  }
  
  try {
    // Create a temporary container to avoid CSP issues
    const tempContainer = document.createElement('div')
    tempContainer.style.position = 'absolute'
    tempContainer.style.left = '-9999px'
    tempContainer.style.top = '-9999px'
    tempContainer.style.width = element.offsetWidth + 'px'
    tempContainer.style.height = element.offsetHeight + 'px'
    
    // Clone the element
    const clonedElement = element.cloneNode(true) as HTMLDivElement
    tempContainer.appendChild(clonedElement)
    document.body.appendChild(tempContainer)
    
    const canvas = await html2canvas(clonedElement, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
      allowTaint: true,
      foreignObjectRendering: false,
      logging: false
    })
    
    // Clean up
    document.body.removeChild(tempContainer)
    
    // Create download link
    const link = document.createElement('a')
    link.download = filename
    link.href = canvas.toDataURL('image/png', 1.0)
    
    // Trigger download
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    console.log(`Successfully exported ${filename}`)
  } catch (error) {
    console.error('Error exporting PNG:', error)
    alert('Export failed. Please try again.')
  }
}

export const exportBothSidesToPDF = async (
  frontElement: HTMLDivElement | null, 
  backElement: HTMLDivElement | null
) => {
  if (!frontElement || !backElement) {
    console.error('Elements not found for PDF export')
    return
  }
  
  try {
    // Export front side
    const frontCanvas = await html2canvas(frontElement, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
      allowTaint: true,
      foreignObjectRendering: false,
      logging: false
    })
    
    // Export back side
    const backCanvas = await html2canvas(backElement, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
      allowTaint: true,
      foreignObjectRendering: false,
      logging: false
    })
    
    // Create PDF
    const pdf = new jsPDF('landscape', 'mm', 'a4')
    
    // Calculate dimensions to fit ID card size (85.6mm x 54mm)
    const cardWidth = 85.6
    const cardHeight = 54
    
    // Add front side
    pdf.addImage(
      frontCanvas.toDataURL('image/png', 1.0), 
      'PNG', 
      10, 
      10, 
      cardWidth, 
      cardHeight
    )
    
    // Add back side
    pdf.addImage(
      backCanvas.toDataURL('image/png', 1.0), 
      'PNG', 
      110, 
      10, 
      cardWidth, 
      cardHeight
    )
    
    // Save PDF
    pdf.save('uk-id-card.pdf')
    
    console.log('Successfully exported PDF')
  } catch (error) {
    console.error('Error exporting PDF:', error)
    alert('PDF export failed. Please try again.')
  }
}
