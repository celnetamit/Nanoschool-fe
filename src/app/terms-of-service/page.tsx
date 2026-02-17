import PageTemplate from '@/components/templates/PageTemplate';
import { WordPressPost } from '@/lib/wordpress';

export const metadata = {
    title: 'Terms of Service | NanoSchool',
    description: 'Terms and Conditions for browsing and using the NanoSchool website.',
};

export default function TermsOfServicePage() {
    const post: WordPressPost = {
        id: 0,
        slug: 'terms-of-service',
        date: new Date().toISOString(),
        title: {
            rendered: 'Terms of Service',
        },
        content: {
            rendered: `
        <h2>1. ACCEPTANCE OF TERMS AND MODIFICATION THERE OF</h2>
        <p>1.1 Access of the Website by the User constitutes an acknowledgement and acceptance in full, of all the terms, conditions and notices as stated in this Agreement and without any modification and/or exception by the User of this Agreement. If the User does not agree with any part of such terms, conditions and notices as stated in this Agreement in any manner, the User must not access the Website.</p>
        <p>1.2 Company reserves the right to change the terms, conditions and notices pursuant to which the Website is accessed by the User, without any notice or intimation of such change.</p>

        <h2>2. LIMITED USER</h2>
        <p>2.1 The User agrees that given the nature of the Internet, even though the Website is targeted to Indian Residents only, it may be accessed in other parts of the world. The material/information on this Website is not intended for use by persons located in, or residents in countries that restrict the distribution of such material/information or by any person in any jurisdiction where distribution or use of such material/information or usage or access of Website will be contrary to law or any regulation. It shall be the responsibility of every User to be aware of and fully observe the applicable laws and regulations of the jurisdiction which User is subject of. If the User is not an Indian resident and yet uses this Website, he acknowledges, understands and agrees that he is doing so on his own initiative and at his own risk and Company shall not be liable for violation/breach of any of the laws applicable to usage of the Website. The Website is not to be and should not be construed as purporting to offer or inviting to offer any information to residents of countries where Company is not licensed or authorized to perform activities related to its objective.</p>
        <p>2.2 The User further agrees and undertakes not to reverse engineer, modify, copy, distribute, transmit, display, perform, reproduce, publish, license, create derivative works from, transfer, or sell any information, software, products, services or intellectual property obtained from the Website in any manner whatsoever. Reproduction, copying of the content for commercial or non-commercial purposes and unwarranted modification of data and information within the content of the Website is strictly not permitted without prior written consent from Company and/or third party owners. However, some of the content of our services or other files may be made available for download from the website which is permitted to be copied and/or used only for personal purposes of the User. The User and/or any third party is prohibited from running or displaying this Website and /or information displayed on this Website on any other Website or frames , without prior written consent from Company.</p>

        <h2>3. DISCLAIMER OF WARRANTIES</h2>
        <p>3.1 Company has endeavored to ensure that all the information provided by it on this Website is correct, but it neither warrants nor makes any representations regarding the quality, accuracy or completeness of any data or information displayed on this Website and Company shall not be, in any manner liable for inaccuracy/error if any. Company makes no warranty, express or implied, concerning the Website and/or its contents and disclaims all warranties of fitness for a particular purpose and warranties of merchantability in respect of information displayed and communicated through or on the Website, including any liability, responsibility or any other claim, whatsoever, in respect of any loss, whether direct or consequential, to any User or any other person, arising out of or from the use of any such information as is displayed or communicated through or on the Website or the provision of the Services.</p>
        <p>3.2 Company shall not be held responsible for non‐availability of the Website at any point in time for any reason whatsoever. The User understands and agrees that any material and/or data downloaded or otherwise obtained from Company through the Website is done entirely at his discretion and risk and he will be solely responsible for any damage to his computer systems or any other loss that results from such material and/or data.</p>

        <h2>4. LINKS TO THIRD PARTY SITES</h2>
        <p>4.1 The Website may contain links to other websites or may contain features of any nature of other websites on the Website (“Linked Sites”). The Linked Sites are not under the control of Company or the Website and Company is not responsible for the contents of any Linked Site, including without limitation any link or advertisement contained in a Linked Site, or any changes or updates to a Linked Site. Company is not responsible for any form of transmission, whatsoever, received by the User from any Linked Site. The inclusion of any link does not imply endorsement of any nature by Company or the Website of the Linked Sites or any association with its operators or owners.</p>
        <p>4.2 Company will be making calls and sending SMS through a thrid-party platform after The User’s registration in order to provide our service. The User’s registration means acceptance of the service.</p>
        <p>4.3 Company is not responsible for any errors, inclusions, omissions or representations on any Linked Site, or on any link contained in a Linked Site. The User is requested to verify the accuracy of all information on his own before undertaking any reliance on such information of such products/ services that they believe may benefit the User.</p>

        <h2>5. USER’S OBLIGATIONS</h2>
        <p>5.1 As a condition of access and use of the Website, the User warrants that he will not use the Website for any purpose that is unlawful or illegal under any law for the time being in force within or outside India or prohibited by this Agreement. In addition, the Website shall not be used in any manner, which could damage, disable, overburden or impair it or interfere with any other party’s use and/or enjoyment of the Website or infringe any intellectual property rights of Company or any third party.</p>

        <h2>6. CONTACT US FEATURE</h2>
        <p>6.1 The Users will be provided with Contact Us features on the Website. The Users will be able to provide their contact details to enable Company to contact them.</p>
        <p>6.2 The Users may further be provided with features to contact Company, raise queries, comments or interact with Company. However Company shall be at its sole discretion and be within its rights to answer, reply or opt not to reply to any such queries or comments.</p>
        <p>6.3 By using the said features, User permits Company to contact them on their registered details, for any clarification or to offer any other service from time to time.</p>

        <h2>7. BREACH</h2>
        <p>7.1 Without prejudice to the other remedies available to Company under this Agreement or under applicable law, Company may limit the User’s activity, warn other Users of the User’s actions, immediately temporarily / indefinitely suspend or terminate the User’s use of the Website, and/or refuse to provide the User with access to the Website if the User is in breach of this Agreement.</p>

        <h2>8. OWNERSHIP AND PROPRIETARY RIGHTS</h2>
        <p>8.1 The content of the Website and all copyrights, patents, trademarks, service marks, trade names and all other intellectual property rights therein are owned by Company or validly licensed to Company and are protected by applicable Indian and international copyright and other intellectual property law. The User acknowledges, understands and agrees that he shall not have, nor be entitled to claim, any rights in and to the Website content and/or any portion thereof.</p>
        <p>8.2 Some of the content on the Website have been permitted by the third party/ies to be used by Company in such form and manner as may be desired by Company and Company will makes its best endeavors to give credit to such third party/ies during publication of such content on its Website. If at any point in time any dispute is raised with respect to publication of such content, by any third party, Company shall be in its rights to remove such content or procure requisite consents from third party/ies.</p>
        <p>8.3 Any copyrighted or other proprietary content distributed on or through the Website with the consent of the owner must contain the appropriate copyright or other proprietary rights notice. The unauthorized submission or distribution of copyrighted or other proprietary content is illegal and could subject the User to personal liability or criminal prosecution.</p>

        <h2>9. LIMITATION OF LIABILITY</h2>
        <p>9.1 THE USER UNDERSTANDS AND EXPRESSLY AGREES THAT TO THE EXTENT PERMITTED UNDER APPLICABLE LAWS, IN NO EVENT WILL THE Company OR ANY OF ITS AFFILIATES OR PARENT COMPANY OR ANY OF THEIR RESPECTIVE OFFICERS, EMPLOYEES, DIRECTORS, SHAREHOLDERS, AGENTS, OR LICENSORS BE LIABLE TO THE USER OR ANYONE ELSE UNDER ANY THEORY OF LIABILITY (WHETHER IN CONTRACT, TORT, STATUTORY, OR OTHERWISE) FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR EXEMPLARY DAMAGES, INCLUDING BUT NOT LIMITED TO, DAMAGES FOR LOSS OF REVENUES, PROFITS, GOODWILL, USE, DATA OR OTHER INTANGIBLE LOSSES (EVEN IF SUCH PARTIES WERE ADVISED OF, KNEW OF OR SHOULD HAVE KNOWN OF THE POSSIBILITY OF SUCH DAMAGES), RESULTING FROM THE USER’S USE OF OR INABILITY TO USE THE WEBSITE OR ANY PARTS THEREOF.</p>

        <h2>10. INDEMNIFICATION</h2>
        <p>10.1 The User agrees to indemnify, defend and hold harmless Company, its affiliates, group companies and their directors, officers, employees, agents, third party service providers, and any other third party providing any service to Company in relation to the Website whether directly or indirectly, from and against any and all losses, liabilities, claims, damages, costs and expenses (including legal fees and disbursements in connection therewith and interest chargeable thereon) asserted against or incurred by Company that arise out of, result from, or may be payable by virtue of, any breach or non-performance of any terms of this Agreement including any representation, warranty, covenant or agreement made or obligation to be performed by the User pursuant to this Agreement.</p>

        <h2>11. SEVERABILITY</h2>
        <p>11.1 If any provision of this Agreement is determined to be invalid or unenforceable in whole or in part, such invalidity or unenforceability shall attach only to such provision or part of such provision and the remaining part of such provision and all other provisions of this Agreement shall continue to be in full force and effect.</p>

        <h2>12. FORCE MAJEURE</h2>
        <p>12.1 Company shall not be liable for any failure to perform any of its obligations under this Agreement or provide the Services or any part thereof if the performance is prevented, hindered or delayed by a Force Majeure Event and in such case its obligations shall be suspended for so long as the Force Majeure Event continues.</p>

        <h2>13. GOVERNING LAW</h2>
        <p>13.1 This Agreement shall be governed by and constructed in accordance with the laws of India without reference to conflict of laws principles. In the event any dispute in relation hereto is brought by the User, it shall be subject to the exclusive jurisdiction of the courts of Delhi, India.</p>
      `,
        },
        excerpt: {
            rendered: 'This Website User Agreement and the Privacy Policy lays out the terms and conditions and rules, as maybe amended and supplemented, from time to time.'
        },
        featured_media: 0,
    };

    return <PageTemplate post={post} />;
}
