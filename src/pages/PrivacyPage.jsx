import { Shield } from 'lucide-react';

const PrivacyPage = () => {
    return (
        <div className="legal-page">
            <div className="container">
                <div className="legal-hero">
                    <div className="legal-hero-icon">
                        <Shield size={32} />
                    </div>
                    <h1>Privacy Policy</h1>
                    <p className="legal-hero-subtitle">Your privacy matters to us. Here's how we handle your data.</p>
                    <p className="legal-updated">Last updated: March 5, 2026</p>
                </div>

                <div className="legal-content">
                    <section>
                        <h2>1. Information We Collect</h2>
                        <h3>Account Information</h3>
                        <p>When you create an account, we collect your email address and any profile information you choose to provide, such as your name, username, bio, and avatar image.</p>

                        <h3>Content You Create</h3>
                        <p>We store the blog posts, comments, bookmarks, reactions, and other content you create on the platform. This content is necessary to provide our services.</p>

                        <h3>Usage Data</h3>
                        <p>We collect basic analytics such as page views and read counts to help authors understand their audience. We do not track you across the web or sell your data to advertisers.</p>
                    </section>

                    <section>
                        <h2>2. How We Use Your Information</h2>
                        <ul>
                            <li>To provide, maintain, and improve our platform</li>
                            <li>To display your published content to other users</li>
                            <li>To send you important account-related notifications</li>
                            <li>To show reading statistics to content authors</li>
                            <li>To enforce our Terms of Service and prevent abuse</li>
                        </ul>
                    </section>

                    <section>
                        <h2>3. Data Sharing</h2>
                        <p>We do <strong>not</strong> sell, rent, or share your personal information with third parties for marketing purposes. Your data may only be shared in the following cases:</p>
                        <ul>
                            <li><strong>Public Content:</strong> Blog posts, comments, and profile information you choose to make public are visible to all users</li>
                            <li><strong>Service Providers:</strong> We use Supabase for authentication and data storage. Their privacy practices apply to the infrastructure layer</li>
                            <li><strong>Legal Requirements:</strong> If required by law or to protect our rights and safety</li>
                        </ul>
                    </section>

                    <section>
                        <h2>4. Data Storage & Security</h2>
                        <p>Your data is securely stored using Supabase, which provides enterprise-grade security including encryption at rest and in transit, row-level security policies, and regular backups.</p>
                    </section>

                    <section>
                        <h2>5. Cookies & Local Storage</h2>
                        <p>We use browser local storage for your dark mode preference, reading history, and newsletter subscription status. We do not use third-party tracking cookies.</p>
                    </section>

                    <section>
                        <h2>6. Your Rights</h2>
                        <p>You have the right to:</p>
                        <ul>
                            <li>Access and download your personal data</li>
                            <li>Update or correct your profile information</li>
                            <li>Delete your account and all associated data</li>
                            <li>Opt out of non-essential communications</li>
                        </ul>
                    </section>

                    <section>
                        <h2>7. Children's Privacy</h2>
                        <p>La'verse is not intended for children under 13. We do not knowingly collect personal information from children under 13 years of age.</p>
                    </section>

                    <section>
                        <h2>8. Changes to This Policy</h2>
                        <p>We may update this privacy policy from time to time. We will notify users of significant changes through the platform. Continued use of La'verse after changes constitutes acceptance.</p>
                    </section>

                    <section>
                        <h2>9. Contact Us</h2>
                        <p>If you have questions about this privacy policy or your data, please reach out to us at <strong>contact@laverse.app</strong>.</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPage;
