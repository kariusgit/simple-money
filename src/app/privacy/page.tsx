'use client';

import { ChevronLeft, FileText, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PrivacyPolicyPage() {
    const router = useRouter();
    return (
        <div className="pt-4 space-y-5 pb-6 px-4 max-w-lg mx-auto">
            <div className="flex items-center gap-3">
                <button onClick={() => router.back()} className="w-10 h-10 rounded-xl bg-text-primary/5 flex items-center justify-center hover:bg-text-primary/10 transition-colors">
                    <ChevronLeft size={20} className="text-text-primary" />
                </button>
                <h1 className="text-xl font-bold text-text-primary">Privacy Policy</h1>
            </div>

            <div className="glass-card-strong p-6 relative overflow-hidden animate-slide-up">
                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-text-primary/10">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30 shrink-0">
                        <FileText size={24} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-text-primary tracking-tight">Privacy Policy</h2>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-success/20 text-success inline-flex items-center gap-1 mt-1">
                            <ShieldCheck size={10} /> Verified Protocol
                        </span>
                    </div>
                </div>

                <div className="space-y-6 text-sm text-text-secondary leading-relaxed font-medium">
                    <p>
                        Welcome to the <strong className="text-text-primary">Cirqle Promotion Platform</strong> and its Services!
                    </p>
                    <p>
                        To ensure the security of your personal information and the smooth operation of our services, please read these terms carefully. By using this website, you confirm that you are at least 18 years old and agree to these terms. If you do not agree, you may not download, install software, or use our services.
                    </p>

                    <section className="space-y-3">
                        <h3 className="text-primary-light font-bold text-base border-b border-text-primary/10 pb-1">Security & Compliance</h3>
                        <div className="space-y-2">
                            <p>
                                Cirqle adopts Tether Limited’s terms of service and utilizes Tether ETH, BTC, and TRC blockchain technologies to meet international compliance standards. Through decentralized blockchain technology, we ensure transparency, traceability, and world-class security. Every user deposit is protected by a blockchain smart contract. Cirqle and our global partners automatically deposit 50% of the user's funds as collateral. If an order cannot be fulfilled due to platform or global partner issues, the smart contract will release the collateral to compensate the user, ensuring fund security.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h3 className="text-primary-light font-bold text-base border-b border-text-primary/10 pb-1">Reporting Misconduct</h3>
                        <div className="space-y-2">
                            <p>
                                Cirqle strictly prohibits official employees and contractors from performing maintenance outside the platform. Each employee is permitted only one work account; multiple accounts for work are strictly forbidden. If you discover such behavior, please report it via email with images and text description. Verified reports will receive generous rewards.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h3 className="text-primary-light font-bold text-base border-b border-text-primary/10 pb-1">Data Optimization (Promotion)</h3>
                        <div className="space-y-2">
                            <p><strong>1.1)</strong> Before starting a new round of promotion tasks, your account must maintain a minimum balance of 100 USDT.</p>
                            <p><strong>1.2)</strong> To restart promotion tasks, the account balance must also be at least 100 USDT.</p>
                            <p><strong>1.3)</strong> After completing all promotion tasks, you may choose to withdraw your balance or top up your account to reset. Balances may be withdrawn at any time.</p>
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h3 className="text-primary-light font-bold text-base border-b border-text-primary/10 pb-1">Employee Levels</h3>
                        <div className="space-y-2">
                            <p><strong>2.1)</strong></p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>A single deposit of over 500 USDT qualifies for upgrade to Employee Level 2 (via the Concierge Desk).</li>
                                <li>A single deposit of over 1,500 USDT qualifies for Employee Level 3.</li>
                                <li>A single deposit of over 5,000 USDT qualifies for Employee Level 4.</li>
                                <li>A single deposit of 50,000 USDT may apply for Enterprise Partnership.</li>
                            </ul>
                            <p><strong>2.2)</strong> You must complete all promotion tasks before requesting a withdrawal.</p>
                            <p><strong>2.3)</strong> If you choose to abandon or exit the promotion process, you will not be eligible for withdrawals or refunds.</p>
                            <p><strong>2.4)</strong> A formal withdrawal request must be submitted by the user.</p>
                            <p><strong>2.5)</strong> The account credit score must reach 100% to be eligible for withdrawal. If below 100%, it must be restored before funds can be withdrawn.</p>
                            <p><strong>2.6)</strong> All funds must be withdrawn in one single transaction.</p>
                            <p><strong>2.7) Withdrawal limits by recipient level are as follows:</strong></p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li><strong>Level 1 Employee:</strong> 75 – 999 USDT</li>
                                <li><strong>Level 2 Employee:</strong> 1,000 – 4,999 USDT</li>
                                <li><strong>Level 3 Employee:</strong> 5,000 – 10,000 USDT</li>
                                <li><strong>Level 4 Employee:</strong> No limit</li>
                                <li><strong>Enterprise Partner:</strong> No limit</li>
                            </ul>
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h3 className="text-primary-light font-bold text-base border-b border-text-primary/10 pb-1">Fund Management</h3>
                        <div className="space-y-2">
                            <p><strong>3.1)</strong> Funds are securely stored and can be withdrawn upon completion of all promotion tasks.</p>
                            <p><strong>3.2)</strong> All data processing is automated to prevent fund loss.</p>
                            <p><strong>3.3)</strong> The platform is not responsible for losses caused by user error.</p>
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h3 className="text-primary-light font-bold text-base border-b border-text-primary/10 pb-1">Account Security</h3>
                        <div className="space-y-2">
                            <p><strong>4.1)</strong> Do not share your login password or security code with anyone. The platform is not liable for losses resulting from password leaks.</p>
                            <p><strong>4.2)</strong> Avoid using easily guessed information (e.g., birthday, ID number, phone number) as your password.</p>
                            <p><strong>4.3)</strong> If you forget your password or security code, please contact the Concierge Desk.</p>
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h3 className="text-primary-light font-bold text-base border-b border-text-primary/10 pb-1">Regular Promotion</h3>
                        <div className="space-y-2">
                            <p><strong>5.1)</strong> Platform earnings include regular promotion income and bundle order income (6x commission or higher). Each agent/user typically receives 1–3 bundles.</p>
                            <p><strong>5.2)</strong> Level 1 users receive a 0.45% commission per regular promotion plan.</p>
                            <p><strong>5.3)</strong> Level 1 users receive over 2.7% commission per bundle order.</p>
                            <p><strong>5.4)</strong> After completing each promotion plan, funds and earnings will be returned to the user's account.</p>
                            <p><strong>5.5)</strong> Bundles are distributed randomly based on account balance.</p>
                            <p><strong>5.6)</strong> Once assigned, bundles cannot be cancelled or skipped.</p>
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h3 className="text-primary-light font-bold text-base border-b border-text-primary/10 pb-1">Bundles (Surprise Packages)</h3>
                        <div className="space-y-2">
                            <p><strong>6.1)</strong> Bundles contain 2–3 optimization requests, assigned randomly by the system.</p>
                            <p><strong>6.2)</strong> Each bundle yields up to 6x commission.</p>
                            <p><strong>6.3)</strong> Upon completing bundle promotions, funds will be returned to your account.</p>
                            <p><strong>6.4)</strong> Bundle value is distributed according to account balance.</p>
                            <p><strong>6.5)</strong> Once distributed, bundles cannot be cancelled or skipped.</p>
                            <p><strong>6.6)</strong> Bundles offer a higher chance of receiving multiple requests and greater commissions.</p>
                            <p><strong>6.7)</strong> Each bundle may generate 1–2 negative balances, assigned randomly by the system.</p>
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h3 className="text-primary-light font-bold text-base border-b border-text-primary/10 pb-1">Deposits</h3>
                        <div className="space-y-2">
                            <p><strong>7.1)</strong> Users may choose their deposit amount at their own discretion and financial capacity.</p>
                            <p><strong>7.2)</strong> If a bundle requires a deposit, please pre-deposit the displayed difference.</p>
                            <p><strong>7.3)</strong> Contact the online Concierge Desk to confirm deposit details before making a deposit.</p>
                            <p><strong>7.4)</strong> The platform is not responsible for funds sent to incorrect USDT addresses.</p>
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h3 className="text-primary-light font-bold text-base border-b border-text-primary/10 pb-1">Collaboration with Global Partners</h3>
                        <div className="space-y-2">
                            <p><strong>8.1)</strong> Complete promotion tasks on time to avoid affecting our global partner's reputation or causing withdrawal delays.</p>
                            <p><strong>8.2)</strong> Partners will provide the deposit details.</p>
                            <p><strong>8.3)</strong> Delays in promotion may affect the partner’s process.</p>
                            <p><strong>8.4)</strong> Once the order is submitted, the prepayment must be returned to the partner.</p>
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h3 className="text-primary-light font-bold text-base border-b border-text-primary/10 pb-1">Agent/User Responsibilities</h3>
                        <div className="space-y-2">
                            <p><strong>9.1)</strong> Tasks must be completed within 24 hours, or the account will be frozen and an unfreezing fee will apply.</p>
                            <p><strong>9.2)</strong> Users must complete two promotion tasks daily to receive a base salary every two days.</p>
                            <p><strong>9.3)</strong> Understand the platform rules and choose your deposit amount according to your finances. Complete bundle promotions within 24 hours to maintain reputation.</p>
                            <p><strong>9.4)</strong> Prolonged inactivity may lower your credit score below 100, affecting your withdrawal eligibility. You must restore your score to 100 before withdrawing full funds.</p>
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h3 className="text-primary-light font-bold text-base border-b border-text-primary/10 pb-1">Invitation Rewards</h3>
                        <div className="space-y-2">
                            <p><strong>10.1)</strong> Upon reaching Level 4, you will receive invitation privileges and may use your code to invite others.</p>
                            <p><strong>10.2)</strong> Referrers earn 20% commission on the referred user's order earnings (not including deposit commissions).</p>
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h3 className="text-primary-light font-bold text-base border-b border-text-primary/10 pb-1">Taxation</h3>
                        <div className="space-y-2">
                            <p><strong>11.1)</strong> When your account funds exceed the tax threshold (over $10,000 USD), you must comply with U.S. tax laws. Monitor your account balance and fulfill tax obligations.</p>
                            <p><strong>11.2)</strong> The company will reimburse taxes you pay. Within 48 hours of tax refund, you must provide a detailed home address to obtain a tax certificate for submission to your local tax bureau.</p>
                            
                            <p className="p-3 bg-danger/10 border border-danger/20 rounded-lg text-danger mt-2">
                                <strong className="font-bold flex items-center gap-1"><ShieldCheck size={14}/> 11.3) Special Reminder:</strong> Crypto taxation differs from fiat currency taxation. Funds not taxed in accordance with platform requirements may be considered illegal and non-circulable. The company ensures compliance to avoid such issues.
                            </p>
                        </div>
                    </section>

                    <div className="pt-6 mt-6 border-t border-text-primary/10 text-center font-bold text-primary-light">
                        Thank you for using Cirqle. Following the above terms will ensure a secure and efficient experience on our platform. If you have any questions or need assistance, please contact our Concierge Desk.
                        <div className="text-xs text-text-secondary mt-2 opacity-50">© Cirqle All Rights Reserved</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
