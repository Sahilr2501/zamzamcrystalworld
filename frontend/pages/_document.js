import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <meta charSet="UTF-8" />
                <meta name="description" content="Zamzam Crystal World — authentic healing crystals and stones for wellness, meditation, and positive energy" />
                <meta name="keywords" content="crystals, healing stones, crystal shop, zamzam crystal world, authentic crystals, meditation stones" />
                <meta name="author" content="Zamzam Crystal World" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />

                {/* Open Graph / Social Media Meta Tags */}
                <meta property="og:title" content="Zamzam Crystal World | Authentic Healing Crystals" />
                <meta property="og:description" content="Discover authentic healing crystals and stones crafted for wellness, meditation, and positive energy." />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="Zamzam Crystal World" />

                {/* Theme Color */}
                <meta name="theme-color" content="#306D29" />

                {/* Favicon */}
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

                {/* Fonts */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet" />

                {/* Custom Styles for Document */}
                <style dangerouslySetInnerHTML={{
                    __html: `
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: #FBF5DD;
              color: #306D29;
              line-height: 1.5;
            }
            
            h1, h2, h3, h4, h5, h6 {
              font-family: 'Playfair Display', Georgia, serif;
              color: #0D530E;
            }
            
            ::selection {
              background: #306D29;
              color: #FBF5DD;
            }
            
            ::-webkit-scrollbar {
              width: 10px;
              height: 10px;
            }
            
            ::-webkit-scrollbar-track {
              background: #E7E1B1;
              border-radius: 10px;
            }
            
            ::-webkit-scrollbar-thumb {
              background: #306D29;
              border-radius: 10px;
            }
            
            ::-webkit-scrollbar-thumb:hover {
              background: #0D530E;
            }
          `
                }} />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}