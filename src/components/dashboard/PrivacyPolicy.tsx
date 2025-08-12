import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

export function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Privacy Policy</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-foreground font-bold">
            <Shield className="mr-2 h-5 w-5" />
            Privacy & Data Protection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section className="text-muted-foreground">
            <p>
               <h4 className="text-lg font-bold text-foreground mb-3">Swing Boudoir</h4> operates the Cover Girl Competition platform (“Service”), 
              which includes our website, contest entry system, voting platform, and related promotional activities.
            </p>
            <p>
              By using our Service, you agree to the terms of this Privacy Policy. If you do not agree, please do not use our platform.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-foreground mb-3">1. Information We Collect</h3>
            <div className="text-muted-foreground">
              <p><strong>A. Contestant Information</strong></p>
              <ul className="list-disc list-inside">
                <li>Name, contact details, location, and biography.</li>
                <li>Social media handles.</li>
                <li>Photos, videos, and other submitted media.</li>
                <li>Category of entry and any promotional material provided.</li>
              </ul>
              <p className="mt-3"><strong>B. Voter Information</strong></p>
              <ul className="list-disc list-inside">
                <li>Name and email address (for free votes).</li>
                <li>Payment details for paid votes (processed via third-party payment gateways).</li>
                <li>IP address and device information to prevent fraud.</li>
              </ul>
              <p className="mt-3"><strong>C. General Platform Data</strong></p>
              <ul className="list-disc list-inside">
                <li>User activity on our site (pages viewed, time spent).</li>
                <li>Referral source (e.g., via links shared by contestants).</li>
                <li>CRM notes (e.g., interview status, POC assignment).</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-foreground mb-3">2. How We Use Your Information</h3>
            <ul className="list-disc list-inside text-muted-foreground">
              <li>Process contest applications and manage contestant profiles.</li>
              <li>Verify and count votes (both free and paid).</li>
              <li>Communicate with contestants and voters about contest updates.</li>
              <li>Publish contestant names, photos, and rankings on leaderboards.</li>
              <li>Process payments and send receipts.</li>
              <li>Detect and prevent fraudulent or abusive voting.</li>
              <li>Promote the contest across social media, email, and other channels.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-foreground mb-3">3. Sharing of Information</h3>
            <div className="text-muted-foreground">
              <p>We may share your information with:</p>
              <ul className="list-disc list-inside">
                <li>Payment Processors (Stripe, Razorpay, PayPal) for paid votes and purchases.</li>
                <li>CRM & Scheduling Tools (Airtable, Calendly, Fireflies) for contest management.</li>
                <li>Marketing Platforms (Mailchimp, ConvertKit) for sending updates.</li>
                <li>
                  Public Display — Contestant names, photos, videos, vote counts, and rankings 
                  may be displayed on our website and promotional materials.
                </li>
              </ul>
              <p className="mt-2">We do not sell your personal data to third parties.</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-foreground mb-3">4. Data Retention</h3>
            <p className="text-muted-foreground">
              We keep contestant and voting records for as long as necessary to complete the contest, 
              fulfill legal requirements, and maintain historical records for magazine archives. 
              You can request deletion of your personal data after the contest ends, subject to applicable law.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-foreground mb-3">5. Security</h3>
            <p className="text-muted-foreground">
              We implement reasonable security measures to protect your data. However, no online system is 
              100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-foreground mb-3">6. Your Rights</h3>
            <div className="text-muted-foreground">
              <p>Depending on your location, you may have rights to:</p>
              <ul className="list-disc list-inside">
                <li>Access the personal data we hold about you.</li>
                <li>Request correction or deletion of your personal data.</li>
                <li>Withdraw consent for non-essential data processing.</li>
              </ul>
              <p className="mt-2">
                To make a request, contact us at [Your Contact Email].
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-foreground mb-3">7. Minors</h3>
            <p className="text-muted-foreground">
              Our contest is intended for participants aged 18 and above. If we learn that we have collected 
              data from someone under 18 without consent, we will delete it promptly.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-foreground mb-3">8. Changes to This Policy</h3>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. Changes will be posted with the “Last Updated” 
              date at the top. Continued use of our Service means you accept the updated terms.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-foreground mb-3">9. Contact Us</h3>
            <p className="text-muted-foreground">
              If you have questions about this Privacy Policy or our data practices, email us at:
            </p>
            <p className="text-muted-foreground">[Your Contact Email]</p>
            <p className="text-muted-foreground">[Business Address]</p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
