"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import jsPDF from "jspdf"

interface ExportPDFButtonProps {
  customerName: string
}

export function ExportPDFButton({ customerName }: ExportPDFButtonProps) {
  const exportToPDF = async () => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      // const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 20
      const contentWidth = pageWidth - margin * 2
      let yPos = margin

      
      const title = `Customer Details - ${customerName}`
      pdf.setFontSize(18)
      pdf.setFont('helvetica', 'bold')
      const titleWidth = pdf.getTextWidth(title)
      pdf.text(title, (pageWidth - titleWidth) / 2, yPos)
      yPos += 15

      const element = document.querySelector('.p-4') as HTMLElement
      if (!element) {
        alert('Could not find content to export.')
        return
      }

      const extractTextContent = (el: HTMLElement): { text: string; style: 'heading' | 'list' | 'normal' }[] => {
        const lines: { text: string; style: 'heading' | 'list' | 'normal' }[] = []

        const processNode = (node: Node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent?.trim()
            if (text) lines.push({ text, style: 'normal' })
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            const tag = (node as HTMLElement).tagName.toLowerCase()

            if (tag.match(/^h[1-6]$/)) {
              const text = (node as HTMLElement).textContent?.trim()
              if (text) lines.push({ text, style: 'heading' })
            } else if (tag === 'li') {
              const text = (node as HTMLElement).textContent?.trim()
              if (text) lines.push({ text: `• ${text}`, style: 'list' })
            } else {
              for (const child of Array.from(node.childNodes)) {
                processNode(child)
              }
              if (tag === 'p' || tag === 'div') {
                lines.push({ text: '', style: 'normal' })
              }
            }
          }
        }

        processNode(el)
        return lines.filter(line => line.text.trim().length > 0 || line.style === 'normal')
      }

      const contentLines = extractTextContent(element)

      for (const line of contentLines) {


        if (line.style === 'heading') {
          pdf.setFont('helvetica', 'bold')
          pdf.setFontSize(14)
          pdf.text(line.text, margin, yPos)
          yPos += 8
        } else if (line.style === 'list') {
          pdf.setFont('helvetica', 'normal')
          pdf.setFontSize(12)
          const wrapped = pdf.splitTextToSize(line.text, contentWidth)
          pdf.text(wrapped, margin, yPos)
          yPos += wrapped.length * 6
        } else {
          pdf.setFont('helvetica', 'normal')
          pdf.setFontSize(12)
          if (line.text === '') {
            yPos += 5 
          } else {
            const wrapped = pdf.splitTextToSize(line.text, contentWidth)
            pdf.text(wrapped, margin, yPos)
            yPos += wrapped.length * 6
          }
        }
      }

      const filename = `customer-${customerName.replace(/\s+/g, '-').toLowerCase()}.pdf`
      pdf.save(filename)

    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF. Please try again.')
    }
  }

  return (
    <Button 
      onClick={exportToPDF}
      variant="outline" 
      size="sm"
      className="flex items-center gap-2"
    >
      <Download className="h-4 w-4" />
      Export as PDF
    </Button>
  )
}
