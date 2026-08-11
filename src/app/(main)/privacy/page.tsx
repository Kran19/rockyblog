export const metadata = {
  title: 'Privacy Policy | Stock247',
  description: 'Privacy Policy and Terms for Stock247 (stock-247.com)',
  alternates: {
    canonical: '/privacy',
  },
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-24">
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-4 text-white">Privacy Policy for Stock247</h1>
          <p className="text-muted-foreground">Effective Date: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>1. Introduction</h2>
          <p>
            Welcome to Stock247 ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website (stock-247.com) and use our platform. 
          </p>
          <p>
            By accessing or using our website, you agree to the terms outlined in this Privacy Policy.
          </p>

          <h2>2. Information We Collect</h2>
          <p>
            We aim to collect only the essential information needed to provide you with our services. The information we collect includes:
          </p>
          <ul>
            <li><strong>Account Information:</strong> When you register, we collect your Stock247 account credentials.</li>
            <li><strong>Usage & Telemetry Data:</strong> We automatically collect telemetry information about your device and how you interact with our platform (e.g., IP address, GeoIP headers, browser type, screen resolution, referral path).</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <p>
            We use the information we collect for the following purposes:
          </p>
          <ul>
            <li>To create and manage your Stock247 account.</li>
            <li>To process your activities and market signal interactions.</li>
            <li>To analyze website traffic, UTM campaign effectiveness, and improve our services.</li>
            <li>To deliver personalized market content and targeted callouts.</li>
          </ul>

          <h2>4. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and similar tracking technologies to monitor activity on our website and store session telemetry.
          </p>

          <h2>5. Age Restrictions & Policy</h2>
          <p>
            <strong>Strict 18+ Policy:</strong> Our platform is intended for users who are at least 18 years of age (or legal age in your jurisdiction).
          </p>

          <h2>6. Third-Party Links & External Websites</h2>
          <p>
            Our website may contain links to third-party financial tools or partner gaming portals. We assume no responsibility for third-party content or policies.
          </p>

          <h2>7. Contact Us</h2>
          <p>
            If you have any questions regarding this Privacy Policy, contact us at: <strong>support@stock-247.com</strong>.
          </p>
        </div>
      </div>
    </div>
  )
}

