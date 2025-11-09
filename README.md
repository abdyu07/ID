# UK Digital ID Card Editor

A modern web application for creating and customizing UK Digital ID Cards with real-time preview and export functionality.

## 🌟 Features

- **Real-time Preview**: Live preview of both front and back card sides
- **Form Interface**: Intuitive tabbed navigation (Basic Info, Dates, Photo)
- **Photo Upload**: File upload with cropping functionality (4:5 aspect ratio)
- **Security Features**: 
  - Holographic overlays and watermarks
  - QR codes with verification data
  - Microtext patterns
  - Authentic MRZ (Machine Readable Zone) encoding
- **Export Options**: PNG export for individual sides and PDF guidance
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Live Demo

Visit the live application: [https://dull-pigs-grab.lindy.site](https://dull-pigs-grab.lindy.site)

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui with Radix UI primitives
- **Image Processing**: React Image Crop
- **QR Codes**: qrcode library
- **Export**: Canvas-based PNG export with PDF guidance

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/abdyu07/ID.git
cd ID
```

2. Install dependencies:
```bash
npm install
# or
bun install
```

3. Run the development server:
```bash
npm run dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 Usage

1. **Fill Personal Information**: Enter your details in the form tabs
2. **Upload Photo**: Use the Photo tab to upload and crop your image
3. **Preview Cards**: View real-time preview of both card sides
4. **Export**: Use the export buttons to download PNG files

## 📁 Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx           # Main application component
│   └── globals.css        # Global styles
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── card-export.ts    # Export utilities
│   ├── robust-export.ts  # Robust export solution
│   └── ...
├── lib/
│   └── utils.ts          # Utility functions
└── public/               # Static assets
```

## 🔧 Export Functionality

The application includes robust export functionality that works around browser security restrictions:

- **PNG Export**: High-quality canvas-based export for individual card sides
- **PDF Export**: Guidance for combining PNG files or using browser print-to-PDF
- **Fallback Methods**: Multiple export strategies to ensure compatibility

## ⚠️ Important Notes

- This application is for **educational purposes only**
- The design mimics UK ID card aesthetics for demonstration
- Not intended for creating actual identification documents
- Export functionality may vary based on browser security settings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is for educational purposes only. Please ensure compliance with local laws and regulations.

## 🙏 Acknowledgments
- @lumefold designer and enginner
- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Created with Lindy App Builder

---

**Disclaimer**: This application is designed for educational and demonstration purposes only. It should not be used to create actual identification documents.
