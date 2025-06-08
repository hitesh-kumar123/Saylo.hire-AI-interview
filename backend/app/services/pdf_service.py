from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
import os
from app.config import Config

class PDFService:
    def generate_cheatsheet_pdf(self, content, user_id, filename="cheatsheet.pdf"):
        """Generate a PDF cheatsheet from the provided content."""
        # Create directory for user's PDFs if it doesn't exist
        pdf_dir = os.path.join(Config.GENERATED_PDFS_FOLDER, str(user_id))
        os.makedirs(pdf_dir, exist_ok=True)
        filepath = os.path.join(pdf_dir, filename)
        
        # Create the PDF document
        doc = SimpleDocTemplate(filepath, pagesize=letter)
        styles = getSampleStyleSheet()
        
        # Add custom styles
        styles.add(ParagraphStyle(
            name='Title',
            parent=styles['Heading1'],
            fontSize=18,
            spaceAfter=12,
            textColor=colors.darkblue
        ))
        
        styles.add(ParagraphStyle(
            name='Heading2',
            parent=styles['Heading2'],
            fontSize=14,
            spaceAfter=8,
            textColor=colors.darkblue
        ))
        
        styles.add(ParagraphStyle(
            name='BulletPoint',
            parent=styles['Normal'],
            leftIndent=20,
            spaceBefore=2,
            spaceAfter=2
        ))
        
        # Build the PDF content
        story = []
        
        # Add title
        story.append(Paragraph("Interview Cheatsheet", styles['Title']))
        story.append(Spacer(1, 0.2 * inch))
        
        # Process content by lines
        lines = content.split('\n')
        current_style = styles['Normal']
        
        for line in lines:
            line = line.strip()
            if not line:
                story.append(Spacer(1, 0.1 * inch))
                continue
                
            # Detect headings and format accordingly
            if line.startswith('# '):
                line = line[2:].strip()
                current_style = styles['Title']
            elif line.startswith('## '):
                line = line[3:].strip()
                current_style = styles['Heading2']
            elif line.startswith('* ') or line.startswith('- '):
                line = '• ' + line[2:].strip()  # Replace with bullet point
                current_style = styles['BulletPoint']
            else:
                current_style = styles['Normal']
            
            story.append(Paragraph(line, current_style))
            
            # Add a small space after paragraphs
            if current_style == styles['Normal']:
                story.append(Spacer(1, 0.05 * inch))
        
        # Build the PDF
        doc.build(story)
        return filepath 