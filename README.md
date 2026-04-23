# PayPal Integration Tools Suite

A comprehensive React-based toolkit for PayPal developers and merchants, providing essential utilities for credential management, file comparison, and API integration testing.

## 🚀 Features

### 🔐 Credential Comparison Tool ("No Scope")

- **Multi-Account Analysis**: Compare PayPal credentials across multiple sandbox and live environments
- **Scope Visualization**: Detailed breakdown of available scopes and their corresponding integrations
- **Real-time Token Generation**: Generate and validate access tokens with comprehensive error handling
- **Integration Mapping**: Visual representation of which PayPal features are available per account
- **Export Capabilities**: Export comparison reports in JSON and readable text formats
- **Sample Credentials**: Pre-loaded test credentials for quick demonstration

### 📄 File Comparison Tool

- **Domain Association Validation**: Compare Apple Pay domain association files against PayPal standards
- **Multi-Platform Support**: Support for PayPal Sandbox, Live, and Braintree environments
- **Multiple Input Methods**: File upload, direct text input, or URL fetching
- **Visual Diff Display**: Side-by-side comparison with highlighted differences
- **Smart Matching**: Automatic detection of payment processor based on file content
- **Real-time Validation**: Instant feedback on file compatibility

## 🛠️ Tech Stack

- **Frontend**: React 18, Material-UI, Tailwind CSS
- **Icons**: Lucide React, Material-UI Icons
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **File Processing**: diff library for text comparison
- **Build Tool**: Create React App

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/TariqH19/PP.git
   cd PP
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm start
   ```

4. **Open your browser**
   For file comparison navigate to `http://localhost:3000/file-compare`
   For scope comparison navigate to `http://localhost:3000/noscope`

## 🎯 Usage

### Credential Comparison Tool

1. Navigate to the credential comparison page
2. Add your PayPal Client ID and Client Secret for each account
3. Select environment (Sandbox/Live)
4. Generate access tokens
5. View detailed scope and integration comparison
6. Export results for documentation

### File Comparison Tool

1. Navigate to the file comparison page
2. Select comparison type (PayPal Sandbox, Live, or Braintree)
3. Input your file via upload, text paste, or URL
4. View detailed comparison results
5. Verify compatibility with PayPal standards

## 🔧 Configuration

### CORS Configuration

For URL fetching functionality, install the recommended CORS browser extension:
[Allow CORS Extension](https://chromewebstore.google.com/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf?hl=en)

### Environment Variables

Create a `.env` file in the root directory for any environment-specific configurations:

```env
REACT_APP_API_BASE_URL=your_api_base_url
```

### Supabase (optional)

If you want to use Supabase for remote persistence, install the client and set credentials:

```bash
npm install @supabase/supabase-js
```

Create a `.env.local` (not committed) with:

```env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_KEY=your_anon_or_service_key
REACT_APP_PIN=2580
```

The repo includes `.env.example` as a template.

## 📋 Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from Create React App (one-way operation)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential.

## 🐛 Known Issues

- URL fetching requires CORS extension due to browser security policies
- Demo tokens are provided when CORS errors occur for testing purposes
