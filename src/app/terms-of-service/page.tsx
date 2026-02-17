import Link from 'next/link';

export const metadata = {
    title: 'Terms of Service | NanoSchool',
    description: 'Terms and Conditions for browsing and using the NanoSchool website.',
};

export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-slate-900 text-white py-20 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Terms of Service</h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        Please read these terms carefully before using our services.
                    </p>
                    <div className="mt-8 text-sm text-slate-500 uppercase tracking-widest font-semibold">
                        Last Updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-10 mb-20">
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-slate-100">
                    <div className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-a:text-blue-600">

                        <p className="lead text-xl text-slate-700 mb-10 border-l-4 border-blue-500 pl-4 italic">
                            This Website User Agreement and the Privacy Policy lays out the terms and conditions and rules, as maybe amended and supplemented, from time to time (hereinafter referred to as the “Agreement”) which shall be applicable to the access and use of the website of <strong>NanoSchool</strong> (owned and managed by IT BREAK COM PRIVATE LIMITED), the visitor/ user (“User”) of the Website.
                        </p>

                        <section className="mb-12">
                            <h2 className="text-2xl mb-4 flex items-center group">
                                <span className="bg-slate-100 text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-colors w-10 h-10 rounded-lg flex items-center justify-center text-lg mr-4 font-bold">1</span>
                                Acceptance of Terms and Modification Thereof
                            </h2>
                            <div className="pl-14 space-y-4">
                                <p>
                                    <strong>1.1</strong> Access of the Website by the User constitutes an acknowledgement and acceptance in full, of all the terms, conditions and notices as stated in this Agreement and without any modification and/or exception by the User of this Agreement. If the User does not agree with any part of such terms, conditions and notices as stated in this Agreement in any manner, the User must not access the Website.
                                </p>
                                <p>
                                    <strong>1.2</strong> Company reserves the right to change the terms, conditions and notices pursuant to which the Website is accessed by the User, without any notice or intimation of such change.
                                </p>
                            </div>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-2xl mb-4 flex items-center group">
                                <span className="bg-slate-100 text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-colors w-10 h-10 rounded-lg flex items-center justify-center text-lg mr-4 font-bold">2</span>
                                Limited User
                            </h2>
                            <div className="pl-14 space-y-4">
                                <p>
                                    <strong>2.1</strong> The User agrees that given the nature of the Internet, even though the Website is targeted to Indian Residents only, it may be accessed in other parts of the world. The material/information on this Website is not intended for use by persons located in, or residents in countries that restrict the distribution of such material/information or by any person in any jurisdiction where distribution or use of such material/information or usage or access of Website will be contrary to law or any regulation. It shall be the responsibility of every User to be aware of and fully observe the applicable laws and regulations of the jurisdiction which User is subject of. If the User is not an Indian resident and yet uses this Website, he acknowledges, understands and agrees that he is doing so on his own initiative and at his own risk and Company shall not be liable for violation/breach of any of the laws applicable to usage of the Website. The Website is not to be and should not be construed as purporting to offer or inviting to offer any information to residents of countries where Company is not licensed or authorized to perform activities related to its objective.
                                </p>
                                <p>
                                    <strong>2.2</strong> The User further agrees and undertakes not to reverse engineer, modify, copy, distribute, transmit, display, perform, reproduce, publish, license, create derivative works from, transfer, or sell any information, software, products, services or intellectual property obtained from the Website in any manner whatsoever. Reproduction, copying of the content for commercial or non-commercial purposes and unwarranted modification of data and information within the content of the Website is strictly not permitted without prior written consent from Company and/or third party owners. However, some of the content of our services or other files may be made available for download from the website which is permitted to be copied and/or used only for personal purposes of the User. The User and/or any third party is prohibited from running or displaying this Website and /or information displayed on this Website on any other Website or frames , without prior written consent from Company.
                                </p>
                            </div>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-2xl mb-4 flex items-center group">
                                <span className="bg-slate-100 text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-colors w-10 h-10 rounded-lg flex items-center justify-center text-lg mr-4 font-bold">3</span>
                                Disclaimer of Warranties
                            </h2>
                            <div className="pl-14 space-y-4">
                                <p>
                                    <strong>3.1</strong> Company has endeavored to ensure that all the information provided by it on this Website is correct, but it neither warrants nor makes any representations regarding the quality, accuracy or completeness of any data or information displayed on this Website and Company shall not be, in any manner liable for inaccuracy/error if any. Company makes no warranty, express or implied, concerning the Website and/or its contents and disclaims all warranties of fitness for a particular purpose and warranties of merchantability in respect of information displayed and communicated through or on the Website, including any liability, responsibility or any other claim, whatsoever, in respect of any loss, whether direct or consequential, to any User or any other person, arising out of or from the use of any such information as is displayed or communicated through or on the Website or the provision of the Services.
                                </p>
                                <p>
                                    <strong>3.2</strong> Company shall not be held responsible for non‐availability of the Website at any point in time for any reason whatsoever. The User understands and agrees that any material and/or data downloaded or otherwise obtained from Company through the Website is done entirely at his discretion and risk and he will be solely responsible for any damage to his computer systems or any other loss that results from such material and/or data.
                                </p>
                            </div>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-2xl mb-4 flex items-center group">
                                <span className="bg-slate-100 text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-colors w-10 h-10 rounded-lg flex items-center justify-center text-lg mr-4 font-bold">4</span>
                                Links to Third Party Sites
                            </h2>
                            <div className="pl-14 space-y-4">
                                <p>
                                    <strong>4.1</strong> The Website may contain links to other websites or may contain features of any nature of other websites on the Website (“Linked Sites”). The Linked Sites are not under the control of Company or the Website and Company is not responsible for the contents of any Linked Site, including without limitation any link or advertisement contained in a Linked Site, or any changes or updates to a Linked Site. Company is not responsible for any form of transmission, whatsoever, received by the User from any Linked Site. The inclusion of any link does not imply endorsement of any nature by Company or the Website of the Linked Sites or any association with its operators or owners.
                                </p>
                                <p>
                                    <strong>4.2</strong> Company will be making calls and sending SMS through a third-party platform after The User’s registration in order to provide our service. The User’s registration means acceptance of the service.
                                </p>
                                <p>
                                    <strong>4.3</strong> Company is not responsible for any errors, inclusions, omissions or representations on any Linked Site, or on any link contained in a Linked Site. The User is requested to verify the accuracy of all information on his own before undertaking any reliance on such information of such products/ services that they believe may benefit the User.
                                </p>
                            </div>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-2xl mb-4 flex items-center group">
                                <span className="bg-slate-100 text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-colors w-10 h-10 rounded-lg flex items-center justify-center text-lg mr-4 font-bold">5</span>
                                User's Obligations
                            </h2>
                            <div className="pl-14 space-y-4">
                                <p>
                                    <strong>5.1</strong> As a condition of access and use of the Website, the User warrants that he will not use the Website for any purpose that is unlawful or illegal under any law for the time being in force within or outside India or prohibited by this Agreement. In addition, the Website shall not be used in any manner, which could damage, disable, overburden or impair it or interfere with any other party’s use and/or enjoyment of the Website or infringe any intellectual property rights of Company or any third party.
                                </p>
                            </div>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-2xl mb-4 flex items-center group">
                                <span className="bg-slate-100 text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-colors w-10 h-10 rounded-lg flex items-center justify-center text-lg mr-4 font-bold">6</span>
                                Contact Us Feature
                            </h2>
                            <div className="pl-14 space-y-4">
                                <p>
                                    <strong>6.1</strong> The Users will be provided with Contact Us features on the Website. The Users will be able to provide their contact details to enable Company to contact them.
                                </p>
                                <p>
                                    <strong>6.2</strong> The Users may further be provided with features to contact Company, raise queries, comments or interact with Company. However Company shall be at its sole discretion and be within its rights to answer, reply or opt not to reply to any such queries or comments.
                                </p>
                                <p>
                                    <strong>6.3</strong> By using the said features, User permits Company to contact them on their registered details, for any clarification or to offer any other service from time to time.
                                </p>
                            </div>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-2xl mb-4 flex items-center group">
                                <span className="bg-slate-100 text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-colors w-10 h-10 rounded-lg flex items-center justify-center text-lg mr-4 font-bold">7</span>
                                Breach
                            </h2>
                            <div className="pl-14 space-y-4">
                                <p>
                                    <strong>7.1</strong> Without prejudice to the other remedies available to Company under this Agreement or under applicable law, Company may limit the User’s activity, warn other Users of the User’s actions, immediately temporarily / indefinitely suspend or terminate the User’s use of the Website, and/or refuse to provide the User with access to the Website if the User is in breach of this Agreement.
                                </p>
                            </div>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-2xl mb-4 flex items-center group">
                                <span className="bg-slate-100 text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-colors w-10 h-10 rounded-lg flex items-center justify-center text-lg mr-4 font-bold">8</span>
                                Ownership and Proprietary Rights
                            </h2>
                            <div className="pl-14 space-y-4">
                                <p>
                                    <strong>8.1</strong> The content of the Website and all copyrights, patents, trademarks, service marks, trade names and all other intellectual property rights therein are owned by Company or validly licensed to Company and are protected by applicable Indian and international copyright and other intellectual property law. The User acknowledges, understands and agrees that he shall not have, nor be entitled to claim, any rights in and to the Website content and/or any portion thereof.
                                </p>
                                <p>
                                    <strong>8.2</strong> Some of the content on the Website have been permitted by the third party/ies to be used by Company in such form and manner as may be desired by Company and Company will makes its best endeavors to give credit to such third party/ies during publication of such content on its Website. If at any point in time any dispute is raised with respect to publication of such content, by any third party, Company shall be in its rights to remove such content or procure requisite consents from third party/ies.
                                </p>
                                <p>
                                    <strong>8.3</strong> Any copyrighted or other proprietary content distributed on or through the Website with the consent of the owner must contain the appropriate copyright or other proprietary rights notice. The unauthorized submission or distribution of copyrighted or other proprietary content is illegal and could subject the User to personal liability or criminal prosecution.
                                </p>
                            </div>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-2xl mb-4 flex items-center group">
                                <span className="bg-slate-100 text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-colors w-10 h-10 rounded-lg flex items-center justify-center text-lg mr-4 font-bold">9</span>
                                Limitation of Liability
                            </h2>
                            <div className="pl-14 space-y-4">
                                <p>
                                    <strong>9.1</strong> THE USER UNDERSTANDS AND EXPRESSLY AGREES THAT TO THE EXTENT PERMITTED UNDER APPLICABLE LAWS, IN NO EVENT WILL THE COMPANY OR ANY OF ITS AFFILIATES OR PARENT COMPANY OR ANY OF THEIR RESPECTIVE OFFICERS, EMPLOYEES, DIRECTORS, SHAREHOLDERS, AGENTS, OR LICENSORS BE LIABLE TO THE USER OR ANYONE ELSE UNDER ANY THEORY OF LIABILITY (WHETHER IN CONTRACT, TORT, STATUTORY, OR OTHERWISE) FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR EXEMPLARY DAMAGES, INCLUDING BUT NOT LIMITED TO, DAMAGES FOR LOSS OF REVENUES, PROFITS, GOODWILL, USE, DATA OR OTHER INTANGIBLE LOSSES (EVEN IF SUCH PARTIES WERE ADVISED OF, KNEW OF OR SHOULD HAVE KNOWN OF THE POSSIBILITY OF SUCH DAMAGES), RESULTING FROM THE USER’S USE OF OR INABILITY TO USE THE WEBSITE OR ANY PARTS THEREOF.
                                </p>
                            </div>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-2xl mb-4 flex items-center group">
                                <span className="bg-slate-100 text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-colors w-10 h-10 rounded-lg flex items-center justify-center text-lg mr-4 font-bold">10</span>
                                Indemnification
                            </h2>
                            <div className="pl-14 space-y-4">
                                <p>
                                    <strong>10.1</strong> The User agrees to indemnify, defend and hold harmless Company, its affiliates, group companies and their directors, officers, employees, agents, third party service providers, and any other third party providing any service to Company in relation to the Website whether directly or indirectly, from and against any and all losses, liabilities, claims, damages, costs and expenses (including legal fees and disbursements in connection therewith and interest chargeable thereon) asserted against or incurred by Company that arise out of, result from, or may be payable by virtue of, any breach or non-performance of any terms of this Agreement including any representation, warranty, covenant or agreement made or obligation to be performed by the User pursuant to this Agreement.
                                </p>
                            </div>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-2xl mb-4 flex items-center group">
                                <span className="bg-slate-100 text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-colors w-10 h-10 rounded-lg flex items-center justify-center text-lg mr-4 font-bold">11</span>
                                Severability
                            </h2>
                            <div className="pl-14 space-y-4">
                                <p>
                                    <strong>11.1</strong> If any provision of this Agreement is determined to be invalid or unenforceable in whole or in part, such invalidity or unenforceability shall attach only to such provision or part of such provision and the remaining part of such provision and all other provisions of this Agreement shall continue to be in full force and effect.
                                </p>
                            </div>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-2xl mb-4 flex items-center group">
                                <span className="bg-slate-100 text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-colors w-10 h-10 rounded-lg flex items-center justify-center text-lg mr-4 font-bold">12</span>
                                Force Majeure
                            </h2>
                            <div className="pl-14 space-y-4">
                                <p>
                                    <strong>12.1</strong> Company shall not be liable for any failure to perform any of its obligations under this Agreement or provide the Services or any part thereof if the performance is prevented, hindered or delayed by a Force Majeure Event and in such case its obligations shall be suspended for so long as the Force Majeure Event continues.
                                </p>
                            </div>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-2xl mb-4 flex items-center group">
                                <span className="bg-slate-100 text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-colors w-10 h-10 rounded-lg flex items-center justify-center text-lg mr-4 font-bold">13</span>
                                Governing Law
                            </h2>
                            <div className="pl-14 space-y-4">
                                <p>
                                    <strong>13.1</strong> This Agreement shall be governed by and constructed in accordance with the laws of India without reference to conflict of laws principles. In the event any dispute in relation hereto is brought by the User, it shall be subject to the exclusive jurisdiction of the courts of Delhi, India.
                                </p>
                            </div>
                        </section>


                        <div className="mt-16 pt-8 border-t border-slate-200">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                <Link href="/contact-us" className="inline-flex items-center text-blue-600 font-bold hover:text-blue-700 transition-colors">
                                    Have questions? Contact Support <span className="ml-2">→</span>
                                </Link>
                                <Link href="/privacy-policy" className="text-slate-500 hover:text-slate-700 font-medium">
                                    Read Privacy Policy
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
