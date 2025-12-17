# Customer 360 Frontend - React + Vite + Tailwind + shadcn/ui

Modern Digital Banking Profile UI untuk Customer 360.

## 🎨 Features

- ✨ **Modern Banking Design**: Clean, professional banking interface
- 🎯 **Customer 360 View**: Complete customer profile in single page
- 📱 **Responsive**: Mobile-first design
- 🎭 **Tabs Navigation**: Organized data with tabs
- 🌈 **Gradient Cards**: Beautiful card designs
- ⚡ **Fast**: Built with Vite
- 🎨 **Tailwind CSS 3**: Utility-first CSS
- 🧩 **shadcn/ui**: High-quality React components

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Backend API running on port 8080

### Installation

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Server akan running di `http://localhost:5173`

## 📦 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── ui/           # shadcn/ui components
│   │       ├── card.jsx
│   │       ├── button.jsx
│   │       ├── badge.jsx
│   │       ├── input.jsx
│   │       └── tabs.jsx
│   ├── lib/
│   │   └── utils.js      # Utility functions
│   ├── App.jsx           # Main application
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🎯 Main Components

### App.jsx
Main application dengan:
- Search bar untuk customer IDs
- Customer selection pills
- Customer 360 profile tabs

### CustomerProfile Component
Menampilkan:
- **Personal**: Personal info & demographics
- **Accounts**: List rekening dengan balance
- **Products**: Deposits, loans, cards, investments
- **Analytics**: Segmentation & behavioral data
- **Contact**: Contact info & communication preferences
- **Behavior**: Channel usage & transaction patterns

## 🎨 Design System

### Colors
- **Primary**: Blue gradient (#667eea to #764ba2)
- **Success**: Blue-green gradient
- **Card**: Pink-red gradient
- **Warning**: Orange-yellow gradient

### Components
- **Card**: Rounded corners, shadow, gradient backgrounds
- **Button**: Primary, secondary, outline variants
- **Badge**: Status indicators dengan warna
- **Tabs**: Organized navigation
- **Input**: Search & form inputs

## 📡 API Integration

Frontend berkomunikasi dengan backend di `http://localhost:8080`

### POST /api/v1/customers
```javascript
const response = await axios.post('http://localhost:8080/api/v1/customers', {
  customer_id: ['CUST0000001', 'CUST0000002']
})
```

### Response Structure
```javascript
{
  success: true,
  count: 2,
  data: [
    {
      customer_id: "CUST0000001",
      customer: {...},
      address: {...},
      contact: {...},
      accounts: [...],
      deposits: [...],
      loans: [...],
      cards: [...],
      investments: [...],
      segment: {...},
      behavior: {...},
      preference: {...}
    }
  ]
}
```

## 🛠️ Utility Functions

### formatCurrency(amount)
Format rupiah: `Rp 50.000.000`

### formatDate(dateString)
Format tanggal: `15 Januari 2024`

### formatNumber(num)
Format angka: `10.000`

### getSegmentBadgeColor(segment)
Warna badge untuk segment

### getProductStatusColor(status)
Warna status untuk produk

## 🎨 Custom Styles

### Banking Gradient
```css
.banking-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Card Gradient
```css
.card-gradient {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}
```

### Glass Effect
```css
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}
```

## 📱 Responsive Design

- **Mobile**: Single column, stacked cards
- **Tablet**: 2 columns grid
- **Desktop**: Full width, 4 columns for stats

## 🧪 Testing

### Manual Testing
1. Start backend: `cd backend && go run main.go`
2. Start frontend: `cd frontend && npm run dev`
3. Open browser: `http://localhost:5173`
4. Search: `CUST0000001,CUST0000002`

### Test Customer IDs
```
CUST0000001
CUST0000002
CUST0000003
CUST0000010
CUST0000100
```

## 🏗️ Build for Production

```bash
# Build
npm run build

# Preview production build
npm run preview
```

Output di folder `dist/`

## 🐳 Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:
```bash
docker build -t customer360-frontend .
docker run -p 80:80 customer360-frontend
```

## 🎯 Features Detail

### Search
- Multi-customer search (comma separated)
- Real-time validation
- Error handling
- Loading states

### Customer Profile Tabs
1. **Personal**: Demographics, personal info, address
2. **Accounts**: All bank accounts dengan balance
3. **Products**: Deposits, loans, cards, investments
4. **Analytics**: Segmentation, product ownership, engagement
5. **Contact**: Phone, email, preferences, consents
6. **Behavior**: Channel usage, transaction patterns

### Visual Indicators
- **Status Badges**: Active, inactive, blocked
- **Segment Badges**: Mass, Mass Affluent, Affluent, HNW
- **Progress Indicators**: Loading spinner
- **Empty States**: User-friendly empty messages

### Cards Design
- **Account Cards**: Balance highlight, type indicator
- **Loan Cards**: Outstanding, payment info
- **Credit Cards**: Card-like design dengan gradients
- **Investment Cards**: Return percentage dengan color coding

## 🔧 Configuration

### API Endpoint
Edit di `src/App.jsx`:
```javascript
const response = await axios.post('http://localhost:8080/api/v1/customers', ...)
```

### Proxy (Optional)
Edit `vite.config.js`:
```javascript
server: {
  proxy: {
    '/api': 'http://localhost:8080'
  }
}
```

## 🎨 Customization

### Colors
Edit `tailwind.config.js` untuk custom colors

### Components
Add new components di `src/components/ui/`

### Styling
Edit `src/index.css` untuk global styles

## 📝 Dependencies

### Core
- `react` - UI library
- `react-dom` - React DOM rendering
- `vite` - Build tool
- `tailwindcss` - CSS framework

### UI Components
- `@radix-ui/react-*` - Unstyled components
- `lucide-react` - Icons
- `class-variance-authority` - Variant management
- `tailwind-merge` - Class merging

### Utils
- `axios` - HTTP client
- `clsx` - Class utility

## 🚀 Performance Tips

1. **Code Splitting**: Vite automatically splits code
2. **Lazy Loading**: Use React.lazy for heavy components
3. **Image Optimization**: Use WebP format
4. **Bundle Analysis**: `npm run build -- --analyze`

## 🐛 Common Issues

### Port 5173 in use
Change port di `vite.config.js`:
```javascript
server: { port: 3000 }
```

### API Connection Failed
- Pastikan backend running di port 8080
- Check CORS configuration
- Verify network connectivity

### Styling Issues
```bash
# Rebuild Tailwind
npm run dev
```

## 📚 Learn More

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)

## 🎯 Next Steps

- [ ] Add authentication
- [ ] Implement real-time updates
- [ ] Add export functionality
- [ ] Implement print feature
- [ ] Add charts/graphs
- [ ] Mobile app version
- [ ] Dark mode toggle
- [ ] Multi-language support
