import { FileText } from 'lucide-react';

const TermsPage = () => {
    return (
        <div className="legal-page">
            <div className="container">
                <div className="legal-hero">
                    <div className="legal-hero-icon">
                        <FileText size={32} />
                    </div>
                    <h1>Terms of Service</h1>
                    <p className="legal-hero-subtitle">Please read these terms carefully before using La'verse.</p>
                    <p className="legal-updated">Last updated: March 5, 2026</p>
                </div>

                <div className="legal-content">
                    <section>
                        <h2>1. Acceptance of Terms</h2>
                        <p>By accessing or using La'verse ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Platform.</p>
                    </section>

                    <section>
                        <h2>2. Account Registration</h2>
                        <ul>
                            <li>You must provide a valid email address to create an account</li>
                            <li>You are responsible for maintaining the security of your account</li>
                            <li>You must be at least 13 years old to use the Platform</li>
                            <li>One person may not maintain more than one account</li>
                        </ul>
                    </section>

                    <section>
                        <h2>3. User Content</h2>
                        <h3>Ownership</h3>
                        <p>You retain full ownership of all content you create and publish on La'verse. By publishing content, you grant La'verse a non-exclusive, worldwide license to display, distribute, and promote your content on the Platform.</p>

                        <h3>Content Standards</h3>
                        <p>You agree that your content will not:</p>
                        <ul>
                            <li>Contain hate speech, harassment, or threats of violence</li>
                            <li>Infringe on intellectual property rights of others</li>
                            <li>Contain spam, malware, or deceptive content</li>
                            <li>Include pornographic or sexually explicit material</li>
                            <li>Promote illegal activities or substances</li>
                            <li>Impersonate other individuals or organizations</li>
                        </ul>

                        <h3>Content Removal</h3>
                        <p>We reserve the right to remove any content that violates these terms. You may delete your own content at any time through the Dashboard.</p>
                    </section>

                    <section>
                        <h2>4. Acceptable Use</h2>
                        <p>When using La'verse, you agree not to:</p>
                        <ul>
                            <li>Attempt to gain unauthorized access to other accounts or systems</li>
                            <li>Use automated scripts or bots to scrape content or create accounts</li>
                            <li>Interfere with or disrupt the Platform's infrastructure</li>
                            <li>Use the Platform for any illegal purpose</li>
                            <li>Collect personal information of other users without consent</li>
                        </ul>
                    </section>

                    <section>
                        <h2>5. Intellectual Property</h2>
                        <p>The La'verse name, logo, and all related branding are the property of La'verse. The Platform's design, code, and features are protected by intellectual property laws. You may not copy, modify, or distribute the Platform's proprietary elements.</p>
                    </section>

                    <section>
                        <h2>6. Disclaimer of Warranties</h2>
                        <p>La'verse is provided "as is" without warranties of any kind. We do not guarantee that the Platform will be available at all times, error-free, or secure. We are not responsible for any loss of data or content.</p>
                    </section>

                    <section>
                        <h2>7. Limitation of Liability</h2>
                        <p>To the fullest extent permitted by law, La'verse shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of the Platform.</p>
                    </section>

                    <section>
                        <h2>8. Account Termination</h2>
                        <p>We may suspend or terminate your account if you violate these terms. You may also delete your account at any time. Upon termination, your published content may be removed from the Platform.</p>
                    </section>

                    <section>
                        <h2>9. Changes to Terms</h2>
                        <p>We reserve the right to modify these terms at any time. Changes will be posted on this page with an updated date. Continued use of the Platform after changes constitutes acceptance of the revised terms.</p>
                    </section>

                    <section>
                        <h2>10. Governing Law</h2>
                        <p>These terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles.</p>
                    </section>

                    <section>
                        <h2>11. Contact</h2>
                        <p>For questions about these Terms of Service, please contact us at <strong>contact@laverse.app</strong>.</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TermsPage;
